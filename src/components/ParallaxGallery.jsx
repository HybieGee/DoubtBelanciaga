import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import './ParallaxGallery.css'

const ParallaxGallery = ({ type, onClose }) => {
  const [currentScene, setCurrentScene] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Example coins data - will expand this
  const coins = type === 'doubt'
    ? [
        { name: 'DOGECOIN', tagline: 'JUST A JOKE COIN', symbol: 'DOGE' },
        { name: 'SHIBA INU', tagline: 'COPYCAT TRASH', symbol: 'SHIB' },
        { name: 'PEPE', tagline: 'DEAD FROG MEME', symbol: 'PEPE' },
        { name: 'FLOKI', tagline: 'ELON WONT SAVE YOU', symbol: 'FLOKI' },
        { name: 'BONK', tagline: 'SOLANA IS DEAD', symbol: 'BONK' },
        { name: 'SAFEMOON', tagline: 'OBVIOUS PONZI', symbol: 'SAFEMOON' },
      ]
    : [
        { name: 'DOGECOIN', tagline: 'DO ONLY GOOD EVERYDAY', symbol: 'DOGE' },
        { name: 'SHIBA INU', tagline: 'SHIBARMY UNITED', symbol: 'SHIB' },
        { name: 'PEPE', tagline: 'CULT OF THE FROG', symbol: 'PEPE' },
        { name: 'MOG COIN', tagline: 'ITS MOGGING TIME', symbol: 'MOG' },
        { name: 'BOOK OF MEME', tagline: 'IMMORTALIZE MEMES', symbol: 'BOME' },
        { name: 'SPX6900', tagline: 'TO 6900 OR BUST', symbol: 'SPX' },
      ]

  // Auto-scroll through scenes
  useEffect(() => {
    const duration = 5000 // 5 seconds per scene
    const interval = setInterval(() => {
      setCurrentScene((prev) => {
        if (prev >= coins.length - 1) {
          return 0 // Loop back to start
        }
        return prev + 1
      })
    }, duration)

    return () => clearInterval(interval)
  }, [coins.length])

  // Smooth scroll progress within current scene
  useEffect(() => {
    const duration = 5000
    let startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setScrollProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    startTime = Date.now()
    setScrollProgress(0)
    animate()
  }, [currentScene])

  // ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`parallax-gallery ${type}`}
    >
      {/* Close Button */}
      <button className="close-button" onClick={onClose}>
        ✕
      </button>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        {coins.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentScene ? 'active' : ''} ${index < currentScene ? 'completed' : ''}`}
          />
        ))}
      </div>

      {/* Scenes Container */}
      <div className="scenes-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="scene-wrapper"
          >
            <CoinScene
              coin={coins[currentScene]}
              type={type}
              scrollProgress={scrollProgress}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Particle System */}
      <ParticleSystem type={type} />
    </motion.div>
  )
}

const CoinScene = ({ coin, type, scrollProgress }) => {
  // Calculate parallax offsets based on scroll progress
  const bgOffset = scrollProgress * 50 // Slowest
  const midOffset = scrollProgress * 100 // Medium
  const logoOffset = scrollProgress * 150 // Normal
  const fgOffset = scrollProgress * 200 // Fastest

  return (
    <div className="coin-scene">
      {/* Layer 1: Background (slowest parallax) */}
      <motion.div
        className="layer background"
        style={{
          transform: `translateY(${bgOffset}px)`,
        }}
      >
        {/* Placeholder: Will be replaced with actual image */}
        <div className={`placeholder-bg ${type}`} />
      </motion.div>

      {/* Layer 2: Midground */}
      <motion.div
        className="layer midground"
        style={{
          transform: `translateY(${midOffset}px)`,
        }}
      >
        <div className="coin-info">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="coin-name"
          >
            {coin.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="coin-tagline"
          >
            {coin.tagline}
          </motion.p>
        </div>
      </motion.div>

      {/* Layer 3: Coin Logo (main focus) */}
      <motion.div
        className="layer coin-logo"
        style={{
          transform: `translateY(${logoOffset}px)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`placeholder-logo ${type}`}
        >
          {coin.symbol}
        </motion.div>
      </motion.div>

      {/* Layer 4: Foreground (fastest parallax) */}
      <motion.div
        className="layer foreground"
        style={{
          transform: `translateY(${fgOffset}px)`,
        }}
      >
        <div className={`placeholder-fg ${type}`} />
      </motion.div>
    </div>
  )
}

const ParticleSystem = ({ type }) => {
  const particleCount = 30

  return (
    <div className="particle-container">
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          className={`particle ${type}`}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  )
}

export default ParallaxGallery
