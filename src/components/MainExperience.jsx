import { motion } from 'framer-motion'
import UI from './UI/UI'
import FallingCrosses from './FallingCrosses'
import ClashPage from './ClashPage'
import { useGameStore } from '../store/gameStore'

const MainExperience = () => {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const showClash = useGameStore((state) => state.showClash)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
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
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* LAYER 3: Animated Crosses (on top of background) */}
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

      {/* LAYER 2: Center Character (on top of crosses) */}
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
            transform: 'translateX(-11px)',
          }}
        />
      </div>

      {/* LAYER 1 (FRONT): UI Overlay (buttons, text, etc) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 4,
        }}
      >
        <UI />
      </div>

      {/* CLASH PAGE: full-screen overlay after joining */}
      {showClash && <ClashPage />}
    </motion.div>
  )
}

export default MainExperience
