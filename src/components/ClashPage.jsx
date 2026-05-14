import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getRoundStats } from '../api/game'
import './ClashPage.css'

// ─── DOUBT CANVAS: matrix rain + falling upside-down crosses ─────────────────

function initDoubtCanvas(canvas) {
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  resize()

  const fontSize = 13
  let cols = Math.floor(canvas.width / fontSize)
  let drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -60))
  let themes = drops.map(() => {
    const r = Math.random()
    if (r < 0.45) return 'red'
    if (r < 0.72) return 'grey'
    return 'dark'
  })

  const matrixChars = '₿ΞΔ◆▲01110100110101100100110010101001101010ABCDEF!@#$%&*<>?+-_~^'.split('')

  const crosses = Array.from({ length: 18 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height * 0.5,
    size: 16 + Math.random() * 34,
    speed: 0.35 + Math.random() * 1.0,
    alpha: 0.07 + Math.random() * 0.16,
    color: Math.random() < 0.65 ? '#6B0000' : '#252525',
  }))

  const onResize = () => {
    resize()
    cols = Math.floor(canvas.width / fontSize)
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -60))
    themes = drops.map(() => {
      const r = Math.random()
      if (r < 0.45) return 'red'
      if (r < 0.72) return 'grey'
      return 'dark'
    })
  }
  window.addEventListener('resize', onResize)

  let animId

  const draw = () => {
    ctx.fillStyle = 'rgba(0,0,0,0.055)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px 'Courier New', monospace`

    drops.forEach((drop, i) => {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
      const x = i * fontSize
      const y = drop * fontSize

      let color
      if (themes[i] === 'red') {
        const r = 70 + Math.floor(Math.random() * 130)
        color = `rgba(${r},0,0,${0.35 + Math.random() * 0.65})`
      } else if (themes[i] === 'grey') {
        const v = 28 + Math.floor(Math.random() * 65)
        color = `rgba(${v},${v},${v},${0.45 + Math.random() * 0.55})`
      } else {
        color = 'rgba(14,14,14,0.9)'
      }

      ctx.fillStyle = color
      ctx.fillText(char, x, y)

      drops[i]++
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
    })

    crosses.forEach((c) => {
      c.y += c.speed
      if (c.y > canvas.height + c.size) {
        c.y = -c.size * 2
        c.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.globalAlpha = c.alpha
      ctx.strokeStyle = c.color
      ctx.lineWidth = Math.max(1.2, c.size * 0.055)
      ctx.lineCap = 'round'

      const barY = c.y + c.size * 0.18
      ctx.beginPath()
      ctx.moveTo(c.x, c.y - c.size * 0.5)
      ctx.lineTo(c.x, c.y + c.size * 0.5)
      ctx.moveTo(c.x - c.size * 0.33, barY)
      ctx.lineTo(c.x + c.size * 0.33, barY)
      ctx.stroke()
      ctx.restore()
    })

    animId = requestAnimationFrame(draw)
  }

  draw()

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
  }
}

// ─── BELIEVE CANVAS: ascending gold chars + rising crosses + sparkles ─────────

function initBelieveCanvas(canvas) {
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }
  resize()

  const fontSize = 13
  let cols = Math.floor(canvas.width / fontSize)
  let drops = Array.from({ length: cols }, () => Math.floor(canvas.height / fontSize + Math.random() * 30))

  const goldChars = '₿✦✧⭐◆▲01234567890000111100+%$#@ABCDEF✓✦'.split('')

  const crosses = Array.from({ length: 15 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height + canvas.height * 0.2,
    size: 16 + Math.random() * 32,
    speed: 0.3 + Math.random() * 0.85,
    alpha: 0.07 + Math.random() * 0.13,
    color: Math.random() < 0.6 ? '#C8A400' : '#E8E0C0',
  }))

  const sparkles = Array.from({ length: 35 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 1 + Math.random() * 2.5,
    speed: 0.2 + Math.random() * 0.5,
    alpha: Math.random(),
    fadeSpeed: 0.008 + Math.random() * 0.015,
    color: Math.random() < 0.5 ? '#FFD700' : '#FFFFFF',
  }))

  const onResize = () => {
    resize()
    cols = Math.floor(canvas.width / fontSize)
    drops = Array.from({ length: cols }, () => Math.floor(canvas.height / fontSize + Math.random() * 30))
  }
  window.addEventListener('resize', onResize)

  let animId

  const draw = () => {
    ctx.fillStyle = 'rgba(255, 253, 240, 0.06)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${fontSize}px 'Courier New', monospace`

    drops.forEach((drop, i) => {
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

      drops[i]--
      if (y < 0 && Math.random() > 0.975) {
        drops[i] = Math.floor(canvas.height / fontSize) + 5
      }
    })

    crosses.forEach((c) => {
      c.y -= c.speed
      if (c.y < -c.size * 2) {
        c.y = canvas.height + c.size
        c.x = Math.random() * canvas.width
      }

      ctx.save()
      ctx.globalAlpha = c.alpha
      ctx.strokeStyle = c.color
      ctx.lineWidth = Math.max(1.2, c.size * 0.05)
      ctx.lineCap = 'round'

      const barY = c.y - c.size * 0.18
      ctx.beginPath()
      ctx.moveTo(c.x, c.y - c.size * 0.5)
      ctx.lineTo(c.x, c.y + c.size * 0.5)
      ctx.moveTo(c.x - c.size * 0.33, barY)
      ctx.lineTo(c.x + c.size * 0.33, barY)
      ctx.stroke()
      ctx.restore()
    })

    sparkles.forEach((s) => {
      s.y -= s.speed
      s.alpha += s.fadeSpeed * (Math.random() > 0.5 ? 1 : -1)
      s.alpha = Math.max(0, Math.min(1, s.alpha))

      if (s.y < 0) {
        s.y = canvas.height + 10
        s.x = Math.random() * canvas.width
      }

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

    animId = requestAnimationFrame(draw)
  }

  draw()

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
  }
}

