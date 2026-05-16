// GET /api/price — returns live market cap + price
// D1 caches the DexScreener response for 2 seconds so concurrent users
// share one upstream call rather than each hitting DexScreener directly.

const CACHE_TTL = 2 // seconds

async function ensureCacheTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS price_cache (
      id         INTEGER PRIMARY KEY DEFAULT 1,
      data       TEXT    NOT NULL,
      fetched_at INTEGER NOT NULL
    )
  `).run()
}

export async function onRequestGet({ env }) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }

  const mint = env.TOKEN_MINT
  if (!mint || mint === 'TBA') {
    return new Response(JSON.stringify({ error: 'TOKEN_MINT not set' }), { status: 500, headers: cors })
  }

  // ── Serve from D1 cache if fresh ─────────────────────────────────────────
  if (env.DB) {
    try {
      await ensureCacheTable(env.DB)
      const cached = await env.DB.prepare('SELECT data, fetched_at FROM price_cache WHERE id = 1').first()
      if (cached && (Math.floor(Date.now() / 1000) - cached.fetched_at) < CACHE_TTL) {
        return new Response(cached.data, {
          headers: { ...cors, 'Cache-Control': 'no-store', 'X-Cache': 'HIT' },
        })
      }
    } catch {}
  }

  // ── Fetch fresh from DexScreener ─────────────────────────────────────────
  try {
    const res  = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`)
    const data = await res.json()

    const pairs = data.pairs || []
    if (pairs.length === 0) {
      return new Response(JSON.stringify({ error: 'No pairs found' }), { status: 404, headers: cors })
    }

    const pair   = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0]
    const payload = JSON.stringify({
      priceUsd:      parseFloat(pair.priceUsd || 0),
      marketCap:     pair.marketCap || pair.fdv || 0,
      priceChange1h:  pair.priceChange?.h1  || 0,
      priceChange24h: pair.priceChange?.h24 || 0,
      symbol:        pair.baseToken?.symbol || '',
      dex:           pair.dexId || '',
    })

    // Store in D1 cache (upsert on id=1)
    if (env.DB) {
      try {
        await env.DB.prepare(`
          INSERT INTO price_cache (id, data, fetched_at) VALUES (1, ?, ?)
          ON CONFLICT(id) DO UPDATE SET data = excluded.data, fetched_at = excluded.fetched_at
        `).bind(payload, Math.floor(Date.now() / 1000)).run()
      } catch {}
    }

    return new Response(payload, {
      headers: { ...cors, 'Cache-Control': 'no-store', 'X-Cache': 'MISS' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  })
}
