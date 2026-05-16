// GET /api/admin/winners?key=YOUR_ADMIN_KEY
// Private endpoint — shows current round winner, top holder addresses,
// and full distribution history. Set ADMIN_KEY in CF env vars.

const SYSTEM_PROGRAM = '11111111111111111111111111111111'

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key')

  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!env.DB) {
    return json({ error: 'No DB bound' })
  }

  // Current round
  const now   = new Date()
  const start = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000)
  const round = await env.DB.prepare('SELECT * FROM rounds WHERE start_time = ?').bind(start).first()

  let roundInfo = null
  let winner    = null
  let recipients = []

  if (round) {
    const { results: voteCounts } = await env.DB.prepare(
      'SELECT side, COUNT(*) as count FROM votes WHERE round_id = ? GROUP BY side'
    ).bind(round.id).all()

    let doubt = 0, believe = 0
    for (const r of voteCounts) {
      if (r.side === 'doubt')   doubt   = r.count
      if (r.side === 'believe') believe = r.count
    }

    winner = doubt >= believe ? 'doubt' : 'believe'

    roundInfo = {
      id:        round.id,
      startTime: new Date(round.start_time * 1000).toUTCString(),
      endTime:   new Date(round.end_time   * 1000).toUTCString(),
      doubt,
      believe,
      winner,
    }

    // All wallets on winning side
    if (env.HELIUS_API_KEY && env.TOKEN_MINT) {
      const { results: sideVotes } = await env.DB.prepare(
        "SELECT wallet_address FROM votes WHERE round_id = ? AND side = ? AND wallet_address != ''"
      ).bind(round.id, winner).all()

      const winnerWallets = new Set(sideVotes.map(r => r.wallet_address))

      if (winnerWallets.size) {
        try {
          const rpc = async (method, params) => {
            const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${env.HELIUS_API_KEY}`, {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
            })
            const d = await res.json()
            if (d.error) throw new Error(d.error.message)
            return d.result
          }

          const [largest] = await Promise.all([
            rpc('getTokenLargestAccounts', [env.TOKEN_MINT]),
          ])

          const tokenAddrs = largest.value.slice(0, 20).map(a => a.address)
          const tokenInfos = await rpc('getMultipleAccounts', [tokenAddrs, { encoding: 'jsonParsed' }])

          for (let i = 0; i < tokenAddrs.length && recipients.length < 10; i++) {
            const info  = tokenInfos.value[i]?.data?.parsed?.info
            const owner = info?.owner
            if (owner && winnerWallets.has(owner)) {
              recipients.push({
                rank:    recipients.length + 1,
                address: owner,
                balance: info?.tokenAmount?.uiAmountString ?? '?',
              })
            }
          }
        } catch (e) {
          recipients = [{ error: e.message }]
        }
      }
    }
  }

  // Distribution history
  let history = []
  try {
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS distributions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tx_signature TEXT NOT NULL UNIQUE,
        round_id INTEGER,
        winner TEXT,
        amount_lamports INTEGER,
        recipient_count INTEGER,
        processed_at INTEGER DEFAULT (unixepoch())
      )
    `).run()

    const { results } = await env.DB.prepare(
      'SELECT * FROM distributions ORDER BY processed_at DESC LIMIT 50'
    ).all()

    history = results.map(r => ({
      txSignature:   r.tx_signature,
      winner:        r.winner,
      amountSOL:     r.amount_lamports ? (r.amount_lamports / 1e9).toFixed(6) : null,
      recipients:    r.recipient_count,
      processedAt:   new Date(r.processed_at * 1000).toUTCString(),
    }))
  } catch {}

  return json({ round: roundInfo, topHoldersOnWinningSide: recipients, distributionHistory: history })
}

function json(data) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
