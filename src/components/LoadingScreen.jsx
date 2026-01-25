import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

const LoadingScreen = () => {
  const [text, setText] = useState('')
  const fullText = 'DOUBT vs BELIEVE'
  const videoRef = useRef(null)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Set video playback speed to 0.33x (1/3 speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.33
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      >
        <source src="/possible.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 2,
        }}
      />

      {/* Content overlay */}
      <div style={{ position: 'relative', width: '100%', textAlign: 'center', zIndex: 3 }}>
        {/* Title text */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 8vw, 6rem)',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            color: '#fff',
            textShadow: '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.3)',
            marginBottom: '2rem',
          }}
        >
          {text}
        </h1>

        {/* Loading animation */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            marginTop: '2rem',
            fontSize: '1rem',
            letterSpacing: '0.3em',
            color: '#fff',
            textShadow: '0 0 10px rgba(0,0,0,0.8)',
          }}
        >
          LOADING
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
