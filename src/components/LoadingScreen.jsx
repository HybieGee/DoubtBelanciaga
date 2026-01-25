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
      }}
    >
      {/* LAYER 4 (BACK): Split Black/White Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: 'linear-gradient(to right, #000 50%, #fff 50%)',
        }}
      />

      {/* LAYER 3: Animated Crosses */}
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

      {/* LAYER 2: Center Character */}
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
            height: '100vh',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* LAYER 1 (FRONT): Content overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          {/* Title text */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              color: '#fff',
              WebkitTextStroke: '2px #000',
              textShadow: '0 0 20px rgba(0,0,0,0.8)',
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
      </div>
    </motion.div>
  )
}

export default LoadingScreen
