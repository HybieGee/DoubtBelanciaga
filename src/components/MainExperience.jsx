import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import UI from './UI/UI'
import { useGameStore } from '../store/gameStore'

const MainExperience = () => {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const videoRef = useRef(null)

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
      transition={{ duration: 1 }}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
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

      {/* Dark overlay for better UI readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2,
        }}
      />

      {/* UI Overlay */}
      <div style={{ position: 'relative', zIndex: 3, width: '100%', height: '100%' }}>
        <UI />
      </div>
    </motion.div>
  )
}

export default MainExperience
