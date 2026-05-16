// POST /api/distribute — Helius webhook handler
// Fires when treasury wallet receives SOL from pump.fun.
// Calculates 30% of received amount, distributes equally to
// the top 10 token holders who voted for the winning side.
//
// Required Cloudflare env vars (set as secrets in CF Pages dashboard):
//   TREASURY_PRIVATE_KEY  — base58-encoded 64-byte keypair
//   HELIUS_API_KEY        — already used by holders.js
//   TOKEN_MINT            — already used by holders.js / stats.js
//   HELIUS_WEBHOOK_SECRET — optional, but recommended
//   DB                    — D1 binding (already configured)

const TREASURY    = '4XDPm3nJGnvNxvTGNGiByohhwequXVdFgGnZf5TSg8T2'
const PUMP_FUN    = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
const SYSTEM_PROG = '11111111111111111111111111111111'
const DIST_PCT    = 0.30
const MAX_RECV    = 10
const MIN_DUST    = 5000  // lamports — don't send below ~$0.001 per person

// ── Base58 ────────────────────────────────────────────────────────────────────
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const B58_MAP = Object.fromEntries([...B58].map((c, i) => [c, i]))

function b58Decode(str) {
  const digits = []
  for (const ch of str) {
    let carry = B58_MAP[ch]
    if (carry === undefined) throw new Error('Invalid base58 char: ' + ch)
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] * 58
      digits[i] = carry & 0xff
      carry >>= 8
    }
    while (carry) { digits.push(carry & 0xff); carry >>= 8 }
  }
  let zeros = 0
  for (const ch of str) { if (ch !== '1') break; zeros++ }
  const out = new Uint8Array(zeros + digits.length)
  for (let i = 0; i < digits.length; i++) out[zeros + i] = digits[digits.length - 1 - i]
  return out
}

// ── PKCS#8 wrapper for a 32-byte Ed25519 seed (RFC 8410 / DER) ───────────────
function seedToPkcs8(seed) {
  return new Uint8Array([
    0x30, 0x2e,                         // SEQUENCE (46 bytes)
    0x02, 0x01, 0x00,                   // INTEGER 0 (version)
    0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, // SEQUENCE { OID id-Ed25519 }
    0x04, 0x22, 0x04, 0x20,             // OCTET STRING { OCTET STRING (32) }
    ...seed,
  ])
}

async function ed25519Sign(seed, message) {
  const key = await crypto.subtle.importKey(
    'pkcs8', seedToPkcs8(seed), { name: 'Ed25519' }, false, ['sign']
  )
  return new Uint8Array(await crypto.subtle.sign('Ed25519', key, message))
}

// ── Compact-u16 encoding (Solana wire format) ─────────────────────────────────
function cu16(n) {
  if (n < 0x80)   return [n]
  if (n < 0x4000) return [(n & 0x7f) | 0x80, (n >> 7) & 0x7f]
  return [(n & 0x7f) | 0x80, ((n >> 7) & 0x7f) | 0x80, (n >> 14) & 0x3]
}

function u64le(n) {
  const b = new Uint8Array(8)
  let v = BigInt(n)
  for (let i = 0; i < 8; i++) { b[i] = Number(v & 0xffn); v >>= 8n }
  return b
}

// Concatenate any mix of Uint8Arrays and plain arrays into one Uint8Array
function cat(...parts) {
  const arrays = parts.map(p => p instanceof Uint8Array ? p : new Uint8Array(p))
  const out = new Uint8Array(arrays.reduce((s, a) => s + a.length, 0))
  let off = 0
  for (const a of arrays) { out.set(a, off); off += a.length }
  return out
}

function toBase64(u8) {
  let s = ''
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
  return btoa(s)
}

// ── Solana legacy transaction builder ─────────────────────────────────────────
// Builds a single transaction with N SystemProgram::Transfer instructions
// signed by the treasury keypair.
async function buildAndSignTx(seed, fromPubkey, recipients, lamportsEach, blockhash) {
  const payer   = b58Decode(fromPubkey)
  const recvKeys = recipients.map(b58Decode)
  const sysKey  = b58Decode(SYSTEM_PROG)
  const bhBytes = b58Decode(blockhash)

  // Account order: [payer, ...recipients, SystemProgram]
  const keys   = [payer, ...recvKeys, sysKey]
  const sysIdx = keys.length - 1

  // Header: 1 required signer, 0 readonly signers, 1 readonly unsigned (SystemProgram)
  const header = new Uint8Array([1, 0, 1])

  // One Transfer instruction per recipient
  const ixs = recvKeys.map((_, i) => cat(
    [sysIdx],             // program_id_index
    cu16(2),              // 2 accounts
    [0, i + 1],           // payer, recipient[i]
    cu16(12),             // data length
    [2, 0, 0, 0],         // SystemInstruction::Transfer (little-endian u32 = 2)
    u64le(lamportsEach),  // amount
  ))

  const message = cat(
    header,
    cu16(keys.length), ...keys,
    bhBytes,
    cu16(ixs.length), ...ixs,
  )

  const sig = await ed25519Sign(seed, message)

  // Legacy tx wire format: [sig_count (cu16)] [signature] [message]
  return cat(cu16(1), sig, message)
}

// ── Helius JSON-RPC helper ────────────────────────────────────────────────────
function rpc(apiKey) {
  return async (method, params = []) => {
    const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    const json = await res.json()
    if (json.error) throw new Error(`RPC ${method}: ${json.error.message}`)
    return json.result
  }
}

