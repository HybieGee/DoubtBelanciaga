import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SIX_HOURS = 6 * 60 * 60 * 1000

const getNextSixHourBoundary = () => {
  const now = Date.now()
  const epoch6h = Math.ceil(now / SIX_HOURS) * SIX_HOURS
  return epoch6h
}

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now()
      const end = getNextSixHourBoundary()
      const ms = Math.max(0, end - now)

      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)

      setTimeLeft(
        h > 0
          ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
          : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      )
      setProgress(1 - ms / SIX_HOURS)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const circumference = 2 * Math.PI * 26

  return (
    <div style={{ position: 'relative', width: 60, height: 60 }}>
      <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="30" cy="30" r="26" fill="none" stroke="#333" strokeWidth="3" />
        <motion.circle
          cx="30"
          cy="30"
          r="26"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '0.65rem',
          fontWeight: 'bold',
          color: '#fff',
          whiteSpace: 'nowrap',
        }}
      >
        {timeLeft}
      </div>
    </div>
  )
}

export default Timer
