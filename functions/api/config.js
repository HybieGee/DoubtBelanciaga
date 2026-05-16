// GET /api/config — returns public config values from CF env vars
export async function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    contractAddress: env.TOKEN_MINT || 'TBD',
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
