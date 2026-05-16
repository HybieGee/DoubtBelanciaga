// GET /api/config — returns public config values from CF env vars
export async function onRequestGet({ env }) {
  const mint = env.TOKEN_MINT || 'TBD'
  return new Response(JSON.stringify({
    contractAddress: mint,
    tokenReady: mint !== 'TBD' && mint.length > 10,
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  })
}
