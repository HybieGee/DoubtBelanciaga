import { useState, useRef, useCallback, useEffect } from 'react'

const TARGET_VOL  = 0.3
const FADE_STEPS  = 40
const FADE_MS     = 1000

const AudioToggle = () => {
  const [enabled, setEnabled] = useState(false)
  const audioRef  = useRef(null)
  const fadeRef   = useRef(null)

  useEffect(() => {
    const audio   = new Audio('/background.mp3')
    audio.loop    = true
    audio.volume  = 0
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  const clearFade = () => { if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null } }

  const fadeIn = useCallback(() => {
    const audio = audioRef.current
    audio.play().catch(() => {})
    clearFade()
    const step = TARGET_VOL / FADE_STEPS
    fadeRef.current = setInterval(() => {
      audio.volume = Math.min(TARGET_VOL, parseFloat((audio.volume + step).toFixed(4)))
      if (audio.volume >= TARGET_VOL) clearFade()
    }, FADE_MS / FADE_STEPS)
  }, [])

  const fadeOut = useCallback(() => {
    const audio = audioRef.current
    clearFade()
    const step = TARGET_VOL / FADE_STEPS
    fadeRef.current = setInterval(() => {
      audio.volume = Math.max(0, parseFloat((audio.volume - step).toFixed(4)))
      if (audio.volume <= 0) { clearFade(); audio.pause() }
    }, FADE_MS / FADE_STEPS)
  }, [])

  const toggle = useCallback(() => {
    if (!enabled) { fadeIn();  setEnabled(true)  }
    else          { fadeOut(); setEnabled(false) }
  }, [enabled, fadeIn, fadeOut])

  return (
    <button
      onClick={toggle}
      title={enabled ? 'Mute music' : 'Play music'}
      style={{
        position:      'fixed',
        bottom:        '10px',
        left:          '10px',
        background:    'rgba(0,0,0,0.35)',
        border:        `1px solid ${enabled ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
        color:         enabled ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)',
        fontFamily:    'monospace',
        fontSize:      '11px',
        letterSpacing: '0.12em',
        padding:       '4px 9px',
        cursor:        'pointer',
        zIndex:        9999,
        transition:    'all 0.4s ease',
        userSelect:    'none',
      }}
    >
      {enabled ? '♪ ON' : '♪ OFF'}
    </button>
  )
}

export default AudioToggle
