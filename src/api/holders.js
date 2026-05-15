// Token mint is controlled server-side via CF env var TOKEN_MINT — no address in this bundle

const MOCK_HOLDERS = [
  { owner_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', balance_formatted: '42069000',   percentage_relative_to_total_supply: 15.23 },
  { owner_address: 'GThUX1Atko4tqhN2NaiTazFAcaPBFv3VPqjfnSsJmDkS', balance_formatted: '16942000',   percentage_relative_to_total_supply:  6.12 },
  { owner_address: 'Hj3X9QvZ2mK8nRpLsAeTdCbF4wYuNgMoViPqWxJcEt1D', balance_formatted:  '9876000',   percentage_relative_to_total_supply:  3.57 },
  { owner_address: '3fZwQkRmXpN7aBcDsEtFgHiJkLmNoPqRsTuVwXyZ2A4B', balance_formatted:  '7733000',   percentage_relative_to_total_supply:  2.80 },
  { owner_address: 'BqRsT5uVwXyZ1a2B3cD4eF5gH6iJ7kL8mN9oP0qR1sT', balance_formatted:  '5521000',   percentage_relative_to_total_supply:  2.00 },
  { owner_address: 'CrStU6vWxYz2b3C4dE5fG6hI7jK8lM9nO0pQ1rS2tU3', balance_formatted:  '4206900',   percentage_relative_to_total_supply:  1.52 },
  { owner_address: 'DsTuV7wXyZ3c4D5eF6gH7iJ8kL9mN0oP1qR2sT3uV4w', balance_formatted:  '3310000',   percentage_relative_to_total_supply:  1.20 },
  { owner_address: 'EtUvW8xYz4d5E6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY', balance_formatted:  '2100000',   percentage_relative_to_total_supply:  0.76 },
  { owner_address: 'FuVwX9yZ5e6F7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZa', balance_formatted:  '1550000',   percentage_relative_to_total_supply:  0.56 },
  { owner_address: 'GvWxY0zA6f7G8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zAb', balance_formatted:  '1120000',   percentage_relative_to_total_supply:  0.41 },
]

export async function getTopHolders() {
  try {
    const res = await fetch('/api/holders')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) throw new Error('empty')
    return data
  } catch {
    return MOCK_HOLDERS
  }
}
