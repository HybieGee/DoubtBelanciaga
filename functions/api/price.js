// Fetches live price + market cap from DexScreener — no API key required
// Works for any Solana token including pump.fun launches

export async function onRequestGet({ env }) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  const mint = env.TOKEN_MINT
  if (!mint) {
    return new Response(JSON.stringify({ error: 'TOKEN_MINT not set' }), { status: 500, headers: cors })
  }

  try {
    const res  = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`)
    const data = await res.json()

    const pairs = data.pairs || []
    if (pairs.length === 0) {
      return new Response(JSON.stringify({ error: 'No pairs found for this token' }), { status: 404, headers: cors })
    }

    // Pick the pair with the highest liquidity
    const pair = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0]

    return new Response(JSON.stringify({
      priceUsd:     parseFloat(pair.priceUsd || 0),
      marketCap:    pair.marketCap || pair.fdv || 0,
      priceChange1h: pair.priceChange?.h1  || 0,
      priceChange24h: pair.priceChange?.h24 || 0,
      symbol:       pair.baseToken?.symbol || '',
      dex:          pair.dexId || '',
    }), {
      headers: { ...cors, 'Cache-Control': 'public, max-age=30' },
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
