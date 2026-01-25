import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { submitChoice } from '../../api/game'

const ChoicePrompt = () => {
  const makeChoice = useGameStore((state) => state.makeChoice)
  const fingerprint = useGameStore((state) => state.fingerprint)

  const handleChoice = async (choice) => {
    makeChoice(choice)

    try {
      await submitChoice(fingerprint, choice)
    } catch (error) {
      console.error('Failed to submit choice:', error)
    }
  }

  return (
    <>
      {/* Title - centered on entire screen */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: 'fixed',
          top: '15%',
          left: '0',
          right: '0',
          margin: '0 auto',
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 'bold',
          letterSpacing: '0.3em',
          color: '#fff',
          WebkitTextStroke: '2px #000',
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        PICK A FAITH
      </motion.h2>

      {/* DOUBT button - centered in left half */}
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
          left: 'calc(25% - 12.5vw)',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          width: 'clamp(200px, 25vw, 400px)',
          height: 'auto',
          zIndex: 100,
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

      {/* BELIEVE button - centered in right half */}
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
          left: 'calc(75% - 12.5vw)',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          width: 'clamp(200px, 25vw, 400px)',
          height: 'auto',
          zIndex: 100,
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

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{
          position: 'fixed',
          bottom: '15%',
          left: '0',
          right: '0',
          margin: '0 auto',
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          fontWeight: 'bold',
          color: '#fff',
          letterSpacing: '0.2em',
          textAlign: 'center',
          WebkitTextStroke: '1px #000',
          textShadow: '0 0 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,1)',
          pointerEvents: 'none',
          maxWidth: '90%',
          zIndex: 100,
        }}
      >
        Choose wisely. Your conviction determines your fate.
      </motion.p>
    </>
  )
}

export default ChoicePrompt
