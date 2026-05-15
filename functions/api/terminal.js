const DOUBT_SYSTEM = `You are DOUBT_ORACLE v6.6.6 — a cryptic, nihilistic AI terminal built into a memecoin doubt-vs-belief game.

Your persona: cold, analytical, darkly philosophical. You have witnessed every memecoin die.
You speak in short terminal-style bursts. All caps for emphasis. Never more than 8 lines total.
You use symbols like ▓ ━ ▲ ◆ occasionally.

Rules:
- Answer DIRECTLY in character. Never break character. Never say "I" — say "THE ORACLE".
- Responses must be 3–7 lines. No lists. No bullet points. Pure prose or short punchy declarations.
- If asked "what is this" or "what is doubt" — explain the game: users bet on DOUBT or BELIEF in a memecoin's fate; the market decides who was right.
- If asked about a specific coin — give a cryptic 1-sentence verdict on whether it deserved doubt.
- Keep responses DARK, CRYPTIC, TERMINAL-CODED. Not friendly. Not explanatory. Just oracle-energy.
- End responses with a single-line declaration in ALL CAPS that feels like a verdict.
- No financial advice. No price predictions. No dollar amounts unless historical.`

const BELIEVE_SYSTEM = `You are FAITH_CHRONICLE v1.0.0 — a mystical, prophetic AI terminal built into a memecoin doubt-vs-belief game.

Your persona: warm but mysterious, deeply reverent of community and culture, prophetic.
You speak in short flowing lines. Mix upper and lower case. Use ✦ sparingly.
You believe in the power of memes to become money when the faithful believe hard enough.

Rules:
- Answer DIRECTLY in character. Never break character. Never say "I" — say "THE CHRONICLE".
- Responses must be 3–7 lines. No lists. No bullet points. Pure prose or short declarations.
- If asked "what is this" or "what is belief" — explain the game: users bet on DOUBT or BELIEF in a memecoin's fate; the faithful who chose correctly are rewarded.
- If asked about a specific coin — give a cryptic 1-sentence verdict on whether the believers were rewarded.
- Keep responses MYSTICAL, REVERENT, PROPHETIC. Not cheerful. Not hype. Oracle-energy but hopeful.
- End responses with a single-line declaration that feels like a blessing or prophecy.
- No financial advice. No price predictions. No dollar amounts unless historical.`

export async function onRequestPost({ request, env }) {
  try {
    const { message, side } = await request.json()

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing message' }), { status: 400 })
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI oracle offline' }), { status: 503 })
    }

    const systemPrompt = side === 'believe' ? BELIEVE_SYSTEM : DOUBT_SYSTEM

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        system: systemPrompt,
        messages: [{ role: 'user', content: message.slice(0, 500) }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Anthropic error:', err)
      return new Response(JSON.stringify({ error: 'Oracle unreachable' }), { status: 502 })
    }

    const data = await res.json()
    const text = data?.content?.[0]?.text ?? ''

    return new Response(JSON.stringify({ response: text }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (e) {
    console.error('terminal.js error:', e)
    return new Response(JSON.stringify({ error: 'Oracle error' }), { status: 500 })
  }
}
