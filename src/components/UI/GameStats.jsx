import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useState, useEffect } from 'react'
import { getRoundStats } from '../../api/game'

const GameStats = () => {
  const userChoice = useGameStore((state) => state.userChoice)
  const fingerprint = useGameStore((state) => state.fingerprint)
  const [stats, setStats] = useState({
    doubtCount: 0,
    believeCount: 0,
    totalPool: 0,
    currentPrice: 0,
    priceChange: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getRoundStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const doubtPercent = stats.doubtCount + stats.believeCount > 0
    ? (stats.doubtCount / (stats.doubtCount + stats.believeCount)) * 100
    : 50

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #fff',
        padding: '2rem',
        minWidth: '600px',
        zIndex: 50,
      }}
    >
      {/* Your choice indicator */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
          YOU CHOSE
        </div>
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: userChoice === 'doubt' ? '#f00' : '#0f0',
            letterSpacing: '0.2em',
          }}
        >
          {userChoice?.toUpperCase()}
        </div>
      </div>

      {/* Distribution bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: '#f00' }}>DOUBT: {stats.doubtCount}</span>
          <span style={{ color: '#0f0' }}>BELIEVE: {stats.believeCount}</span>
        </div>
        <div
          style={{
            height: '20px',
            background: '#333',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            animate={{ width: `${doubtPercent}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #f00 0%, #900 100%)',
              position: 'absolute',
              left: 0,
            }}
          />
          <motion.div
            animate={{ width: `${100 - doubtPercent}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #090 0%, #0f0 100%)',
              position: 'absolute',
              right: 0,
            }}
          />
        </div>
      </div>

      {/* Pool and price info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
            TOTAL POOL
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
            {stats.totalPool.toFixed(4)} ETH
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
            PRICE CHANGE
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: stats.priceChange >= 0 ? '#0f0' : '#f00',
            }}
          >
            {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>
        Waiting for round to complete...
      </div>
    </motion.div>
  )
}

export default GameStats