// ── Round + winning side ──────────────────────────────────────────────────────
async function getWinningSide(db) {
  const now   = new Date()
  const start = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000)

  const round = await db.prepare('SELECT id FROM rounds WHERE start_time = ?').bind(start).first()
  if (!round) return null

  const { results } = await db.prepare(
    'SELECT side, COUNT(*) as count FROM votes WHERE round_id = ? GROUP BY side'
  ).bind(round.id).all()

  let doubt = 0, believe = 0
  for (const r of results) {
    if (r.side === 'doubt')   doubt   = r.count
    if (r.side === 'believe') believe = r.count
  }
  if (!doubt && !believe) return null

  return { roundId: round.id, winner: doubt >= believe ? 'doubt' : 'believe' }
}

// ── Recipient resolution ──────────────────────────────────────────────────────
// Returns up to MAX_RECV wallet addresses: top token holders who voted for `winner`.
async function getRecipients(winner, roundId, db, apiKey, tokenMint) {
  const { results } = await db.prepare(
    "SELECT wallet_address FROM votes WHERE round_id = ? AND side = ? AND wallet_address != ''"
  ).bind(roundId, winner).all()

  const winnerWallets = new Set(results.map(r => r.wallet_address))
  if (!winnerWallets.size) return []

  const call = rpc(apiKey)

  // Fetch top 20 token accounts so we have enough after filtering
  const [largest, supplyRes] = await Promise.all([
    call('getTokenLargestAccounts', [tokenMint]),
    call('getTokenSupply', [tokenMint]),
  ])

  const tokenAddrs = largest.value.slice(0, 20).map(a => a.address)
  const tokenInfos = await call('getMultipleAccounts', [tokenAddrs, { encoding: 'jsonParsed' }])

  const recipients = []
  for (let i = 0; i < tokenAddrs.length && recipients.length < MAX_RECV; i++) {
    const owner = tokenInfos.value[i]?.data?.parsed?.info?.owner
    if (owner && winnerWallets.has(owner)) recipients.push(owner)
  }
  return recipients
}

// ── Ensure distributions table exists ────────────────────────────────────────
async function ensureTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS distributions (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_signature     TEXT    NOT NULL UNIQUE,
      round_id         INTEGER,
      winner           TEXT,
      amount_lamports  INTEGER,
      recipient_count  INTEGER,
      processed_at     INTEGER DEFAULT (unixepoch())
    )
  `).run()
}

// ── Main processing logic ─────────────────────────────────────────────────────
async function processTx(tx, env) {
  const sig = tx.signature
  if (!sig) return

  if (env.DB) {
    await ensureTable(env.DB)
    const seen = await env.DB.prepare('SELECT id FROM distributions WHERE tx_signature = ?').bind(sig).first()
    if (seen) return // already processed
  }

  // Check it came from pump.fun (Helius labels source, fall back to program ID scan)
  const isPump = tx.source === 'PUMP_FUN'
    || (tx.accountData  || []).some(a => a.account     === PUMP_FUN)
    || (tx.instructions || []).some(i => i.programId   === PUMP_FUN)
  if (!isPump) return

  // Find how much SOL the treasury received
  const entry = (tx.accountData || []).find(a => a.account === TREASURY)
  if (!entry || entry.nativeBalanceChange <= 0) return

  const received     = entry.nativeBalanceChange
  const toDistribute = Math.floor(received * DIST_PCT)

  const roundInfo = env.DB ? await getWinningSide(env.DB) : null
  if (!roundInfo) return

  const { roundId, winner } = roundInfo
  const recipients = await getRecipients(winner, roundId, env.DB, env.HELIUS_API_KEY, env.TOKEN_MINT)
  if (!recipients.length) return

  const perRecipient = Math.floor(toDistribute / recipients.length)
  if (perRecipient < MIN_DUST) return

  // Build transaction and send
  const call         = rpc(env.HELIUS_API_KEY)
  const bh           = await call('getLatestBlockhash', [{ commitment: 'confirmed' }])
  const blockhash    = bh.value.blockhash
  const secretKey    = b58Decode(env.TREASURY_PRIVATE_KEY)
  const seed         = secretKey.slice(0, 32)
  const rawTx        = await buildAndSignTx(seed, TREASURY, recipients, perRecipient, blockhash)

  await call('sendTransaction', [toBase64(rawTx), { encoding: 'base64', skipPreflight: false }])

  if (env.DB) {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO distributions (tx_signature, round_id, winner, amount_lamports, recipient_count) VALUES (?, ?, ?, ?, ?)'
    ).bind(sig, roundId, winner, toDistribute, recipients.length).run()
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function onRequestPost({ request, env }) {
  // Kill switch — set DISTRIBUTION_ENABLED=false in CF Pages env vars to pause
  if (env.DISTRIBUTION_ENABLED === 'false') {
    return new Response('disabled', { status: 200 })
  }

  // Verify Helius webhook secret if configured
  const auth = request.headers.get('Authorization')
  if (env.HELIUS_WEBHOOK_SECRET && auth !== env.HELIUS_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body
  try { body = await request.json() }
  catch { return new Response('Bad Request', { status: 400 }) }

  const txs = Array.isArray(body) ? body : [body]
  for (const tx of txs) {
    try { await processTx(tx, env) }
    catch (e) { console.error('[distribute]', e.message) }
  }

  return new Response('ok', { status: 200 })
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  })
}