// ─── DIVIDER CANVAS: organic living boundary between the two sides ────────────

function initDividerCanvas(canvas) {
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = canvas.offsetWidth || 120
    canvas.height = canvas.offsetHeight || window.innerHeight
  }
  resize()

  let t = 0
  let animId

  const draw = () => {
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    const cx = w / 2
    const segments = 60
    const points = []

    for (let i = 0; i <= segments; i++) {
      const y = (i / segments) * h
      // Layered sine waves at different frequencies — gives organic, non-repeating feel
      const x = cx
        + Math.sin(y * 0.022 + t * 0.65)  * w * 0.22
        + Math.sin(y * 0.058 + t * 1.15)  * w * 0.12
        + Math.sin(y * 0.009 + t * 0.3)   * w * 0.32
        + Math.sin(y * 0.1   + t * 2.1)   * w * 0.06
      points.push({ x: Math.max(2, Math.min(w - 2, x)), y })
    }

    // Doubt side (dark) — left of boundary
    ctx.beginPath()
    ctx.moveTo(0, 0)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fillStyle = '#080000'
    ctx.fill()

    // Believe side (cream) — right of boundary
    ctx.beginPath()
    ctx.moveTo(w, 0)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = '#FFFDF0'
    ctx.fill()

    // Red glow edge (doubt side bleeds into boundary)
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.shadowBlur = 18
    ctx.shadowColor = 'rgba(160, 0, 0, 0.9)'
    ctx.strokeStyle = 'rgba(180, 0, 0, 0.75)'
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Gold glow edge (belief side bleeds into boundary)
    ctx.shadowColor = 'rgba(200, 164, 0, 0.7)'
    ctx.shadowBlur = 12
    ctx.strokeStyle = 'rgba(200, 150, 0, 0.45)'
    ctx.lineWidth = 1.2
    ctx.stroke()

    ctx.shadowBlur = 0

    t += 0.006
    animId = requestAnimationFrame(draw)
  }

  const onResize = () => resize()
  window.addEventListener('resize', onResize)
  draw()

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('resize', onResize)
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const ClashPage = () => {
  const setShowClash = useGameStore((s) => s.setShowClash)
  const joinedSide = useGameStore((s) => s.joinedSide)
  const roundEndTime = useGameStore((s) => s.roundEndTime)

  const doubtCanvasRef = useRef(null)
  const believeCanvasRef = useRef(null)
  const dividerCanvasRef = useRef(null)

  const [stats, setStats] = useState({ doubtCount: 0, believeCount: 0 })
  const [timeLeft, setTimeLeft] = useState('--:--:--')

  // Live stats polling
  useEffect(() => {
    const poll = async () => {
      try { const d = await getRoundStats(); setStats(d) } catch {}
    }
    poll()
    const iv = setInterval(poll, 15000)
    return () => clearInterval(iv)
  }, [])

  // Round countdown — falls back to next UTC midnight if no roundEndTime from backend
  useEffect(() => {
    const endTime = roundEndTime || (() => {
      const now = new Date()
      return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    })()

    const tick = () => {
      const ms = endTime - Date.now()
      if (ms <= 0) { setTimeLeft('00:00:00'); return }
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [roundEndTime])

  useEffect(() => {
    const canvas = doubtCanvasRef.current
    if (!canvas) return
    return initDoubtCanvas(canvas)
  }, [])

  useEffect(() => {
    const canvas = believeCanvasRef.current
    if (!canvas) return
    return initBelieveCanvas(canvas)
  }, [])

  useEffect(() => {
    const canvas = dividerCanvasRef.current
    if (!canvas) return
    return initDividerCanvas(canvas)
  }, [])

  const total = (stats.doubtCount || 0) + (stats.believeCount || 0)
  const rawDoubtPct = total > 0 ? (stats.doubtCount / total) * 100 : 50
  const rawBelievePct = total > 0 ? (stats.believeCount / total) * 100 : 50

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
      <div className="clash-side clash-side--doubt" style={{ flex: doubtPct }}>
        <canvas ref={doubtCanvasRef} className="clash-canvas" />
        <div className="clash-vignette clash-vignette--doubt" />
        <div className="clash-side-content">
          <div className="clash-label clash-label--doubt">DOUBT</div>
          <div className="clash-count clash-count--doubt">{stats.doubtCount}</div>
          <div className="clash-pct clash-pct--doubt">{rawDoubtPct.toFixed(1)}%</div>
          {joinedSide === 'doubt' && (
            <div className="clash-badge clash-badge--doubt">YOUR SIDE</div>
          )}
        </div>
      </div>

      {/* ORGANIC DIVIDER */}
      <div className="clash-divider">
        <canvas ref={dividerCanvasRef} className="clash-divider-canvas" />
        <div className="clash-divider-timer">{timeLeft}</div>
      </div>

      {/* BELIEVE SIDE */}
      <div className="clash-side clash-side--believe" style={{ flex: believePct }}>
        <canvas ref={believeCanvasRef} className="clash-canvas" />
        <div className="clash-vignette clash-vignette--believe" />
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
