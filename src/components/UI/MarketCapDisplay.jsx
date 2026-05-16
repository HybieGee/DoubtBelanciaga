import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

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
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const poll = async () => {
      try {
        const res  = await fetch(`/api/price?_=${Date.now()}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data.marketCap) {
          setCurrentMC(data.marketCap)
          setLoading(false)
        }
      } catch {}
    }
    poll()
    const iv = setInterval(poll, 5000)
    return () => clearInterval(iv)
  }, [])

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
          color:         !tokenReady || loading ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)',
        }}>
          {!tokenReady ? 'TBA' : loading ? '···' : fmtMC(currentMC)}
        </div>
      </div>
    </div>
  )
}

export default MarketCapDisplay
