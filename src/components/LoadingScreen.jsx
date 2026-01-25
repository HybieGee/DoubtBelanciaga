import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const symbols = ['✟', '✝', '†', '☥', '✞', '✚', '⚰', '☠', '⛧', '⸸']

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  const getLoadingSymbols = () => {
    const symbolCount = Math.floor((progress / 100) * 30)
    let result = ''
    for (let i = 0; i < symbolCount; i++) {
      result += symbols[Math.floor(Math.random() * symbols.length)]
    }
    return result
  }

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
        background: '#000',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/loading-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
        }}
      />

      {/* Loading Elements - Positioned within monitor screen */}
      <div
        style={{
          position: 'fixed',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center',
          width: '40vw',
          maxWidth: '600px',
        }}
      >
        {/* Loading Symbols */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 2rem)',
            color: '#000',
            textShadow: '0 0 10px rgba(0,0,0,0.3)',
            letterSpacing: '0.2em',
            marginBottom: '1.5rem',
            height: '3rem',
            overflow: 'hidden',
            fontFamily: 'monospace',
          }}
        >
          {getLoadingSymbols()}
        </motion.div>

        {/* Progress Bar Background */}
        <div
          style={{
            width: '100%',
            margin: '0 auto',
            height: '2px',
            background: 'transparent',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Progress Bar Fill */}
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            style={{
              height: '100%',
              background: '#000',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        {/* Percentage */}
        <div
          style={{
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: '#000',
            letterSpacing: '0.4em',
            textShadow: '0 0 5px rgba(0,0,0,0.3)',
            fontFamily: 'monospace',
            opacity: 0.8,
          }}
        >
          {progress}%
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
