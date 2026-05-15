// GET /api/stats — returns current round vote counts + round market cap data
// Requires D1 binding named DB (set in CF Pages dashboard → Functions → D1 bindings)

function todayBoundaries() {
  const now  = new Date()
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const end   = start + 86400000
  return { start: Math.floor(start / 1000), end: Math.floor(end / 1000) }
}

async function fetchStartingMC(tokenMint) {
  try {
    const res  = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenMint}`)
    const data = await res.json()
    const pairs = (data.pairs || []).sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
    return pairs[0]?.marketCap || pairs[0]?.fdv || 0
  } catch {
    return 0
  }
}

export async function onRequestGet({ env }) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }

  if (!env.DB) {
    // No D1 bound yet — return zeros so the fake offset in ClashPage is the only count
    return new Response(JSON.stringify({
      doubtCount: 0, believeCount: 0,
      roundEndTime: null, startMarketCap: null,
    }), { headers: cors })
  }

  const { start, end } = todayBoundaries()

  // Get or create today's round
  let round = await env.DB.prepare(
    'SELECT * FROM rounds WHERE start_time = ?'
  ).bind(start).first()

  if (!round) {
    const startMC = await fetchStartingMC(env.TOKEN_MINT || '')
    await env.DB.prepare(
      'INSERT OR IGNORE INTO rounds (start_time, end_time, start_market_cap) VALUES (?, ?, ?)'
    ).bind(start, end, startMC).run()
    round = await env.DB.prepare('SELECT * FROM rounds WHERE start_time = ?').bind(start).first()
  }

  if (!round) {
    return new Response(JSON.stringify({ doubtCount: 0, believeCount: 0, roundEndTime: null, startMarketCap: null }), { headers: cors })
  }

  const { results } = await env.DB.prepare(
    'SELECT side, COUNT(*) as count FROM votes WHERE round_id = ? GROUP BY side'
  ).bind(round.id).all()

  const counts = { doubt: 0, believe: 0 }
  results.forEach((r) => { counts[r.side] = r.count })

  return new Response(JSON.stringify({
    doubtCount:     counts.doubt,
    believeCount:   counts.believe,
    roundId:        round.id,
    roundEndTime:   round.end_time * 1000,
    startMarketCap: round.start_market_cap,
  }), { headers: { ...cors, 'Cache-Control': 'no-store' } })
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  })
}
