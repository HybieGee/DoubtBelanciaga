import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import DoubtTerminal from '../DoubtTerminal'
import BelieveTerminal from '../BelieveTerminal'
import MarketCapDisplay from './MarketCapDisplay'

const ChoicePrompt = () => {
  const [doubtTerminalOpen, setDoubtTerminalOpen] = useState(false)
  const [believeTerminalOpen, setBelieveTerminalOpen] = useState(false)
  const [mob, setMob] = useState(false)
  const [doubtHover, setDoubtHover] = useState(false)
  const [doubtTap,   setDoubtTap]   = useState(false)
  const [beliHover,    setBelieveHover] = useState(false)
  const [contractAddress, setContractAddress] = useState('TBA')
  const [beliTap,      setBelieveTap]  = useState(false)

  useEffect(() => {
    const check = () => setMob(window.innerHeight < 520 && window.innerWidth > window.innerHeight)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const joinedSide  = useGameStore((s) => s.joinedSide)
  const setShowClash = useGameStore((s) => s.setShowClash)

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(d => {
      if (d.contractAddress) setContractAddress(d.contractAddress)
    }).catch(() => {})
  }, [])

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
            fontSize: 'clamp(0.9rem, 1.8vw, 1.2rem)',
            letterSpacing: '0.2em',
            color: '#ffffff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          }}
        >
          CA: {contractAddress}
        </span>
      </motion.div>

      {/* DOUBT button - centered in left half */}
      <motion.button
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0 }}
        whileHover={{ scale: 1.07, y: 4 }}
        whileTap={{ scale: 0.93, y: 6 }}
        onClick={() => handleChoice('doubt')}
        onMouseEnter={() => setDoubtHover(true)}
        onMouseLeave={() => { setDoubtHover(false); setDoubtTap(false) }}
        onMouseDown={() => setDoubtTap(true)}
        onMouseUp={() => setDoubtTap(false)}
        style={{
          position: 'fixed',
          top:      mob ? '57%' : '50%',
          left:     mob ? 'calc(22% - 8vw)' : 'calc(25% - 12.5vw)',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          width: mob ? 'clamp(100px, 16vw, 180px)' : 'clamp(200px, 25vw, 400px)',
          height: 'auto',
          zIndex: 100,
        }}
      >
        <motion.img
          src="/button-doubt.png"
          alt="DOUBT"
          animate={{
            filter: doubtTap
              ? 'drop-shadow(0 0 14px rgba(220,20,20,0.55)) brightness(0.6) contrast(1.3)'
              : doubtHover
                ? 'drop-shadow(0 0 30px rgba(180,0,0,0.45)) drop-shadow(0 0 8px rgba(180,0,0,0.3)) brightness(0.82)'
                : 'drop-shadow(0 0 20px rgba(0,0,0,0.5))',
          }}
          transition={{ duration: 0.18 }}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </motion.button>

      {/* BELIEVE button - centered in right half */}
      <motion.button
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0 }}
        whileHover={{ scale: 1.07, y: -4 }}
        whileTap={{ scale: 0.93, y: -2 }}
        onClick={() => handleChoice('believe')}
        onMouseEnter={() => setBelieveHover(true)}
        onMouseLeave={() => { setBelieveHover(false); setBelieveTap(false) }}
        onMouseDown={() => setBelieveTap(true)}
        onMouseUp={() => setBelieveTap(false)}
        style={{
          position: 'fixed',
          top:      mob ? '57%' : '50%',
          left:     mob ? 'calc(75% - 8vw)' : 'calc(75% - 6.25vw)',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          width: mob ? 'clamp(100px, 16vw, 180px)' : 'clamp(200px, 25vw, 400px)',
          height: 'auto',
          zIndex: 100,
        }}
      >
        <motion.img
          src="/button-believe.png"
          alt="BELIEVE"
          animate={{
            filter: beliTap
              ? 'drop-shadow(0 0 18px rgba(200,180,120,0.6)) drop-shadow(0 0 6px rgba(180,150,80,0.5))'
              : beliHover
                ? 'drop-shadow(0 0 14px rgba(200,180,120,0.45)) drop-shadow(0 0 4px rgba(180,150,80,0.35))'
                : 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
          }}
          transition={{ duration: 0.18 }}
          style={{ width: '100%', height: 'auto', display: 'block' }}
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
          transform: 'translateX(-50%) translateY(20%)',
          zIndex:    100,
        }}
      >
        <MarketCapDisplay />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="choice-subtitle"
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
