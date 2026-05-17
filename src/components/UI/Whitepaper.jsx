import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const Whitepaper = ({ onClose }) => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Shifted earlier so each section is fully visible at mid-screen, not top
  const opacity1 = useTransform(scrollYProgress, [0, 0.06, 0.14, 0.20], [1, 1, 1, 0])
  const opacity2 = useTransform(scrollYProgress, [0.05, 0.12, 0.26, 0.33], [0, 1, 1, 0])
  const opacity3 = useTransform(scrollYProgress, [0.20, 0.28, 0.42, 0.49], [0, 1, 1, 0])
  const opacity4 = useTransform(scrollYProgress, [0.36, 0.44, 0.57, 0.64], [0, 1, 1, 0])
  const opacity5 = useTransform(scrollYProgress, [0.51, 0.59, 0.73, 0.80], [0, 1, 1, 0])
  const opacity6 = useTransform(scrollYProgress, [0.66, 0.74, 0.88, 0.95], [0, 1, 1, 0])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const h2Style = {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    marginBottom: '2rem',
    color: '#fff',
    letterSpacing: '0.15em',
    fontFamily: 'Bungee, monospace',
  }
  const h3Style = {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#fff',
    letterSpacing: '0.1em',
  }
  const pStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.9',
    color: '#aaa',
    marginBottom: '2rem',
  }
  const liStyle = { marginBottom: '0.5rem' }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: '#000',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* Floating symbols */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', opacity: 0.08 }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -100, 0], x: [0, Math.sin(i) * 50, 0], rotate: [0, 360] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: `${(i * 7) % 100}%`,
              top: `${(i * 13) % 100}%`,
              fontSize: '4rem',
              color: '#fff',
            }}
          >
            {['✟', '✝', '†', '☥'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Parallax symbol */}
      <motion.div
        animate={{ x: mousePosition.x, y: mousePosition.y }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        style={{
          position: 'absolute', top: '10%', right: '10%',
          fontSize: '10rem', color: '#fff', opacity: 0.05, pointerEvents: 'none',
        }}
      >
        ⸸
      </motion.div>

      {/* Close / Back button — top right */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        style={{
          position: 'fixed', top: '2rem', right: '2rem',
          background: 'transparent', border: '2px solid #fff',
          color: '#fff', padding: '1rem', cursor: 'pointer',
          fontSize: '1.5rem', zIndex: 10001,
          width: '50px', height: '50px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ✕
      </motion.button>

      {/* Back button — top left */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        style={{
          position: 'fixed', top: '2rem', left: '2rem',
          background: 'transparent', border: '1px solid #555',
          color: '#888', padding: '0.6rem 1.2rem',
          cursor: 'pointer', fontSize: '0.75rem',
          letterSpacing: '0.15em', fontFamily: 'Courier New, monospace',
          zIndex: 10001,
        }}
      >
        ← BACK
      </motion.button>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          overflowY: 'auto', overflowX: 'hidden',
          scrollBehavior: 'smooth',
        }}
      >
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <motion.section style={{ opacity: opacity1 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px', textAlign: 'center' }}>
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  fontFamily: 'Bungee, monospace',
                  letterSpacing: '0.1em',
                  marginBottom: '2rem',
                  color: '#fff',
                  textShadow: '0 0 30px rgba(255,255,255,0.3)',
                }}
              >
                THE SCHISM
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ fontSize: '1.1rem', color: '#666', letterSpacing: '0.15em', lineHeight: '2' }}
              >
                Two signals. One is correct. One is not.<br />
                The ledger will decide which you chose.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 1: THE DIVISION ───────────────────────────────────── */}
        <motion.section style={{ opacity: opacity2 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={h2Style}>THE DIVISION</h2>
              <p style={pStyle}>
                Before markets. Before coins. Before the chain, there was a split.
                Two sides. Always in opposition. Always will be.
              </p>
              <p style={pStyle}>
                In the space between them, something is decided each cycle.
                You will choose your alignment. The mechanism does the rest.
              </p>
              <p style={{ ...pStyle, color: '#666', fontStyle: 'italic' }}>
                This is not a game. It is a ritual with real outcomes.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 2: THE CYCLE ──────────────────────────────────────── */}
        <motion.section style={{ opacity: opacity3 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={h2Style}>THE CYCLE</h2>
              <h3 style={h3Style}>The Reading</h3>
              <p style={pStyle}>
                At the designated moment, the watcher takes a reading.
                What was before is measured against what is now.
                The cycle ends. The signal resolves.
              </p>
              <h3 style={h3Style}>The Judgement</h3>
              <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', paddingLeft: '2rem' }}>
                <li style={liStyle}>The signal moves one way → those who aligned with it are righteous.</li>
                <li style={liStyle}>The signal moves the other way → the other side was righteous.</li>
                <li style={liStyle}>The signal does not move → the cycle is voided. All stakes are returned.</li>
              </ul>
              <p style={{ ...pStyle, marginTop: '2rem', color: '#555', fontStyle: 'italic' }}>
                The ledger does not negotiate. It does not sympathise. It records.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 3: THE COVENANT ───────────────────────────────────── */}
        <motion.section style={{ opacity: opacity4 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={h2Style}>THE COVENANT</h2>
              <h3 style={h3Style}>Entry</h3>
              <p style={pStyle}>
                Entry is an act of commitment, not prediction.
                The committed pool is sealed. It waits.
                No intermediary holds it. The contract is the custodian.
              </p>
              <h3 style={h3Style}>Distribution</h3>
              <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', paddingLeft: '2rem', marginBottom: '2rem' }}>
                <li style={liStyle}><strong style={{ color: '#fff' }}>95 parts</strong> flow to those who aligned with the signal.</li>
                <li style={liStyle}><strong style={{ color: '#fff' }}>5 parts</strong> sustain the mechanism and those who built it.</li>
              </ul>
              <h3 style={h3Style}>Calculation</h3>
              <p style={pStyle}>
                The righteous share the pool in equal proportion to their numbers.
                More who align with the wrong signal means more rewarded to those who aligned with the right one.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 4: THE WATCHER ────────────────────────────────────── */}
        <motion.section style={{ opacity: opacity5 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={h2Style}>THE WATCHER</h2>
              <p style={pStyle}>
                An unsleeping witness has been appointed.
                It does not interpret. It does not speculate.
                At the designated moment, it speaks once.
                That reading is the truth for that cycle.
              </p>
              <h3 style={h3Style}>Verification</h3>
              <p style={pStyle}>
                The witness is external. The witness is open.
                It has been this way since before you arrived.
                Those who distrust the reading may verify it themselves.
                The chain has a record of everything the watcher has ever said.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── SECTION 5: THE RECORD + THE WARNING ──────────────────────── */}
        <motion.section style={{ opacity: opacity6 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={h2Style}>THE RECORD</h2>
              <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', paddingLeft: '2rem', marginBottom: '4rem' }}>
                <li style={liStyle}>All instructions are open. All outcomes are written.</li>
                <li style={liStyle}>The cycle results are derivable from public data alone.</li>
                <li style={liStyle}>The arithmetic is auditable by anyone who chooses to look.</li>
                <li style={liStyle}>Nothing is obscured from those who look hard enough.</li>
              </ul>

              <h2 style={h2Style}>THE WARNING</h2>
              <p style={pStyle}>
                Do not mistake the ritual for safety.
                The signal resolves in one direction.
                If you chose the other, your stake does not return.
              </p>
              <p style={{ ...pStyle, color: '#555', fontStyle: 'italic' }}>
                Align only what you are willing to surrender.
                The mechanism was not designed with mercy in mind.
                Both sides have been consumed before.
              </p>

              <div style={{ marginTop: '4rem', textAlign: 'center', color: '#444', fontSize: '0.85rem', paddingBottom: '2rem', letterSpacing: '0.1em' }}>
                <p>Correspondence: [email protected]</p>
                <p style={{ marginTop: '0.8rem' }}>Contract: [inscription pending]</p>
              </div>

              {/* Back to Faith button at bottom */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2rem', marginTop: '2rem' }}>
                <motion.button
                  whileHover={{ scale: 1.05, borderColor: '#fff', color: '#fff' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: '1px solid #444',
                    color: '#666',
                    padding: '0.8rem 2.5rem',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    letterSpacing: '0.2em',
                    fontFamily: 'Courier New, monospace',
                    transition: 'all 0.2s',
                  }}
                >
                  ← RETURN
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Social */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.a
            href="https://x.com/doubtnbelief"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'block', width: '100px', height: '100px', cursor: 'pointer' }}
          >
            <img
              src="/x-logo.png"
              alt="Twitter/X"
              style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
            />
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default Whitepaper
