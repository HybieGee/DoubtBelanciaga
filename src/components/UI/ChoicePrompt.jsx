import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import DoubtTerminal from '../DoubtTerminal'
import BelieveTerminal from '../BelieveTerminal'
import { CONTRACT_ADDRESS } from '../../config'
import MarketCapDisplay from './MarketCapDisplay'

const ChoicePrompt = () => {
  const [doubtTerminalOpen, setDoubtTerminalOpen] = useState(false)
  const [believeTerminalOpen, setBelieveTerminalOpen] = useState(false)

  const joinedSide  = useGameStore((s) => s.joinedSide)
  const setShowClash = useGameStore((s) => s.setShowClash)

  const handleChoice = (choice) => {
    if (choice === 'doubt') setDoubtTerminalOpen(true)
    else setBelieveTerminalOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {doubtTerminalOpen && (
          <DoubtTerminal onClose={() => setDoubtTerminalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {believeTerminalOpen && (
          <BelieveTerminal onClose={() => setBelieveTerminalOpen(false)} />
        )}
      </AnimatePresence>

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

      {/* CA display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        style={{
          position: 'fixed',
          top: '0.75rem',
          left: '0',
          right: '0',
          margin: '0 auto',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 'clamp(0.65rem, 1.4vw, 0.9rem)',
            letterSpacing: '0.2em',
            color: '#ffffff',
            WebkitTextStroke: '1px #000',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          }}
        >
          CA: {CONTRACT_ADDRESS}
        </span>
      </motion.div>

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
          left: 'calc(75% - 6.25vw)',
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

      {/* Market cap display — bottom centre */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        style={{
          position:  'fixed',
          bottom:    '1rem',
          left:      '50%',
          transform: 'translateX(-50%)',
          zIndex:    100,
        }}
      >
        <MarketCapDisplay />
      </motion.div>

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
