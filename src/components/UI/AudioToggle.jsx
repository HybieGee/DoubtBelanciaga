import { useState, useRef, useEffect, useCallback } from 'react'

const TARGET_VOL = 0.4
const FADE_MS    = 1000
const FADE_STEPS = 40

const AudioToggle = () => {
  const [muted,   setMuted]   = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef  = useRef(null)
  const fadeRef   = useRef(null)

  const clearFade = () => { if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null } }

  const fadeTo = useCallback((target) => {
    const audio = audioRef.current
    if (!audio) return
    clearFade()
    const current  = audio.volume
    const diff     = target - current
    const step     = diff / FADE_STEPS
    fadeRef.current = setInterval(() => {
      const next = parseFloat((audio.volume + step).toFixed(4))
      audio.volume = target > current ? Math.min(target, next) : Math.max(target, next)
      if (audio.volume === target) clearFade()
    }, FADE_MS / FADE_STEPS)
  }, [])

  const start = useCallback(() => {
    const audio = audioRef.current
    if (!audio || playing) return
    audio.volume = 0
    audio.play().then(() => {
      setPlaying(true)
      fadeTo(TARGET_VOL)
    }).catch(() => {})
  }, [playing, fadeTo])

  // Set up audio and try to play immediately; fall back to first interaction
  useEffect(() => {
    const audio    = new Audio('/background.mp3')
    audio.loop     = true
    audio.volume   = 0
    audioRef.current = audio

    // Try autoplay first
    audio.play().then(() => {
      setPlaying(true)
      fadeTo(TARGET_VOL)
    }).catch(() => {
      // Blocked — start on first user interaction anywhere on page
      const onInteract = () => {
        start()
        document.removeEventListener('click',      onInteract)
        document.removeEventListener('keydown',    onInteract)
        document.removeEventListener('touchstart', onInteract)
      }
      document.addEventListener('click',      onInteract)
      document.addEventListener('keydown',    onInteract)
      document.addEventListener('touchstart', onInteract)
    })

    return () => {
      clearFade()
      audio.pause()
      audio.src = ''
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(() => {
    if (!playing) { start(); return }
    if (muted) {
      fadeTo(TARGET_VOL)
      setMuted(false)
    } else {
      fadeTo(0)
      setMuted(true)
    }
  }, [muted, playing, start, fadeTo])

  return (
    <button
      onClick={toggle}
      title={muted ? 'Unmute music' : 'Mute music'}
      style={{
        position:      'fixed',
        bottom:        '10px',
        left:          '10px',
        background:    'rgba(0,0,0,0.35)',
        border:        `1px solid ${(!muted && playing) ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
        color:         (!muted && playing) ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)',
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
      {(!muted && playing) ? '♪ ON' : '♪ OFF'}
    </button>
  )
}

export default AudioToggle
