// API endpoints for game logic
// In production, these would connect to Cloudflare Workers/Durable Objects

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const submitChoice = async (fingerprint, choice) => {
  try {
    const response = await fetch(`${API_BASE}/choice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fingerprint,
        choice,
        timestamp: Date.now(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to submit choice')
    }

    return await response.json()
  } catch (error) {
    console.error('Error submitting choice:', error)
    // Fallback for development
    return {
      success: true,
      round: Math.floor(Date.now() / 3600000),
    }
  }
}

export const getRoundStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/stats`)

    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      doubtCount: 0, believeCount: 0,
      totalPool: '0.0000', currentPrice: 0, priceChange: '0.00',
      startMarketCap: null,
    }
  }
}

export const claimReward = async (fingerprint, walletAddress) => {
  try {
    const response = await fetch(`${API_BASE}/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fingerprint,
        walletAddress,
        timestamp: Date.now(),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to claim reward')
    }

    return await response.json()
  } catch (error) {
    console.error('Error claiming reward:', error)
    // Fallback for development
    return {
      success: true,
      txHash: '0x' + Math.random().toString(16).slice(2),
    }
  }
}

export const joinSide = async (walletAddress, fingerprint, side) => {
  try {
    const response = await fetch(`${API_BASE}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, fingerprint, side, timestamp: Date.now() }),
    })
    if (!response.ok) throw new Error('Failed to join')
    return await response.json()
  } catch (error) {
    // Fallback: persist locally until backend is live
    localStorage.setItem(`joined_${walletAddress}`, side)
    return { success: true, side }
  }
}

export const getPriceData = async () => {
  try {
    const response = await fetch(`${API_BASE}/price`)

    if (!response.ok) {
      throw new Error('Failed to fetch price')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching price:', error)
    return { priceUsd: 0, marketCap: 0, priceChange1h: 0, priceChange24h: 0 }
  }
}
