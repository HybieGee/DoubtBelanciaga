import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import FallingCrosses from './FallingCrosses'

const LoadingScreen = () => {
  const [text, setText] = useState('')
  const fullText = 'DOUBT & BELIEF'

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
        background: '#808080',
      }}
    >
      {/* Layer 4 (back): Static Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      >
        <img
          src="/background.png"
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* Layer 3: Falling Crosses */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
        }}
      >
        <FallingCrosses />
      </div>

      {/* Layer 2: Center Character */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/character.png"
          alt=""
          style={{
            width: 'auto',
            height: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Layer 1 (front): Content overlay */}
      <div style={{ position: 'relative', width: '100%', textAlign: 'center', zIndex: 4 }}>
        {/* Title text */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 8vw, 6rem)',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            color: '#fff',
            WebkitTextStroke: '2px #000',
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
            WebkitTextStroke: '1px #000',
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
