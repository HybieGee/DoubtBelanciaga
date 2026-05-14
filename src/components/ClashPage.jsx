import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getRoundStats } from '../api/game'
import './ClashPage.css'

const ClashPage = () => {
  const setShowClash = useGameStore((s) => s.setShowClash)
  const joinedSide = useGameStore((s) => s.joinedSide)

  const [stats, setStats] = useState({ doubtCount: 0, believeCount: 0 })

  useEffect(() => {
    const poll = async () => {
      try { const d = await getRoundStats(); setStats(d) } catch {}
    }
    poll()
    const iv = setInterval(poll, 15000)
    return () => clearInterval(iv)
  }, [])

  const total = (stats.doubtCount || 0) + (stats.believeCount || 0)
  const rawDoubtPct = total > 0 ? (stats.doubtCount / total) * 100 : 50
  const rawBelievePct = total > 0 ? (stats.believeCount / total) * 100 : 50

  // Clamp 8-92% so neither side is invisible
  const doubtPct = Math.min(92, Math.max(8, rawDoubtPct))
  const believePct = 100 - doubtPct

  return (
    <motion.div
      className="clash-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* DOUBT SIDE */}
      <div
        className="clash-side clash-side--doubt"
        style={{ flex: doubtPct }}
      >
        <div className="clash-side-content">
          <div className="clash-label clash-label--doubt">DOUBT</div>
          <div className="clash-count clash-count--doubt">{stats.doubtCount}</div>
          <div className="clash-pct clash-pct--doubt">{rawDoubtPct.toFixed(1)}%</div>
          {joinedSide === 'doubt' && (
            <div className="clash-badge clash-badge--doubt">YOUR SIDE</div>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="clash-divider" />

      {/* BELIEVE SIDE */}
      <div
        className="clash-side clash-side--believe"
        style={{ flex: believePct }}
      >
        <div className="clash-side-content">
          <div className="clash-label clash-label--believe">BELIEF</div>
          <div className="clash-count clash-count--believe">{stats.believeCount}</div>
          <div className="clash-pct clash-pct--believe">{rawBelievePct.toFixed(1)}%</div>
          {joinedSide === 'believe' && (
            <div className="clash-badge clash-badge--believe">YOUR SIDE</div>
          )}
        </div>
      </div>

      {/* BACK BUTTON */}
      <button className="clash-back" onClick={() => setShowClash(false)}>
        &#8592; BACK
      </button>

      {/* LIVE INDICATOR */}
      <div className="clash-live">
        <span className="clash-live-dot" />
        LIVE
      </div>
    </motion.div>
  )
}

export default ClashPage
