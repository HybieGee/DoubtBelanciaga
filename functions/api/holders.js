export async function onRequestGet({ request, env }) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  const { searchParams } = new URL(request.url)
  const mint  = searchParams.get('mint')
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20)

  if (!mint) {
    return new Response(JSON.stringify({ error: 'mint param required' }), { status: 400, headers: cors })
  }

  if (!env.HELIUS_API_KEY) {
    return new Response(JSON.stringify({ error: 'HELIUS_API_KEY secret not configured' }), { status: 500, headers: cors })
  }

  const rpc = async (method, params) => {
    const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${env.HELIUS_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.result
  }

  try {
    // Run these two in parallel — neither depends on the other
    const [largest, supplyRes] = await Promise.all([
      rpc('getTokenLargestAccounts', [mint]),
      rpc('getTokenSupply', [mint]),
    ])

    const accounts    = largest.value.slice(0, limit)
    const totalSupply = parseFloat(supplyRes.value.uiAmountString || supplyRes.value.uiAmount || '0')

    // Resolve all owner wallets in one batched call
    const addresses = accounts.map((a) => a.address)
    const infos     = await rpc('getMultipleAccounts', [addresses, { encoding: 'jsonParsed' }])

    const holders = accounts.map((acc, i) => {
      const parsed = infos.value[i]?.data?.parsed?.info
      const owner  = parsed?.owner ?? acc.address
      const amount = acc.uiAmount ?? 0
      return {
        owner_address: owner,
        balance_formatted: String(amount),
        percentage_relative_to_total_supply: totalSupply > 0 ? (amount / totalSupply) * 100 : 0,
      }
    })

    return new Response(JSON.stringify(holders), {
      headers: { ...cors, 'Cache-Control': 'public, max-age=120' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}
