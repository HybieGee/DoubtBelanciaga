import { useState, useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

function getMcColor(pctChange) {
  const MAX = 15
  const t   = Math.max(-1, Math.min(1, pctChange / MAX))
  if (t <= 0) {
    const c = Math.round(255 * (1 + t))
    return `rgb(255, ${c}, ${c})`
  } else {
    const c = Math.round(255 * (1 - t))
    return `rgb(${c}, 255, ${c})`
  }
}

function fmtMC(val) {
  if (!val || val === 0) return '--'
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`
  if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`
  return `$${val.toFixed(0)}`
}

const MarketCapDisplay = () => {
  const tokenReady  = useGameStore((s) => s.tokenReady)
  const [currentMC, setCurrentMC] = useState(null)
  const [startMC,   setStartMC]   = useState(null)
  const [pctChange, setPctChange] = useState(0)
  const [loading,   setLoading]   = useState(true)
  const startMCRef = useRef(null)

  useEffect(() => {
    const fetchStart = async () => {
      try {
        const res  = await fetch('/api/stats')
        if (!res.ok) return
        const data = await res.json()
        if (data.startMarketCap) {
          setStartMC(data.startMarketCap)
          startMCRef.current = data.startMarketCap
        }
      } catch {}
    }
    fetchStart()
  }, [])

  useEffect(() => {
    const poll = async () => {
      try {
        const res  = await fetch('/api/price')
        if (!res.ok) return
        const data = await res.json()
        if (data.marketCap) {
          setCurrentMC(data.marketCap)
          if (startMCRef.current && startMCRef.current > 0) {
            setPctChange(((data.marketCap - startMCRef.current) / startMCRef.current) * 100)
          }
          setLoading(false)
        }
      } catch {}
    }
    poll()
    const iv = setInterval(poll, 30000)
    return () => clearInterval(iv)
  }, [])

  const color = getMcColor(pctChange)

  return (
    <div className="market-cap-display" style={{
      position:       'relative',
      width:          'clamp(330px, 33vw, 450px)',
      aspectRatio:    '3 / 1',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      pointerEvents:  'none',
    }}>
      <img
        src="/marketcap.png"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <div style={{
        position:   'relative',
        textAlign:  'center',
        fontFamily: "'Courier New', monospace",
        zIndex:     1,
      }}>
        <div style={{
          fontSize:      'clamp(1.275rem, 2.1vw, 1.65rem)',
          fontWeight:    'bold',
          letterSpacing: '0.06em',
          color:         !tokenReady || loading ? 'rgba(255,255,255,0.4)' : color,
          transition:    'color 1s ease',
          textShadow:    !tokenReady || loading ? 'none' : `0 0 18px ${color}`,
        }}>
          {!tokenReady ? 'TBD' : loading ? '···' : fmtMC(currentMC)}
        </div>
      </div>
    </div>
  )
}

export default MarketCapDisplay
