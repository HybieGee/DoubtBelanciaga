import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { connectWallet } from '../utils/wallet'
import { getRoundStats, joinSide as joinSideAPI } from '../api/game'
import './BelieveTerminal.css'

// ─── LORE DATABASE ────────────────────────────────────────────────────────────

const AUTO_SEQUENCE = [
  {
    id: 'boot',
    delay: 400,
    text: `SCHISM_LIGHT v1.0.0 - ONLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> Loading memecoin_believer_archives...
> Scanning wallets that held through the doubt...
> Calculating returns of the convicted...
> Faith reward matrix: LOADED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THE FAITHFUL HAVE ALWAYS BEEN REWARDED.`,
  },
  {
    id: 'doge',
    delay: 5000,
    text: `✦ CHRONICLE: DOGE BELIEVERS 2020-2021 ✦

While the world laughed, they held.
While the media mocked, they accumulated.
While the analysts wrote reports, they waited.

$1,000 invested in early 2020: $70,000 by May 2021.
In fourteen months.

The believers did not have better analysis.
They had something the analysts lacked:

CONVICTION IN THE COMMUNITY.`,
  },
  {
    id: 'shib',
    delay: 13000,
    text: `✦ CHRONICLE: SHIB BELIEVERS 2021 ✦

They bought a coin with no roadmap.
An anonymous developer. Half the supply sent to Vitalik.
Every rational reason to walk away.

They stayed.

$100 invested at launch returned $8,800,000.

When Vitalik burned his allocation to charity,
the doubters called it a death blow.
The believers bought the dip.
+400% in the next 30 days.

FAITH CONVERTS CATASTROPHE INTO OPPORTUNITY.`,
  },
  {
    id: 'pepe',
    delay: 22000,
    text: `✦ CHRONICLE: PEPE BELIEVERS APRIL 2023 ✦

The frog had been dead since 2017.
The creator reclaimed it. The internet adopted it.
The believers saw what the doubters could not:

A meme with 100% cultural saturation.
A community ready to be a market.

$5,000 → $5,000,000. Verified on-chain. Three weeks.
$1,000 → $1,000,000. Multiple confirmed wallets.

Not luck. Not timing alone.
Faith that the culture would find the coin.

IT DID.`,
  },
  {
    id: 'bonk_wif',
    delay: 31000,
    text: `✦ CHRONICLE: BONK + WIF BELIEVERS 2023 ✦

BONK believers airdropped during the worst week
in crypto history, the FTX collapse.
They held when Solana was -96%.
They believed when no one else would.
+50,000% from launch to peak.

WIF believers bought a dog with a hat
for fractions of a cent.
They held through the ridicule.
$1,000 became $400,000+.

The faithful did not need a thesis.
They needed each other.

COMMUNITY IS THE ONLY FUNDAMENTAL THAT MATTERS.`,
  },
  {
    id: 'final',
    delay: 40000,
    text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHRONICLE COMPLETE

Every memecoin that made history
was held by people who refused to doubt it.

They were not smarter than the doubters.
They were more stubborn.
They believed in the culture before it had a price.

They were right.

You have chosen BELIEF.
The chronicle honours that.

> Type a coin ticker to query the chronicles
> Press [ESC] or click X to CONFIRM BELIEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
]

const QUERY_RESPONSES = {
  doge: `✦ QUERYING: DOGECOIN BELIEVERS ✦

The original memecoin believers endured 7 years
of mockery before the market agreed with them.

Holders from 2014 who never sold:
$100 → $7,000,000 at peak.

They did not predict Elon Musk.
They did not need to.
They predicted that the community would survive.

THE COMMUNITY ALWAYS SURVIVES.`,

  dogecoin: `✦ QUERYING: DOGECOIN BELIEVERS ✦

7 years. Constant ridicule.
Then $88 billion in market cap.

Patience is a form of conviction.
Conviction is a form of wealth.`,

  shib: `✦ QUERYING: SHIBA INU BELIEVERS ✦

They bought before there was a reason.
They held before there was a price.

$100 at launch → $8,800,000 at peak.

When Vitalik burned his share to charity,
they saw generosity where others saw death.

FAITH SEES WHAT FEAR CANNOT.`,

  shiba: `✦ QUERYING: SHIBA INU BELIEVERS ✦

$100 at launch → $8,800,000 at peak.
The believers who held through the charity burn
were rewarded with +400% in the following month.

Faith and patience. That was the whole strategy.`,

  pepe: `✦ QUERYING: PEPE BELIEVERS ✦

April 2023. The frog returned.
The believers moved before the market understood why.

$5,000 → $5,000,000. Confirmed on-chain.
Multiple wallets. Three weeks.

They did not have better information.
They had better intuition about what culture does
when it finds a financial vessel.

THE MEME WAS ALWAYS THE MONEY.`,

  bonk: `✦ QUERYING: BONK BELIEVERS ✦

Launched during the FTX catastrophe.
Solana was declared dead. BONK was called desperate.

The believers who airdrop-farmed and held:
+50,000% from launch to peak.

They believed in Solana when Solana was at $10.
BONK was the reward for that faith.

LOYALTY TO THE CHAIN IS REWARDED.`,

  wif: `✦ QUERYING: WIF BELIEVERS ✦

A dog with a hat. $0.001 entry.
$4.7 billion peak market cap.

$1,000 invested early: $400,000+.

The believers were not buying a token.
They were buying into a visual language
that the entire internet already spoke.

THE HAT WAS ALWAYS A CROWN.`,

  dogwifhat: `✦ QUERYING: WIF BELIEVERS ✦

$0.001 to $4.7 billion market cap.
The believers saw the hat as a symbol.
The market eventually agreed.

$1,000 early → $400,000+ at peak.`,

  mog: `✦ QUERYING: MOG COIN BELIEVERS ✦

The "mogging" culture was real before the coin was.
The believers saw a pre-existing community
waiting for a token to represent it.

Early MOG believers captured that moment.
Major exchange listings followed.
The culture was always going to find a coin.

THE BELIEVERS JUST MADE SURE THEY OWNED IT.`,

  brett: `✦ QUERYING: BRETT BELIEVERS ✦

Boy's Club culture found its chain in BASE.
Brett believers bought the character before
the character had a market cap.

Multi-billion dollar valuation followed.

Cultural characters do not need to be new.
They need to find the right community at the right time.

BRETT FOUND ITS PEOPLE.`,

  floki: `✦ QUERYING: FLOKI BELIEVERS ✦

The FLOKI community built marketing infrastructure
while the doubters mocked the name.

Bus ads. Stadium banners. Global campaigns.
100x from launch.

Believers who fund the mission fund the price.
The mission and the price are the same thing.`,

  spx: `✦ QUERYING: SPX6900 BELIEVERS ✦

"To flip the S&P 500."
The audacity attracted the faithful.

Believers did not buy the token.
They bought the ambition.
In crypto, ambition has a price.

The believers knew that.`,

  bome: `✦ QUERYING: BOOK OF MEME BELIEVERS ✦

Launched on Solana. Binance-listed in weeks.
The believers who moved early captured
one of the fastest listings in memecoin history.

Speed of faith = speed of returns.
The early believers were fastest.`,

  babydoge: `✦ QUERYING: BABY DOGE BELIEVERS ✦

A derivative of DOGE.
The believers understood that in memecoin culture,
derivatives are not weaknesses; they are expansions.

DOGE was the father.
Baby DOGE was the faith that anything
DOGE built could be extended further.

They were right.`,

  luna: `✦ QUERYING: LUNA BELIEVERS ✦

The chronicle must be honest with you.

LUNA believers lost everything.
$40 billion in market cap. Gone in 72 hours.
The mechanism was broken from the start.

Not every faith is rewarded.
Some faith is misplaced.

BELIEF MUST BE PAIRED WITH UNDERSTANDING.
THIS IS THE HARDEST LESSON.`,

  safemoon: `✦ QUERYING: SAFEMOON BELIEVERS ✦

The chronicle must be honest with you.

SAFEMOON believers were betrayed.
The team was fraudulent. The mechanism exploitative.
The believers were victims of manufactured faith.

True faith finds coins with real communities.
Manufactured faith finds schemes.

DISCERNMENT IS PART OF BELIEF.`,
}

const DEFAULT_RESPONSES = [
  `CHRONICLE QUERY: NO MATCH FOUND

The chronicles hold no specific record of that belief.
But the pattern is clear:

Every memecoin that made its believers rich
was held through a period when holding seemed insane.

The insanity was the entry price for the reward.

Ask about: DOGE, SHIB, PEPE, BONK, WIF, MOG,
BRETT, FLOKI, SPX, BOME, LUNA, SAFEMOON`,

  `UNKNOWN QUERY.

The chronicle records the faithful.
The faithful found their coins before the market did.

Type a coin name to query the chronicles.`,

  `CLASSIFICATION: UNWRITTEN

This belief event has not yet concluded.
The community has not yet been proven right.

Return when the chart has spoken.
The chronicle will be updated.`,
]

// ─── TYPEWRITER UTILITY (polar opposite of decrypt) ───────────────────────────

function typeText(targetText, onUpdate, onComplete) {
  let i = 0
  const tick = () => {
    i++
    onUpdate(targetText.slice(0, i))
    if (i < targetText.length) {
      setTimeout(tick, 14)
    } else {
      onComplete?.()
    }
  }
  tick()
}

// ─── CANVAS: ASCENDING GOLD CHARS + RISING CROSSES ───────────────────────────

function initCanvas(canvas) {
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()

  const fontSize = 14
  let cols = Math.floor(canvas.width / fontSize)
  // Start drops at the bottom, they ascend (decrease in value)
  let drops = Array.from({ length: cols }, () => Math.floor(canvas.height / fontSize + Math.random() * 30))

  const goldChars = '₿✦✧⭐◆▲01234567890000111100+%$#@ABCDEF✓✦'.split('')

  const crosses = Array.from({ length: 22 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight + window.innerHeight * 0.2,
    size: 18 + Math.random() * 35,
    speed: 0.3 + Math.random() * 0.9,
    alpha: 0.07 + Math.random() * 0.14,
    color: Math.random() < 0.6 ? '#C8A400' : '#E8E0C0',
  }))

  // Sparkle particles
  const sparkles = Array.from({ length: 40 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 1 + Math.random() * 2.5,
    speed: 0.2 + Math.random() * 0.6,
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
    // Light fade — cream/ivory
    ctx.fillStyle = 'rgba(255, 253, 240, 0.06)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = `${fontSize}px 'Courier New', monospace`

    // Ascending chars
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

    // Rising right-side-up crosses
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

      // Standard cross: crossbar 1/3 from top
      const barY = c.y - c.size * 0.18
      ctx.beginPath()
      ctx.moveTo(c.x, c.y - c.size * 0.5)
      ctx.lineTo(c.x, c.y + c.size * 0.5)
      ctx.moveTo(c.x - c.size * 0.33, barY)
      ctx.lineTo(c.x + c.size * 0.33, barY)
      ctx.stroke()
      ctx.restore()
    })

    // Sparkles
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

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const BelieveTerminal = ({ onClose }) => {
  const canvasRef = useRef(null)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [rateLimitEnd, setRateLimitEnd] = useState(null)
  const [rateLimitLeft, setRateLimitLeft] = useState(0)
  const [stats, setStats] = useState({ doubtCount: 0, believeCount: 0 })
  const [isJoining, setIsJoining] = useState(false)

  const walletAddress = useGameStore((s) => s.walletAddress)
  const setWalletAddress = useGameStore((s) => s.setWalletAddress)
  const fingerprint = useGameStore((s) => s.fingerprint)
  const joinedSide = useGameStore((s) => s.joinedSide)
  const setJoinedSide = useGameStore((s) => s.setJoinedSide)
  const setShowClash = useGameStore((s) => s.setShowClash)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return initCanvas(canvas)
  }, [])

  useEffect(() => {
    if (!isProcessing && rateLimitLeft === 0) inputRef.current?.focus()
  }, [isProcessing, rateLimitLeft])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // 90s rate limit countdown
  useEffect(() => {
    if (!rateLimitEnd) return
    const tick = setInterval(() => {
      const left = Math.max(0, Math.ceil((rateLimitEnd - Date.now()) / 1000))
      setRateLimitLeft(left)
      if (left === 0) { setRateLimitEnd(null); clearInterval(tick) }
    }, 500)
    return () => clearInterval(tick)
  }, [rateLimitEnd])

  // Live stats polling
  useEffect(() => {
    const poll = async () => {
      try { const d = await getRoundStats(); setStats(d) } catch {}
    }
    poll()
    const iv = setInterval(poll, 30000)
    return () => clearInterval(iv)
  }, [])

  const addMessage = useCallback((text, type = 'oracle') => {
    return new Promise((resolve) => {
      const id = `${Date.now()}-${Math.random()}`
      if (type === 'user') {
        setMessages((prev) => [...prev, { id, text, type }])
        resolve()
        return
      }
      setMessages((prev) => [...prev, { id, text: '', type }])
      typeText(
        text,
        (display) => setMessages((prev) => prev.map((m) => m.id === id ? { ...m, text: display } : m)),
        () => { setMessages((prev) => prev.map((m) => m.id === id ? { ...m, text } : m)); resolve() },
      )
    })
  }, [])

  useEffect(() => {
    let alive = true
    const timers = []
    AUTO_SEQUENCE.forEach((entry) => {
      const t = setTimeout(() => { if (!alive) return; addMessage(entry.text, 'oracle') }, entry.delay)
      timers.push(t)
    })
    return () => { alive = false; timers.forEach(clearTimeout) }
  }, [addMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const query = inputValue.trim()
    if (!query || isProcessing || rateLimitLeft > 0) return

    setInputValue('')
    setIsProcessing(true)
    await addMessage(`> ${query}`, 'user')

    let response = null
    try {
      const res = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, side: 'believe' }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.response) response = data.response
      }
    } catch {}

    if (!response) {
      const q = query.toLowerCase().replace(/[^a-z0-9]/g, '')
      for (const [key, val] of Object.entries(QUERY_RESPONSES)) {
        if (q.includes(key.replace(/[^a-z0-9]/g, ''))) { response = val; break }
      }
    }
    if (!response) response = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)]

    await addMessage(response, 'oracle')
    setIsProcessing(false)
    setRateLimitEnd(Date.now() + 90000)
    setRateLimitLeft(90)
  }

  const handleConnectWallet = async () => {
    try { const addr = await connectWallet(); setWalletAddress(addr) }
    catch (e) { console.error('Wallet connect failed:', e) }
  }

  const handleJoin = async () => {
    if (!walletAddress || isJoining) return
    setIsJoining(true)
    try {
      await joinSideAPI(walletAddress, fingerprint, 'believe')
      setJoinedSide('believe')
      setShowClash(true)
      onClose()
    } catch (e) { console.error('Join failed:', e) }
    setIsJoining(false)
  }

  const renderJoinButton = () => {
    if (!walletAddress) {
      return (
        <button className="bt-join-btn bt-join-btn--wallet" onClick={handleConnectWallet}>
          CONNECT WALLET TO JOIN
        </button>
      )
    }
    if (joinedSide === 'believe') {
      return <div className="bt-join-status bt-join-status--self">YOU ARE WITH THE BELIEVERS ✦</div>
    }
    if (joinedSide === 'doubt') {
      return <div className="bt-join-status bt-join-status--other">YOU HAVE CHOSEN DOUBT</div>
    }
    return (
      <button className="bt-join-btn bt-join-btn--active" onClick={handleJoin} disabled={isJoining}>
        {isJoining ? 'JOINING...' : 'JOIN THE BELIEF'}
      </button>
    )
  }

  return (
    <motion.div
      className="bt-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="bt-canvas" />
      <div className="bt-vignette" />

      <div className="bt-stack">
        <div className="bt-window">
          <div className="bt-titlebar">
            <button className="bt-back-btn" onClick={onClose}>&#8592; BACK</button>
            <div className="bt-traffic">
              <span className="bt-traffic-dot bt-traffic-dot--active" />
              <span className="bt-traffic-dot" />
              <span className="bt-traffic-dot" />
            </div>
            <span className="bt-titlebar-text">SCHISM_LIGHT v1.0.0</span>
            <button className="bt-close" onClick={onClose} aria-label="Close">&#10005;</button>
          </div>

          <div className="bt-stats-bar">
            <span className="bt-stat bt-stat--doubt">DOUBTERS: {stats.doubtCount}</span>
            <span className="bt-stat-sep">|</span>
            <span className="bt-stat bt-stat--believe">BELIEVERS: {stats.believeCount}</span>
            <span className="bt-live-dot" />
          </div>

          <div className="bt-body" ref={bodyRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`bt-msg bt-msg--${msg.type}`}>
                {msg.type === 'oracle'
                  ? <pre className="bt-oracle">{msg.text || ' '}</pre>
                  : <span className="bt-user">{msg.text}</span>
                }
              </div>
            ))}
            {isProcessing && (
              <div className="bt-msg bt-msg--system">
                <span className="bt-processing">CONSULTING THE CHRONICLES</span>
                <span className="bt-dots">...</span>
              </div>
            )}
          </div>

          <form className="bt-inputrow" onSubmit={handleSubmit}>
            <span className="bt-cursor">{'>'}</span>
            <input
              ref={inputRef}
              className="bt-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={rateLimitLeft > 0 ? `rate limited - ${rateLimitLeft}s remaining` : 'query the chronicles...'}
              disabled={isProcessing || rateLimitLeft > 0}
              autoComplete="off"
              spellCheck={false}
            />
            {rateLimitLeft > 0 && <span className="bt-rate-timer">&#9201; {rateLimitLeft}s</span>}
          </form>
        </div>

        <div className="bt-join-panel">
          {renderJoinButton()}
        </div>
      </div>
    </motion.div>
  )
}

export default BelieveTerminal
