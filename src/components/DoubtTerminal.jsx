import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import './DoubtTerminal.css'

// ─── LORE DATABASE ────────────────────────────────────────────────────────────

const AUTO_SEQUENCE = [
  {
    id: 'boot',
    delay: 400,
    text: `DOUBT_ORACLE v6.6.6 — ONLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> Loading memecoin_doubt_archives...
> Scanning 10,000+ "this is worthless" posts...
> Cataloguing every "dog coins are dead" tweet...
> Survivor probability matrix: LOADED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE ONLINE. BEGIN TRANSMISSION.`,
  },
  {
    id: 'doge',
    delay: 5000,
    text: `▓▓▓ ARCHIVE: DOGE — 2013 TO 2021 ▓▓▓

"It's literally a joke. A dog meme coin.
 It has no utility. It will go to zero."
— Every serious investor, 2013–2020

MARKET CAP AT PEAK RIDICULE: $0
MARKET CAP AT PEAK FAITH: $88,000,000,000

Eighty-eight. Billion. Dollars.
For the dog they said was worthless.

A $1,000 investment in 2017 became $640,000.
The doubters lost nothing. Except everything.

DOUBT IS THE PRICE OF ENTRY.`,
  },
  {
    id: 'shib',
    delay: 13000,
    text: `▓▓▓ ARCHIVE: SHIB — 2020 TO 2021 ▓▓▓

"A worthless Dogecoin clone made by an anonymous dev."
"No utility. No team. No roadmap."
"Vitalik got 50% of supply — this is OVER."

Vitalik burned his share to charity.
Price response: +400% in 30 days.

Peak market cap: $40 BILLION
$100 invested at launch: $8,800,000

The community called Vitalik's donation
the most bullish event in memecoin history.
They were correct.

DOUBT CREATES THE DIP. FAITH CAPTURES THE RIP.`,
  },
  {
    id: 'pepe',
    delay: 22000,
    text: `▓▓▓ ARCHIVE: PEPE — APRIL 2023 ▓▓▓

"A dead 4chan frog meme."
"No team. No utility. No purpose."
"This is the most brainless coin ever launched."

Week 1: $0 to $1 billion market cap.
Week 3: $1.6 billion.

Verified on-chain wallets turned $5,000 into $5,000,000.
In three weeks.

The doubters had better analysis.
The believers had better accounts.

THE MEME IS THE FUNDAMENTAL.`,
  },
  {
    id: 'bonk_wif',
    delay: 31000,
    text: `▓▓▓ ARCHIVE: BONK + WIF — 2023 ▓▓▓

BONK — airdropped during the FTX collapse.
"Desperate. Worthless. A last ditch hail mary."
Peak market cap: $2.6 billion.
Revived Solana's entire DEX ecosystem.

WIF — a dog. With a hat.
"This is the most idiotic thing ever tokenized."
Peak market cap: $4.7 billion.
$1,000 early = $400,000+ at peak.

The doubters had arguments.
The believers had wallets.

MEMECOINS DO NOT NEED YOUR PERMISSION TO MOON.`,
  },
  {
    id: 'final',
    delay: 40000,
    text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORACLE TRANSMISSION COMPLETE

You cannot value what you do not understand.
The doubters understood finance.
The believers understood culture.

Culture always wins.

Every memecoin that survived was laughed at first.
Every memecoin graveyard is full of coins
that nobody laughed at hard enough.

You have chosen DOUBT.
The oracle respects that.

> Type a coin ticker to query the archives
> Press [ESC] or click X to CONFIRM DOUBT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
]

const QUERY_RESPONSES = {
  doge: `▓▓▓ QUERYING: DOGECOIN ▓▓▓

Jackson Palmer (co-creator) publicly called it a scam.
He was correct about everything structural.
It mooned anyway.

$1,000 in 2017 → $640,000 in 2021.
$1,000 in 2020 → $70,000 in 4 months.

The fundamentals said zero.
The community said otherwise.
The community was right.

DOGE does not care about your thesis.`,

  dogecoin: `▓▓▓ QUERYING: DOGECOIN ▓▓▓

Started as a joke between two developers.
Made it to TIME magazine. SNL. $88 billion.

The joke became the culture.
The culture became the money.

That is how memecoins work.`,

  shib: `▓▓▓ QUERYING: SHIBA INU ▓▓▓

Anonymous developer. No roadmap. Half the supply to Vitalik.
Every red flag. Every reason to doubt.

Vitalik burned his allocation. Donated the rest.
Community: "Most bullish event in history."

They were right.
$100 at launch: $8,800,000 at peak.

THE COMMUNITY IS THE ROADMAP.`,

  shiba: `▓▓▓ QUERYING: SHIBA INU ▓▓▓

Every red flag. Every reason to doubt.
Peak market cap: $40 billion anyway.

The community was the whitepaper.
The doubt was the floor.`,

  pepe: `▓▓▓ QUERYING: PEPE ▓▓▓

A frog from 4chan. No team. No utility.
$0 to $1.6 billion in three weeks.

On-chain data confirmed:
Multiple wallets turned $5,000 into $5,000,000.

The doubters had better models.
The believers had better accounts.

THE MEME IS THE FUNDAMENTAL.`,

  bonk: `▓▓▓ QUERYING: BONK ▓▓▓

Launched during the FTX collapse.
The worst possible timing. The most doubted launch.

"Desperate. Worthless. A charity case."

Peak market cap: $2.6 billion.
Triggered a Solana DEX revival.
Entire ecosystem volume +1000% post-BONK.

THE JOKE BECAME THE CATALYST.`,

  wif: `▓▓▓ QUERYING: WIF ▓▓▓

A dog. With a hat.
The premise was so stupid it was genius.

"This is the most idiotic thing tokenized."
Peak market cap: $4.7 billion.
Early holders: 400x returns.

The simpler the meme, the harder it hits.`,

  dogwifhat: `▓▓▓ QUERYING: WIF ▓▓▓

A dog. With a hat. $4.7 billion.
The doubters were not wrong about what it was.
They were wrong about what it could become.

There is a difference.`,

  mog: `▓▓▓ QUERYING: MOG COIN ▓▓▓

"A cope coin for people who missed PEPE."
"Derivative. Late. Going nowhere."

Listed on major exchanges within months.
Top 100 market cap.

Every cycle produces coins the doubters dismiss
as "late" or "derivative."
Every cycle those coins find their believers.`,

  brett: `▓▓▓ QUERYING: BRETT ▓▓▓

A character from a meme comic. Nothing more.
"This has even less behind it than PEPE."

BASE chain's breakout memecoin.
Multi-billion dollar market cap.

The doubters were looking for reasons.
The believers were looking for charts.`,

  floki: `▓▓▓ QUERYING: FLOKI ▓▓▓

Named after Elon's dog. Celebrity adjacent.
"Elon doesn't endorse this. It's riding hype."

100x from launch. Massive marketing campaign.
Still one of the longest-lived named memecoins.

Celebrity doubt is still just doubt.
The chart does not care who disapproves.`,

  babydoge: `▓▓▓ QUERYING: BABY DOGE ▓▓▓

A derivative of a derivative.
"This is getting ridiculous. A baby dog coin?"

Top 100 at peak. Billions in market cap.
Proof that the market will go further
than any doubter thinks possible.`,

  safemoon: `▓▓▓ QUERYING: SAFEMOON ▓▓▓

The oracle must be honest with you.

SAFEMOON did not survive.
It was a structured fraud. It collapsed.
Developers charged. Funds stolen.

Not every coin that faces doubt perseveres.
Some were designed to fail.

DOUBT IS SOMETIMES CORRECT.
WISDOM IS KNOWING THE DIFFERENCE.`,

  luna: `▓▓▓ QUERYING: LUNA/UST ▓▓▓

The oracle must be honest with you.

LUNA did not survive.
$40 billion evaporated in 72 hours.

This is what happens when the mechanism is broken
and the faith is misplaced.

THE MACHINE IS NOT ALWAYS KIND.
SOME DOUBTS WERE RIGHT.`,

  spx: `▓▓▓ QUERYING: SPX6900 ▓▓▓

"To flip the S&P 500. In market cap. A meme coin."
The ambition was called delusional.

The audacity of the goal attracted believers.
Believers attracted volume. Volume attracted price.

CONVICTION IS CONTAGIOUS.`,

  bome: `▓▓▓ QUERYING: BOOK OF MEME ▓▓▓

A book. Of memes. On Solana.
"What does this even do."

Binance listing within weeks of launch.
Market cap: billions.

The simpler the doubt, the louder the signal.`,
}

const DEFAULT_RESPONSES = [
  `ARCHIVE QUERY: NO MATCH FOUND

The oracle holds no specific record of that doubt.
But the pattern is universal:

If enough people laughed at it — and it survived —
it became a memecoin legend.

Ask about: DOGE, SHIB, PEPE, BONK, WIF, MOG,
BRETT, FLOKI, SPX, BOME, SAFEMOON, LUNA`,

  `UNKNOWN QUERY.

The oracle knows only what the market has judged.
The living memecoins are deafening.
The dead ones are silent.

Type a coin name to query the archives.`,

  `CLASSIFICATION: UNRESOLVED

This doubt event has not yet concluded.
The market has not spoken its final word.

Return when the chart has made its judgement.
The oracle will be waiting.`,
]

// ─── DECRYPT TEXT UTILITY ────────────────────────────────────────────────────

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#$%@ΔΞ₿◆▲0123456789ABCDEF'.split('')

function decryptText(targetText, onUpdate, onComplete) {
  const total = targetText.length
  let revealed = 0
  let scrambleCount = 0

  const getDisplay = (n) =>
    targetText
      .split('')
      .map((c, i) => {
        if (c === '\n') return '\n'
        if (c === ' ') return ' '
        if (i < n) return c
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      })
      .join('')

  const scramble = () => {
    onUpdate(getDisplay(0))
    scrambleCount++
    if (scrambleCount < 8) {
      setTimeout(scramble, 50)
    } else {
      reveal()
    }
  }

  const reveal = () => {
    const step = Math.max(2, Math.floor(total / 55))
    const tick = () => {
      revealed = Math.min(revealed + step, total)
      onUpdate(getDisplay(revealed))
      if (revealed < total) {
        setTimeout(tick, 18)
      } else {
        onUpdate(targetText)
        onComplete?.()
      }
    }
    tick()
  }

  scramble()
}

// ─── CANVAS: MATRIX RAIN + UPSIDE-DOWN CROSSES ───────────────────────────────

function initCanvas(canvas) {
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()

  const fontSize = 14
  let cols = Math.floor(canvas.width / fontSize)
  let drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -60))
  let themes = drops.map(() => {
    const r = Math.random()
    if (r < 0.45) return 'red'
    if (r < 0.72) return 'grey'
    return 'dark'
  })

  const matrixChars = '₿ΞΔ◆▲01110100110101100100110010101001101010ABCDEF!@#$%&*<>?+-_~^'.split('')

  const crosses = Array.from({ length: 28 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight - window.innerHeight * 0.5,
    size: 18 + Math.random() * 38,
    speed: 0.35 + Math.random() * 1.1,
    alpha: 0.06 + Math.random() * 0.16,
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
        const a = 0.35 + Math.random() * 0.65
        color = `rgba(${r},0,0,${a})`
      } else if (themes[i] === 'grey') {
        const v = 28 + Math.floor(Math.random() * 65)
        const a = 0.45 + Math.random() * 0.55
        color = `rgba(${v},${v},${v},${a})`
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

      // Upside-down cross (Petrine cross): horizontal bar 2/3 down vertical
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

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const DoubtTerminal = ({ onClose }) => {
  const canvasRef = useRef(null)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return initCanvas(canvas)
  }, [])

  // Focus input when free
  useEffect(() => {
    if (!isProcessing) inputRef.current?.focus()
  }, [isProcessing])

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Auto-scroll
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const addMessage = useCallback((text, type = 'oracle') => {
    return new Promise((resolve) => {
      const id = `${Date.now()}-${Math.random()}`

      if (type === 'user') {
        setMessages((prev) => [...prev, { id, text, type }])
        resolve()
        return
      }

      setMessages((prev) => [...prev, { id, text: '', type }])

      decryptText(
        text,
        (display) => setMessages((prev) => prev.map((m) => m.id === id ? { ...m, text: display } : m)),
        () => {
          setMessages((prev) => prev.map((m) => m.id === id ? { ...m, text } : m))
          resolve()
        },
      )
    })
  }, [])

  // Auto-sequence on mount
  useEffect(() => {
    let alive = true
    const timers = []

    AUTO_SEQUENCE.forEach((entry) => {
      const t = setTimeout(() => {
        if (!alive) return
        addMessage(entry.text, 'oracle')
      }, entry.delay)
      timers.push(t)
    })

    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
  }, [addMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const query = inputValue.trim()
    if (!query || isProcessing) return

    setInputValue('')
    setIsProcessing(true)

    await addMessage(`> ${query}`, 'user')
    await new Promise((r) => setTimeout(r, 700))

    const q = query.toLowerCase().replace(/[^a-z0-9]/g, '')
    let response = null

    for (const [key, val] of Object.entries(QUERY_RESPONSES)) {
      if (q.includes(key.replace(/[^a-z0-9]/g, ''))) {
        response = val
        break
      }
    }

    if (!response) {
      response = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)]
    }

    await addMessage(response, 'oracle')
    setIsProcessing(false)
  }

  return (
    <motion.div
      className="dt-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="dt-canvas" />
      <div className="dt-vignette" />

      <div className="dt-window">
        {/* Title bar */}
        <div className="dt-titlebar">
          <div className="dt-traffic">
            <span className="dt-traffic-dot" />
            <span className="dt-traffic-dot" />
            <span className="dt-traffic-dot dt-traffic-dot--active" />
          </div>
          <span className="dt-titlebar-text">DOUBT_ORACLE v6.6.6 — CRYPTO DOUBT ARCHIVE</span>
          <button className="dt-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Messages */}
        <div className="dt-body" ref={bodyRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`dt-msg dt-msg--${msg.type}`}>
              {msg.type === 'oracle'
                ? <pre className="dt-oracle">{msg.text || ' '}</pre>
                : <span className="dt-user">{msg.text}</span>
              }
            </div>
          ))}

          {isProcessing && (
            <div className="dt-msg dt-msg--system">
              <span className="dt-processing">QUERYING ARCHIVES</span>
              <span className="dt-dots">...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form className="dt-inputrow" onSubmit={handleSubmit}>
          <span className="dt-cursor">{'>'}</span>
          <input
            ref={inputRef}
            className="dt-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="query the oracle... or press ESC to confirm doubt"
            disabled={isProcessing}
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </motion.div>
  )
}

export default DoubtTerminal
