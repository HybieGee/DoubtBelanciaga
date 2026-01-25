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
    <>
      {/* Title centered */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 'bold',
          letterSpacing: '0.3em',
          color: '#fff',
          WebkitTextStroke: '2px #000',
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        PICK A FAITH
      </motion.h2>

      {/* DOUBT button - positioned in left half */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleChoice('doubt')}
        style={{
          position: 'fixed',
          top: '50%',
          left: '25%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          width: 'clamp(250px, 30vw, 400px)',
          height: 'auto',
        }}
      >
        <img
          src="/button-doubt.png"
          alt="DOUBT"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))',
          }}
        />
      </motion.button>

      {/* BELIEVE button - positioned in right half */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleChoice('believe')}
        style={{
          position: 'fixed',
          top: '50%',
          left: '75%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          width: 'clamp(250px, 30vw, 400px)',
          height: 'auto',
        }}
      >
        <img
          src="/button-believe.png"
          alt="BELIEVE"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
          }}
        />
      </motion.button>

      {/* Subtitle with better readability */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          position: 'fixed',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          color: '#fff',
          letterSpacing: '0.2em',
          textAlign: 'center',
          WebkitTextStroke: '1px #000',
          textShadow: '0 0 10px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          maxWidth: '90%',
        }}
      >
        Choose wisely. Your conviction determines your fate.
      </motion.p>
    </>
  )
}

export default ChoicePrompt
