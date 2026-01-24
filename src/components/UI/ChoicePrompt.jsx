import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { submitChoice } from '../../api/game'

const ChoicePrompt = () => {
  const makeChoice = useGameStore((state) => state.makeChoice)
  const fingerprint = useGameStore((state) => state.fingerprint)

  const handleChoice = async (choice) => {
    makeChoice(choice)

    // Submit choice to backend
    try {
      await submitChoice(fingerprint, choice)
    } catch (error) {
      console.error('Failed to submit choice:', error)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 'bold',
          marginBottom: '3rem',
          letterSpacing: '0.3em',
          color: '#fff',
          textShadow: '0 0 20px rgba(255,255,255,0.5)',
        }}
      >
        PICK A FAITH
      </motion.h2>

      <div
        style={{
          display: 'flex',
          gap: '4rem',
          justifyContent: 'center',
          pointerEvents: 'all',
        }}
      >
        {/* DOUBT button */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('doubt')}
          style={{
            padding: '2rem 3rem',
            fontSize: '2rem',
            fontWeight: 'bold',
            letterSpacing: '0.2em',
            background: 'linear-gradient(135deg, #000 0%, #333 100%)',
            color: '#fff',
            border: '3px solid #fff',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(255,0,0,0.3)',
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>DOUBT</span>
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, #f00 0%, transparent 70%)',
              zIndex: 0,
            }}
          />
        </motion.button>

        {/* BELIEVE button */}
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('believe')}
          style={{
            padding: '2rem 3rem',
            fontSize: '2rem',
            fontWeight: 'bold',
            letterSpacing: '0.2em',
            background: 'linear-gradient(135deg, #fff 0%, #ddd 100%)',
            color: '#000',
            border: '3px solid #000',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(255,255,255,0.5)',
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>BELIEVE</span>
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
              zIndex: 0,
            }}
          />
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          marginTop: '2rem',
          fontSize: '1rem',
          color: '#888',
          letterSpacing: '0.2em',
        }}
      >
        Choose wisely. Your conviction determines your fate.
      </motion.p>
    </div>
  )
}

export default ChoicePrompt
