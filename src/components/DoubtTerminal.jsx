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
> Loading crypto_doubt_archives...
> Cross-referencing 476 Bitcoin obituaries...
> Cataloguing 2,847 doubt events (2009-2026)...
> Survivor probability matrix: LOADED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE ONLINE. BEGIN TRANSMISSION.`,
  },
  {
    id: 'btc',
    delay: 5000,
    text: `▓▓▓ ARCHIVE: BTC — 2011 ▓▓▓

"Bitcoin is a Ponzi scheme."
"It will be worthless by next year."
"No serious person uses this."
— Bloomberg, Forbes, Wall Street, 2011

PRICE AT MAXIMUM DOUBT: $0.30
PRICE 10 YEARS LATER: $68,000

The doubters wrote the articles.
The believers wrote the wallets.

DOUBT 0 — FAITH 1`,
  },
  {
    id: 'doge',
    delay: 12000,
    text: `▓▓▓ ARCHIVE: DOGE — 2020 ▓▓▓

A literal joke. A meme with no utility.
A dog. A Shibe. A waste of mining power.
"Invest in DOGE? Are you stupid?"

MARKET CAP AT TIME OF RIDICULE: ~$300M
MARKET CAP AT PEAK: $88,000,000,000

Eighty-eight. Billion. Dollars.
For the dog coin they said was worthless.

DOUBT IS THE PRICE OF ENTRY.`,
  },
  {
    id: 'eth',
    delay: 20000,
    text: `▓▓▓ ARCHIVE: ETH — 2016 ▓▓▓

"Vitalik is too young."
"Smart contracts are a legal nightmare."
"It cannot scale. It will never scale."
"The DAO hack proved Ethereum is broken."

ETH PRICE AFTER DAO HACK: $0.54
ETH PRICE AT ALL-TIME HIGH: $4,891
DeFi TOTAL VALUE LOCKED AT PEAK: $180B

They forked. They rebuilt. They dominated.
$180 billion in finance runs on what
they declared irreparably broken.

THE MACHINE DOES NOT CARE ABOUT YOUR DOUBT.`,
  },
  {
    id: 'shib',
    delay: 29000,
    text: `▓▓▓ ARCHIVE: SHIB & PEPE ▓▓▓

SHIB: "A worthless Dogecoin clone."
Vitalik burned 40% of the supply to charity.
They said it was over.
+400% the following month.

PEPE: "An old dead meme from 4chan."
"Frogs don't have fundamentals."
Market cap crossed $1 BILLION in weeks.

The doubters were the fundamentals.
Their sell pressure was the floor.

DOUBT CREATES THE DIP.
FAITH CAPTURES THE RIP.`,
  },
  {
    id: 'final',
    delay: 38000,
    text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORACLE TRANSMISSION COMPLETE

Every coin you have ever doubted
is either dead or richer than your doubt.

You have chosen DOUBT.
You have chosen to question.
That is the oldest form of wisdom.

Now confirm your conviction.
Or return and choose BELIEF instead.

> Type a coin ticker to query the archives
> Press [ESC] or click X to CONFIRM DOUBT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
]

const QUERY_RESPONSES = {
  bitcoin: `▓▓▓ QUERYING: BITCOIN ▓▓▓

476 obituaries written since 2010.
100% survival rate.

"Bitcoin is dead" — declared at $0.01, $1, $100,
$1,000, $10,000, $30,000, $15,000 again.

It absorbed every funeral and called it Tuesday.

The blockchain does not read newspapers.`,

  btc: `▓▓▓ QUERYING: BITCOIN ▓▓▓

476 obituaries written since 2010.
100% survival rate.

It was declared dead at every price.
It survived every declaration.

THE MACHINE PERSISTS.`,

  ethereum: `▓▓▓ QUERYING: ETHEREUM ▓▓▓

Survived: DAO hack, scaling wars, competitor
chains, "flippening" predictions, four 90%+ drawdowns.

$180 billion in DeFi built on what
they said was a centralized toy.

Vitalik was 19 when they said he was too young.
The doubters are now using his technology.`,

  eth: `▓▓▓ QUERYING: ETHEREUM ▓▓▓

Survived: DAO hack, scaling wars, competitor
chains, "flippening" predictions, four 90%+ drawdowns.

Vitalik was 19 when they said he was too young.
The doubters are now using his technology.`,

  solana: `▓▓▓ QUERYING: SOLANA ▓▓▓

"Centralized garbage."
"FTX will kill it."
"It goes down every week."

FTX did fall. SOL fell with it. -96%.
Then it came back. Hit $260.

The doubters stopped counting the outages.
Solana stopped having them.

NETWORKS, LIKE COINS, SURVIVE THEIR DEATHS.`,

  sol: `▓▓▓ QUERYING: SOLANA ▓▓▓

