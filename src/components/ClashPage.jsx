import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getRoundStats } from '../api/game'
import { getTopHolders } from '../api/holders'
import MarketCapDisplay from './UI/MarketCapDisplay'
import './ClashPage.css'

// ─── UNIFIED CANVAS ───────────────────────────────────────────────────────────
// One canvas renders both sides + organic boundary using ctx.clip().
// Each side's animation is clipped to its territory — they meet exactly at the line.

function initMainCanvas(canvas, getPct, getTimerEl) {
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()

  const fontSize = 13
  const matrixChars = '₿ΞΔ◆▲01110100110101100100110010101001101010ABCDEF!@#$%&*<>?+-_~^'.split('')
  const goldChars   = '₿✦✧⭐◆▲01234567890000111100+%$#@ABCDEF✓✦'.split('')

  // ── Doubt particles ──────────────────────────────────────────────────────
  let dDrops = [], dThemes = []
  const dCrosses = Array.from({ length: 28 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight - window.innerHeight * 0.5,
    size: 16 + Math.random() * 34,
    speed: 0.35 + Math.random() * 1.0,
    alpha: 0.07 + Math.random() * 0.16,
    color: Math.random() < 0.65 ? '#6B0000' : '#252525',
  }))

  const initDDrops = () => {
    const cols = Math.floor(canvas.width / fontSize)
    dDrops  = Array.from({ length: cols }, () => Math.floor(Math.random() * -60))
    dThemes = dDrops.map(() => {
      const r = Math.random()
      return r < 0.45 ? 'red' : r < 0.72 ? 'grey' : 'dark'
    })
  }
  initDDrops()

  // ── Believe particles ─────────────────────────────────────────────────────
  let bDrops = []
  const bCrosses = Array.from({ length: 22 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.innerHeight * 0.2,
    size: 16 + Math.random() * 32,
    speed: 0.3 + Math.random() * 0.85,
    alpha: 0.07 + Math.random() * 0.13,
    color: Math.random() < 0.6 ? '#C8A400' : '#E8E0C0',
  }))
  const sparkles = Array.from({ length: 50 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 1 + Math.random() * 2.5,
    speed: 0.2 + Math.random() * 0.5,
    alpha: Math.random(),
    fadeSpeed: 0.008 + Math.random() * 0.015,
    color: Math.random() < 0.5 ? '#FFD700' : '#FFFFFF',
  }))

  const initBDrops = () => {
    const cols = Math.floor(canvas.width / fontSize)
    bDrops = Array.from({ length: cols }, () => Math.floor(canvas.height / fontSize + Math.random() * 30))
  }
  initBDrops()

  let t = 0
  let smoothPct = getPct()
  let animId

  const getPath = (w, h) => {
    const cx = w * (smoothPct / 100)
    const amp = Math.min(w * 0.045, 55)
    const points = []
    for (let i = 0; i <= 70; i++) {
      const y = (i / 70) * h
      const x = cx
        + Math.sin(y * 0.022 + t * 0.65) * amp * 0.7
        + Math.sin(y * 0.058 + t * 1.15) * amp * 0.4
        + Math.sin(y * 0.009 + t * 0.30) * amp * 1.0
        + Math.sin(y * 0.100 + t * 2.10) * amp * 0.2
      points.push({ x: Math.max(2, Math.min(w - 2, x)), y })
    }
    return points
  }

  const draw = () => {
    const w = canvas.width
    const h = canvas.height

    // Smooth boundary tracking
    smoothPct += (getPct() - smoothPct) * 0.018

    const pts = getPath(w, h)

    // ── DOUBT SIDE ─────────────────────────────────────────────────────────
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.clip()

    ctx.fillStyle = 'rgba(0,0,0,0.055)'
    ctx.fillRect(0, 0, w, h)
    ctx.font = `${fontSize}px 'Courier New', monospace`

    dDrops.forEach((drop, i) => {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
      const x = i * fontSize
      const y = drop * fontSize
      let color
      if (dThemes[i] === 'red') {
        const r = 70 + Math.floor(Math.random() * 130)
        color = `rgba(${r},0,0,${0.35 + Math.random() * 0.65})`
      } else if (dThemes[i] === 'grey') {
        const v = 28 + Math.floor(Math.random() * 65)
        color = `rgba(${v},${v},${v},${0.45 + Math.random() * 0.55})`
      } else {
        color = 'rgba(14,14,14,0.9)'
      }
      ctx.fillStyle = color
      ctx.fillText(char, x, y)
      dDrops[i]++
      if (y > h && Math.random() > 0.975) dDrops[i] = 0
    })

    dCrosses.forEach((c) => {
      c.y += c.speed
      if (c.y > h + c.size) { c.y = -c.size * 2; c.x = Math.random() * w }
      ctx.save()
      ctx.globalAlpha = c.alpha
      ctx.strokeStyle = c.color
      ctx.lineWidth = Math.max(1.2, c.size * 0.055)
      ctx.lineCap = 'round'
      const barY = c.y + c.size * 0.18
      ctx.beginPath()
      ctx.moveTo(c.x, c.y - c.size * 0.5); ctx.lineTo(c.x, c.y + c.size * 0.5)
      ctx.moveTo(c.x - c.size * 0.33, barY); ctx.lineTo(c.x + c.size * 0.33, barY)
      ctx.stroke()
      ctx.restore()
    })

    // Doubt vignette
    const dVig = ctx.createRadialGradient(w * 0.25, h * 0.5, 0, w * 0.25, h * 0.5, Math.max(w * 0.4, h * 0.6))
    dVig.addColorStop(0, 'rgba(0,0,0,0)')
    dVig.addColorStop(1, 'rgba(0,0,0,0.65)')
    ctx.fillStyle = dVig
    ctx.fillRect(0, 0, w, h)

    ctx.restore()

    // ── BELIEVE SIDE ────────────────────────────────────────────────────────
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(w, 0)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.clip()

    ctx.fillStyle = 'rgba(255,253,240,0.06)'
    ctx.fillRect(0, 0, w, h)
    ctx.font = `${fontSize}px 'Courier New', monospace`

    bDrops.forEach((drop, i) => {
      const char = goldChars[Math.floor(Math.random() * goldChars.length)]
      const x = i * fontSize
      const y = drop * fontSize
      const r = Math.random()
      let color
      if (r < 0.5) {
        const v = 180 + Math.floor(Math.random() * 75)
        color = `rgba(${v},${Math.floor(v * 0.82)},0,${0.3 + Math.random() * 0.5})`
      } else {
        const v = 200 + Math.floor(Math.random() * 55)
        color = `rgba(${v},${v},${Math.floor(v * 0.7)},${0.25 + Math.random() * 0.4})`
      }
      ctx.fillStyle = color
      ctx.fillText(char, x, y)
      bDrops[i]--
      if (y < 0 && Math.random() > 0.975) bDrops[i] = Math.floor(h / fontSize) + 5
    })

    bCrosses.forEach((c) => {
      c.y -= c.speed
      if (c.y < -c.size * 2) { c.y = h + c.size; c.x = Math.random() * w }
      ctx.save()
      ctx.globalAlpha = c.alpha
      ctx.strokeStyle = c.color
      ctx.lineWidth = Math.max(1.2, c.size * 0.05)
      ctx.lineCap = 'round'
      const barY = c.y - c.size * 0.18
      ctx.beginPath()
      ctx.moveTo(c.x, c.y - c.size * 0.5); ctx.lineTo(c.x, c.y + c.size * 0.5)
      ctx.moveTo(c.x - c.size * 0.33, barY); ctx.lineTo(c.x + c.size * 0.33, barY)
      ctx.stroke()
      ctx.restore()
    })

    sparkles.forEach((s) => {
      s.y -= s.speed
      s.alpha += s.fadeSpeed * (Math.random() > 0.5 ? 1 : -1)
      s.alpha = Math.max(0, Math.min(1, s.alpha))
      if (s.y < 0) { s.y = h + 10; s.x = Math.random() * w }
      ctx.save()
      ctx.globalAlpha = s.alpha * 0.6
      ctx.fillStyle = s.color
      ctx.shadowBlur = 6
      ctx.shadowColor = s.color
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    // Believe vignette
    const bVig = ctx.createRadialGradient(w * 0.75, h * 0.5, 0, w * 0.75, h * 0.5, Math.max(w * 0.4, h * 0.6))
    bVig.addColorStop(0, 'rgba(255,253,240,0)')
    bVig.addColorStop(1, 'rgba(255,248,200,0.6)')
    ctx.fillStyle = bVig
    ctx.fillRect(0, 0, w, h)

    ctx.restore()

    // ── ORGANIC BOUNDARY LINE ───────────────────────────────────────────────
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.shadowBlur = 22
    ctx.shadowColor = 'rgba(160,0,0,0.95)'
    ctx.strokeStyle = 'rgba(190,0,0,0.85)'
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.stroke()
    ctx.shadowColor = 'rgba(200,164,0,0.75)'
    ctx.shadowBlur = 14
    ctx.strokeStyle = 'rgba(200,150,0,0.55)'
    ctx.lineWidth = 1.2
    ctx.stroke()
    ctx.shadowBlur = 0

    // Drive timer position directly from smoothPct — no React re-render lag
    const timerEl = getTimerEl()
    if (timerEl) timerEl.style.left = `${smoothPct}%`

    t += 0.006
    animId = requestAnimationFrame(draw)
  }

  const onResize = () => { resize(); initDDrops(); initBDrops() }
  window.addEventListener('resize', onResize)
  draw()

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const ClashPage = () => {
  const setShowClash  = useGameStore((s) => s.setShowClash)
  const joinedSide    = useGameStore((s) => s.joinedSide)
  const roundEndTime  = useGameStore((s) => s.roundEndTime)
  const walletAddress = useGameStore((s) => s.walletAddress)

  const mainCanvasRef = useRef(null)
  const doubtPctRef   = useRef(50)
  const timerRef      = useRef(null)

  const [stats,    setStats]    = useState({ doubtCount: 0, believeCount: 0, startMarketCap: null })
  const [timeLeft, setTimeLeft] = useState('--:--:--')
  const [holders,  setHolders]  = useState([])

  const fakeOffset = { doubt: 3, believe: 5 }

  useEffect(() => {
    const poll = async () => {
      try { const d = await getRoundStats(); setStats(d) } catch {}
    }
    poll()
    const iv = setInterval(poll, 15000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const load = async () => {
      try { setHolders(await getTopHolders()) } catch {}
    }
    load()
    const iv = setInterval(load, 120000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const SIX_HOURS = 6 * 60 * 60 * 1000
    const getEnd = () => Math.ceil(Date.now() / SIX_HOURS) * SIX_HOURS
    const tick = () => {
      const ms = Math.max(0, getEnd() - Date.now())
      if (ms <= 0) { setTimeLeft('00:00:00'); return }
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  const realDoubt   = stats.doubtCount   || 0
  const realBelieve = stats.believeCount || 0
  const dispDoubt   = realDoubt   + fakeOffset.doubt
  const dispBelieve = realBelieve + fakeOffset.believe

  const total         = dispDoubt + dispBelieve
  const rawDoubtPct   = total > 0 ? (dispDoubt   / total) * 100 : 50
  const rawBelievePct = total > 0 ? (dispBelieve / total) * 100 : 50
  const doubtPct      = Math.min(92, Math.max(8, rawDoubtPct))
  const believePct    = 100 - doubtPct

  // Keep ref in sync so canvas loop always has the latest value
  doubtPctRef.current = doubtPct

  const truncAddr = (addr) => addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '??????'
  const fmtBal = (bal) => {
    const n = parseFloat(bal || 0)
    if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
    if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`
    if (n >= 1e6)  return `${(n / 1e6).toFixed(1)}M`
    if (n >= 1e3)  return `${(n / 1e3).toFixed(1)}K`
    return n.toFixed(0)
  }

  useEffect(() => {
    const canvas = mainCanvasRef.current
    if (!canvas) return
    return initMainCanvas(canvas, () => doubtPctRef.current, () => timerRef.current)
  }, [])

  return (
    <motion.div
      className="clash-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Single full-screen canvas — both animations + organic boundary */}
      <canvas ref={mainCanvasRef} className="clash-main-canvas" />

      {/* Text overlays — transparent, flex-proportioned to match canvas split */}
      <div className="clash-layout">
        <div className="clash-panel" style={{ flex: doubtPct }}>
          <div className="clash-side-content">
            <div className="clash-label clash-label--doubt">DOUBT</div>
            <div className="clash-count clash-count--doubt">{dispDoubt}</div>
            <div className="clash-pct clash-pct--doubt">{rawDoubtPct.toFixed(1)}%</div>
            {joinedSide === 'doubt' && (
              <div className="clash-badge clash-badge--doubt">YOUR SIDE</div>
            )}
          </div>
        </div>

        <div className="clash-panel" style={{ flex: believePct }}>
          <div className="clash-side-content">
            <div className="clash-label clash-label--believe">BELIEF</div>
            <div className="clash-count clash-count--believe">{dispBelieve}</div>
            <div className="clash-pct clash-pct--believe">{rawBelievePct.toFixed(1)}%</div>
            {joinedSide === 'believe' && (
              <div className="clash-badge clash-badge--believe">YOUR SIDE</div>
            )}
          </div>
        </div>
      </div>

      {/* Boundary panel — timer → leaderboard → market cap, tracks organic line */}
      <div ref={timerRef} className="clash-boundary-panel" style={{ left: '50%' }}>
        <div className="clash-boundary-timer">{timeLeft}</div>

        <div className="clash-leaderboard">
          <div className="clash-lb-header">TOP 10 HOLDERS</div>
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', fontSize: '0.85rem', padding: '0.5rem 0' }}>TBD</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MarketCapDisplay />
        </div>
      </div>

      <button className="clash-back" onClick={() => setShowClash(false)}>
        &#8592; BACK
      </button>

      <div className="clash-live">
        <span className="clash-live-dot" />
        LIVE
      </div>
    </motion.div>
  )
}

export default ClashPage
