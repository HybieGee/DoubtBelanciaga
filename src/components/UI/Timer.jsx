import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const minutes = 59 - now.getMinutes()
      const seconds = 59 - now.getSeconds()

      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      setProgress(((60 - minutes) * 60 + (60 - seconds)) / 3600)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        {/* Background circle */}
        <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="#333"
            strokeWidth="3"
          />
          <motion.circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress)}`}
            strokeLinecap="round"
            animate={{ strokeDashoffset: `${2 * Math.PI * 26 * (1 - progress)}` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {timeLeft}
        </div>
      </div>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '0.1em' }}>
          NEXT ROUND
        </div>
        <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>
          {timeLeft}
        </div>
      </div>
    </div>
  )
}

export default Timer