FTX collapsed. SOL fell -96%.
Then it came back. Hit all-time highs.

The network survived its darkest sponsor.
That is the definition of antifragile.`,

  dogecoin: `▓▓▓ QUERYING: DOGECOIN ▓▓▓

Started as a joke between two developers.
Made it to TIME magazine.
Made it to SNL.
Made it to $88 billion market cap.

Jackson Palmer (co-creator) said it was a scam.
He was right about everything.
And it still mooned.

DOGE does not care about your thesis.`,

  doge: `▓▓▓ QUERYING: DOGECOIN ▓▓▓

Started as a joke between two developers.
Made it to $88 billion market cap.

The joke became real.
The real became the joke.

That is how memecoins work.`,

  shib: `▓▓▓ QUERYING: SHIBA INU ▓▓▓

Vitalik burned 40% of total supply.
Donated the rest to COVID relief in India.

They said: "It is over. Project is dead."

Price next 30 days: +400%
Peak market cap: $40 billion

The community called Vitalik's donation
"the most bullish event in SHIB history."
They were correct.`,

  'shiba': `▓▓▓ QUERYING: SHIBA INU ▓▓▓

Vitalik burned 40% of total supply to charity.
The community called it the most bullish event.
They were correct.

Peak market cap: $40 billion.
For the coin they said was over.`,

  pepe: `▓▓▓ QUERYING: PEPE ▓▓▓

"Frogs have no fundamentals."
"It is based on a 4chan meme."
"There is nothing behind it."

$1 billion market cap. In weeks.

The meme IS the fundamental.
The community IS the utility.
The doubt IS the floor.`,

  bonk: `▓▓▓ QUERYING: BONK ▓▓▓

Airdropped as a Solana "hail mary"
during the FTX collapse.

"Desperate charity coin." "Worth zero."

Fueled a Solana NFT renaissance.
DEX volume on Solana +1000% post-BONK.

The joke became the catalyst.
The catalyst became the recovery.`,

  xrp: `▓▓▓ QUERYING: XRP ▓▓▓

SEC lawsuit. 3 years of litigation.
"XRP is a security." "Ripple will lose."
"Crypto is finished."

Judge ruled: XRP is NOT a security
on secondary markets.

The price remembered.
The doubters forgot.

REGULATORY DOUBT IS STILL JUST DOUBT.`,

  ripple: `▓▓▓ QUERYING: XRP/RIPPLE ▓▓▓

3 years. SEC lawsuit. Declared dead weekly.

Judge ruled: NOT a security.
Price remembered. Doubters forgot.

DOUBT IS TEMPORARY. BLOCKCHAIN IS PERMANENT.`,

  bnb: `▓▓▓ QUERYING: BNB ▓▓▓

"Dies when Binance dies."
"CZ will be arrested."
"It is all manipulation."

CZ was arrested.
Binance paid a $4.3 billion fine.
BNB survived. Hit new all-time highs.

The oracle does not know why.
The oracle only knows: it survived.`,

  safemoon: `▓▓▓ QUERYING: SAFEMOON ▓▓▓

The oracle must be honest with you.

SAFEMOON did not survive.
It was a ponzi. It collapsed.
Developers were charged with fraud.

Not every coin that faces doubt perseveres.
Some die. Some are murdered.

DOUBT IS SOMETIMES CORRECT.
WISDOM IS KNOWING THE DIFFERENCE.`,

  luna: `▓▓▓ QUERYING: LUNA/UST ▓▓▓

The oracle must be honest with you.

LUNA did not survive.
UST depegged. $40 billion evaporated.
In 72 hours.

Do Kwon fled. Was arrested in Montenegro.

This is what happens when doubt is correct
and faith is misplaced.

THE MACHINE IS NOT ALWAYS KIND.`,

  floki: `▓▓▓ QUERYING: FLOKI ▓▓▓

Named after Elon Musk's dog.
Marketed as the "people's cryptocurrency."

"Elon does not actually endorse this."
"It is riding celebrity hype."

It was. And it still made 100x from launch.

Celebrity doubt is still just doubt.
The chart does not care who disapproves.`,
}

const DEFAULT_RESPONSES = [
  `ARCHIVE QUERY: NO MATCH FOUND

The oracle holds no specific record of that doubt.
But the pattern remains constant:

If enough people doubted it and it survived —
it became legend.

Ask about: BTC, ETH, SOL, DOGE, SHIB, PEPE,
BONK, XRP, BNB, FLOKI, LUNA, SAFEMOON`,

  `UNKNOWN QUERY RECEIVED.

The oracle knows only survivors and cautionary tales.
The living coins are deafening.
The dead coins are silent.

Type a coin name to query the archives.`,

  `CLASSIFICATION: RESTRICTED

This doubt event has not yet resolved.
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
