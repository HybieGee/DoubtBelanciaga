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

      {/* Loading Bar Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          width: '80%',
          maxWidth: '600px',
        }}
      >
        {/* Loading Symbols */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            color: '#fff',
            textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
            letterSpacing: '0.2em',
            marginBottom: '2rem',
            height: '4rem',
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
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
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
              background: 'linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.9))',
              boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}
          />
        </div>

        {/* Percentage */}
        <div
          style={{
            marginTop: '1rem',
            fontSize: '1rem',
            color: '#fff',
            letterSpacing: '0.3em',
            textShadow: '0 0 10px rgba(255,255,255,0.8)',
            fontFamily: 'monospace',
          }}
        >
          {progress}%
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingScreen
