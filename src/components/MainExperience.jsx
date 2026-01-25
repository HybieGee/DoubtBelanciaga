import { motion } from 'framer-motion'
import UI from './UI/UI'
import FallingCrosses from './FallingCrosses'
import { useGameStore } from '../store/gameStore'

const MainExperience = () => {
  const gamePhase = useGameStore((state) => state.gamePhase)

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
        background: '#808080',
      }}
    >
      {/* Layer 4 (back): Static Background - Untitled-3.png */}
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

      {/* Layer 3: Falling Crosses Animation */}
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

      {/* Layer 1 (front): UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 4, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <UI />
        </div>
      </div>
    </motion.div>
  )
}

export default MainExperience
