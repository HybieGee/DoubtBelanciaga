import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [text, setText] = useState('')
  const fullText = 'DOUBT vs BELIEVE'

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
        background: 'linear-gradient(90deg, #000 50%, #fff 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
        {/* Split text effect */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 8vw, 6rem)',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            position: 'relative',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: '50%',
              color: '#fff',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </span>
          <span
            style={{
              position: 'absolute',
              left: '50%',
              right: 0,
              color: '#000',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </span>
          <span style={{ opacity: 0 }}>{fullText}</span>
        </h1>

        {/* Loading animation */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            marginTop: '2rem',
            fontSize: '1rem',
            letterSpacing: '0.3em',
          }}
        >
          <span style={{ color: '#fff', marginRight: '50%' }}>LOADING</span>
          <span style={{ color: '#000' }}>LOADING</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
