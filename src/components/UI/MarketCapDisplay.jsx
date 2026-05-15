import { useState, useEffect } from 'react'

// Maps % change from round start to a red → white → green colour
function getMcColor(pctChange) {
  const MAX = 15 // saturates at ±15%
  const t   = Math.max(-1, Math.min(1, pctChange / MAX)) // -1 to +1
  if (t <= 0) {
    const c = Math.round(255 * (1 + t))
    return `rgb(255, ${c}, ${c})` // white → red
  } else {
    const c = Math.round(255 * (1 - t))
    return `rgb(${c}, 255, ${c})` // white → green
  }
}

function fmtMC(val) {
  if (!val || val === 0) return '--'
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`
  if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`
  return `$${val.toFixed(0)}`
}

const MarketCapDisplay = ({ startMarketCap }) => {
  const [currentMC, setCurrentMC]   = useState(null)
  const [pctChange, setPctChange]    = useState(0)
  const [loading,   setLoading]      = useState(true)

  useEffect(() => {
    const poll = async () => {
      try {
        const res  = await fetch('/api/price')
        if (!res.ok) return
        const data = await res.json()
        setCurrentMC(data.marketCap)

        if (startMarketCap && startMarketCap > 0 && data.marketCap > 0) {
          setPctChange(((data.marketCap - startMarketCap) / startMarketCap) * 100)
        }
        setLoading(false)
      } catch {}
    }

    poll()
    const iv = setInterval(poll, 30000)
    return () => clearInterval(iv)
  }, [startMarketCap])

  const color     = getMcColor(pctChange)
  const sign      = pctChange >= 0 ? '+' : ''
  const hasChange = startMarketCap && startMarketCap > 0 && !loading

  return (
    <div style={{
      position:   'relative',
      width:      'clamp(220px, 22vw, 300px)',
      aspectRatio: '3 / 1',
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      {/* Frame image */}
      <img
        src="/marketcap.png"
        alt=""
        style={{
          position: 'absolute',
          inset:    0,
          width:    '100%',
          height:   '100%',
          objectFit: 'contain',
        }}
      />

      {/* Content overlaid on frame */}
      <div style={{
        position:  'relative',
        textAlign: 'center',
        fontFamily: "'Courier New', monospace",
        zIndex:    1,
      }}>
        <div style={{
          fontSize:      'clamp(0.45rem, 0.65vw, 0.6rem)',
          letterSpacing: '0.2em',
          color:         'rgba(255,255,255,0.4)',
          marginBottom:  '0.15em',
        }}>
          MARKET CAP
        </div>

        <div style={{
          fontSize:      'clamp(0.85rem, 1.4vw, 1.1rem)',
          fontWeight:    'bold',
          letterSpacing: '0.06em',
          color:         loading ? 'rgba(255,255,255,0.3)' : color,
          transition:    'color 1s ease',
          textShadow:    loading ? 'none' : `0 0 18px ${color}`,
        }}>
          {loading ? '···' : fmtMC(currentMC)}
        </div>

        {hasChange && (
          <div style={{
            fontSize:      'clamp(0.45rem, 0.65vw, 0.58rem)',
            letterSpacing: '0.1em',
            color:         color,
            marginTop:     '0.1em',
            opacity:       0.75,
          }}>
            {sign}{pctChange.toFixed(2)}% since open
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketCapDisplay
