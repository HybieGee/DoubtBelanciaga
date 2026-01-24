import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useState, useEffect } from 'react'
import { claimReward } from '../../api/game'

const Results = () => {
  const userChoice = useGameStore((state) => state.userChoice)
  const walletAddress = useGameStore((state) => state.walletAddress)
  const fingerprint = useGameStore((state) => state.fingerprint)
  const priceChange = useGameStore((state) => state.priceChange)
  const reset = useGameStore((state) => state.reset)

  const [reward, setReward] = useState(0)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const winner =
    (priceChange > 0 && userChoice === 'believe') ||
    (priceChange < 0 && userChoice === 'doubt')

  useEffect(() => {
    if (winner) {
      // Calculate reward (mock for now)
      setReward(0.05 + Math.random() * 0.1)
    }
  }, [winner])

  const handleClaim = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet to claim rewards')
      return
    }

    setClaiming(true)
    try {
      await claimReward(fingerprint, walletAddress)
      setClaimed(true)
    } catch (error) {
      console.error('Failed to claim reward:', error)
      alert('Failed to claim reward. Please try again.')
    } finally {
      setClaiming(false)
    }
  }

  const handlePlayAgain = () => {
    reset()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: winner
          ? 'linear-gradient(135deg, #0f0 0%, #090 100%)'
          : 'linear-gradient(135deg, #f00 0%, #900 100%)',
        border: '4px solid #fff',
        padding: '3rem',
        textAlign: 'center',
        minWidth: '500px',
        zIndex: 100,
        boxShadow: '0 0 50px rgba(255,255,255,0.5)',
      }}
    >
      <motion.h2
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#fff',
          letterSpacing: '0.2em',
        }}
      >
        {winner ? 'VICTORY' : 'DEFEAT'}
      </motion.h2>

      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#fff' }}>
        {winner
          ? 'Your faith was rewarded'
          : 'Your conviction was tested'}
      </p>

      <div
        style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '2px solid rgba(255,255,255,0.5)',
        }}
      >
        <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem' }}>
          PRICE CHANGE
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
          {priceChange >= 0 ? '+' : ''}{priceChange}%
        </div>

        {winner && (
          <>
            <div style={{ fontSize: '0.9rem', color: '#fff', marginTop: '1rem', marginBottom: '0.5rem' }}>
              YOUR REWARD
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
              {reward.toFixed(4)} ETH
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {winner && !claimed && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClaim}
            disabled={claiming}
            style={{
              padding: '1rem 2rem',
              background: '#fff',
              color: '#000',
              border: 'none',
              cursor: claiming ? 'default' : 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              opacity: claiming ? 0.5 : 1,
            }}
          >
            {claiming ? 'CLAIMING...' : 'CLAIM REWARD'}
          </motion.button>
        )}

        {claimed && (
          <div style={{ color: '#fff', fontSize: '1rem', padding: '1rem' }}>
            ✓ Reward claimed successfully!
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayAgain}
          style={{
            padding: '1rem 2rem',
            background: 'transparent',
            color: '#fff',
            border: '2px solid #fff',
            cursor: 'pointer',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}
        >
          PLAY AGAIN
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Results
