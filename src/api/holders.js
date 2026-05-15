const HELIUS_KEY = import.meta.env.VITE_HELIUS_API_KEY
const TOKEN_MINT = import.meta.env.VITE_TEST_TOKEN_ADDRESS || 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'

// Solana-style mock data — used when no API key is configured
const MOCK_HOLDERS = [
  { owner_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', balance_formatted: '420690000000', percentage_relative_to_total_supply: 15.23 },
  { owner_address: 'GThUX1Atko4tqhN2NaiTazFAcaPBFv3VPqjfnSsJmDkS', balance_formatted: '169420000000', percentage_relative_to_total_supply:  6.12 },
  { owner_address: 'Hj3X9QvZ2mK8nRpLsAeTdCbF4wYuNgMoViPqWxJcEt1D', balance_formatted:  '98760000000', percentage_relative_to_total_supply:  3.57 },
  { owner_address: '3fZwQkRmXpN7aBcDsEtFgHiJkLmNoPqRsTuVwXyZ2A4B', balance_formatted:  '77330000000', percentage_relative_to_total_supply:  2.80 },
  { owner_address: 'BqRsT5uVwXyZ1a2B3cD4eF5gH6iJ7kL8mN9oP0qR1sT', balance_formatted:  '55210000000', percentage_relative_to_total_supply:  2.00 },
  { owner_address: 'CrStU6vWxYz2b3C4dE5fG6hI7jK8lM9nO0pQ1rS2tU3', balance_formatted:  '42069000000', percentage_relative_to_total_supply:  1.52 },
  { owner_address: 'DsTuV7wXyZ3c4D5eF6gH7iJ8kL9mN0oP1qR2sT3uV4w', balance_formatted:  '33100000000', percentage_relative_to_total_supply:  1.20 },
  { owner_address: 'EtUvW8xYz4d5E6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY', balance_formatted:  '21000000000', percentage_relative_to_total_supply:  0.76 },
  { owner_address: 'FuVwX9yZ5e6F7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZa', balance_formatted:  '15500000000', percentage_relative_to_total_supply:  0.56 },
  { owner_address: 'GvWxY0zA6f7G8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zAb', balance_formatted:  '11200000000', percentage_relative_to_total_supply:  0.41 },
]

async function rpc(method, params) {
  const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.result
}

export async function getTopHolders(limit = 10) {
  if (!HELIUS_KEY) return MOCK_HOLDERS.slice(0, limit)

  try {
    // 1 credit — top token accounts by balance (max 20 returned by Solana RPC)
    const largest = await rpc('getTokenLargestAccounts', [TOKEN_MINT])
    const accounts = largest.value.slice(0, limit)

    // 1 credit — total supply for percentage calculation
    const supplyRes = await rpc('getTokenSupply', [TOKEN_MINT])
    const totalSupply = parseFloat(supplyRes.value.uiAmountString || supplyRes.value.uiAmount || '0')

    // 1 credit — resolve all owner wallets in one batched call
    const addresses = accounts.map((a) => a.address)
    const infos = await rpc('getMultipleAccounts', [addresses, { encoding: 'jsonParsed' }])

    return accounts.map((acc, i) => {
      const parsed = infos.value[i]?.data?.parsed?.info
      const owner  = parsed?.owner ?? acc.address
      const amount = acc.uiAmount ?? 0
      const pct    = totalSupply > 0 ? (amount / totalSupply) * 100 : 0
      return {
        owner_address: owner,
        balance_formatted: String(amount),
        percentage_relative_to_total_supply: pct,
      }
    })
  } catch {
    return MOCK_HOLDERS.slice(0, limit)
  }
}
