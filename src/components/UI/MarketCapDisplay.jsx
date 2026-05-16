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
        position:      'relative',
        textAlign:     'center',
        fontFamily:    "'Courier New', monospace",
        zIndex:        1,
        fontSize:      'clamp(1.275rem, 2.1vw, 1.65rem)',
        fontWeight:    'bold',
        letterSpacing: '0.06em',
        color:         'rgba(255,255,255,0.4)',
      }}>
        TBD
      </div>
    </div>
  )
}

export default MarketCapDisplay
