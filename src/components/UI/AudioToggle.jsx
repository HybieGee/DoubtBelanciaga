import { useState, useRef, useCallback, useEffect } from 'react'

const AudioToggle = () => {
  const [enabled, setEnabled] = useState(false)
  const ctxRef  = useRef(null)
  const gainRef = useRef(null)

  const build = useCallback(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx

    // Master — very quiet, fades in later
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, ctx.currentTime)
    master.connect(ctx.destination)
    gainRef.current = master

    // Brown noise: 4s looping buffer
    const sr   = ctx.sampleRate
    const buf  = ctx.createBuffer(1, sr * 4, sr)
    const data = buf.getChannelData(0)
    let last   = 0
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1
      data[i] = (last + 0.02 * w) / 1.02
      last    = data[i]
      data[i] *= 3.5
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    noise.loop   = true

    // Low-pass to soften noise
    const lp = ctx.createBiquadFilter()
    lp.type            = 'lowpass'
    lp.frequency.value = 350
    lp.Q.value         = 0.4

    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.65
    noise.connect(lp)
    lp.connect(noiseGain)
    noiseGain.connect(master)
    noise.start()

    // Sub drone — felt more than heard
    const makeOsc = (freq, amp) => {
      const osc = ctx.createOscillator()
      osc.type            = 'sine'
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = amp
      osc.connect(g)
      g.connect(master)
      osc.start()
    }
    makeOsc(41, 0.18)
    makeOsc(62, 0.10)
    makeOsc(110, 0.04)
  }, [])

  const toggle = useCallback(() => {
    if (!enabled) {
      if (!ctxRef.current) build()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      gainRef.current.gain.setTargetAtTime(0.038, ctx.currentTime, 2)
      setEnabled(true)
    } else {
      gainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.8)
      setEnabled(false)
    }
  }, [enabled, build])

  useEffect(() => () => ctxRef.current?.close(), [])

  return (
    <button
      onClick={toggle}
      title={enabled ? 'Mute ambient' : 'Play ambient'}
      style={{
        position:   'fixed',
        bottom:     '10px',
        left:       '10px',
        background: 'rgba(0,0,0,0.35)',
        border:     `1px solid ${enabled ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
        color:      enabled ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)',
        fontFamily: 'monospace',
        fontSize:   '11px',
        letterSpacing: '0.12em',
        padding:    '4px 9px',
        cursor:     'pointer',
        zIndex:     9999,
        transition: 'all 0.4s ease',
        userSelect: 'none',
      }}
    >
      {enabled ? '♪ ON' : '♪ OFF'}
    </button>
  )
}

export default AudioToggle
