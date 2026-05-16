// POST /api/choice — records a vote in D1 for the current round
// Body: { fingerprint, choice, walletAddress? }

function todayBoundaries() {
  const SIX_HOURS = 6 * 60 * 60 * 1000
  const now   = Date.now()
  const start = Math.floor(now / SIX_HOURS) * SIX_HOURS
  const end   = start + SIX_HOURS
  return { start: Math.floor(start / 1000), end: Math.floor(end / 1000) }
}

export async function onRequestPost({ request, env }) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }

  if (!env.DB) {
    return new Response(JSON.stringify({ success: true, fallback: true }), { headers: cors })
  }

  let body
  try { body = await request.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: cors })
  }

  const { fingerprint, choice, walletAddress } = body
  if (!fingerprint || !choice || !['doubt', 'believe'].includes(choice)) {
    return new Response(JSON.stringify({ error: 'fingerprint and valid choice required' }), { status: 400, headers: cors })
  }

  const { start } = todayBoundaries()
  const round = await env.DB.prepare('SELECT id FROM rounds WHERE start_time = ?').bind(start).first()
  if (!round) {
    return new Response(JSON.stringify({ error: 'No active round — fetch /api/stats first' }), { status: 404, headers: cors })
  }

  try {
    await env.DB.prepare(
      `INSERT INTO votes (round_id, wallet_address, fingerprint, side)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(round_id, fingerprint) DO NOTHING`
    ).bind(round.id, walletAddress || '', fingerprint, choice).run()

    return new Response(JSON.stringify({ success: true, round: round.id }), { headers: cors })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS' },
  })
}
