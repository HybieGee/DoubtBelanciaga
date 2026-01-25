import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const Whitepaper = ({ onClose }) => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.18, 0.25], [1, 1, 1, 0])
  const opacity2 = useTransform(scrollYProgress, [0.12, 0.2, 0.35, 0.42], [0, 1, 1, 0])
  const opacity3 = useTransform(scrollYProgress, [0.3, 0.38, 0.52, 0.59], [0, 1, 1, 0])
  const opacity4 = useTransform(scrollYProgress, [0.47, 0.55, 0.68, 0.75], [0, 1, 1, 0])
  const opacity5 = useTransform(scrollYProgress, [0.63, 0.71, 0.83, 0.90], [0, 1, 1, 0])
  const opacity6 = useTransform(scrollYProgress, [0.78, 0.86, 0.95, 1], [0, 1, 1, 0])

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* Animated floating symbols background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', opacity: 0.08 }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
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

      {/* Mouse-following parallax layer */}
      <motion.div
        animate={{ x: mousePosition.x, y: mousePosition.y }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          fontSize: '10rem',
          color: '#fff',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        ⸸
      </motion.div>

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'transparent',
          border: '2px solid #fff',
          color: '#fff',
          padding: '1rem',
          cursor: 'pointer',
          fontSize: '1.5rem',
          zIndex: 10001,
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </motion.button>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Hero Section */}
        <motion.section
          style={{ opacity: opacity1 }}
          className="whitepaper-section"
        >
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
                WHITEPAPER
              </motion.h1>
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontSize: '1.1rem',
                  color: '#999',
                  letterSpacing: '0.15em',
                  lineHeight: '2',
                  fontWeight: 'normal',
                }}
              >
                The manifesto of conviction. Where doubt meets belief in the ultimate test of faith.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Section 1: Concept */}
        <motion.section style={{ opacity: opacity2 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '2rem', color: '#fff', letterSpacing: '0.15em', fontFamily: 'Bungee, monospace' }}>
                CONCEPT
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', marginBottom: '2rem' }}>
                DOUBT & BELIEF is an interactive PvP experience that transforms crypto market
                volatility into a social game. Players choose between two philosophies:
                <strong style={{ color: '#fff' }}> DOUBT</strong> (betting on price decline) or <strong style={{ color: '#fff' }}>BELIEF</strong> (betting
                on price growth). Every hour, the market decides the winner.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa' }}>
                This is not gambling—it's a philosophical experiment. Your choice reflects your market conviction,
                and your rewards reflect the accuracy of that conviction.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Game Mechanics */}
        <motion.section style={{ opacity: opacity3 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '2rem', color: '#fff', letterSpacing: '0.15em', fontFamily: 'Bungee, monospace' }}>
                GAME MECHANICS
              </h2>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', letterSpacing: '0.1em' }}>Hourly Rounds</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', marginBottom: '2rem' }}>
                Each round lasts exactly one hour. Players must make their choice before the round
                ends. Once the hour concludes, the price is compared to the previous hour's closing price.
              </p>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', letterSpacing: '0.1em' }}>Outcome Logic</h3>
              <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', paddingLeft: '2rem' }}>
                <li>If the price increases → <strong style={{ color: '#fff' }}>BELIEVERS win</strong></li>
                <li>If the price decreases → <strong style={{ color: '#fff' }}>DOUBTERS win</strong></li>
                <li>If the price is unchanged → Round is void, fees returned</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Section 3: Economic Model */}
        <motion.section style={{ opacity: opacity4 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '2rem', color: '#fff', letterSpacing: '0.15em', fontFamily: 'Bungee, monospace' }}>
                ECONOMIC MODEL
              </h2>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', letterSpacing: '0.1em' }}>Entry Fee</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', marginBottom: '2rem' }}>
                All participants pay a fixed gas fee to enter each round. This fee is denominated in
                ETH and contributes to the prize pool.
              </p>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', letterSpacing: '0.1em' }}>Distribution</h3>
              <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', paddingLeft: '2rem', marginBottom: '2rem' }}>
                <li><strong style={{ color: '#fff' }}>95%</strong> of all fees → Distributed to winners</li>
                <li><strong style={{ color: '#fff' }}>5%</strong> of all fees → Marketing and development</li>
              </ul>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', letterSpacing: '0.1em' }}>Payout Calculation</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa' }}>
                Winners share the pool proportionally. If 100 people play DOUBT and 50 play BELIEVE,
                and DOUBT wins, each DOUBTER receives: (Total Pool × 0.95) / 100
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 4: Price Oracle */}
        <motion.section style={{ opacity: opacity5 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '2rem', color: '#fff', letterSpacing: '0.15em', fontFamily: 'Bungee, monospace' }}>
                PRICE ORACLE
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', marginBottom: '2rem' }}>
                We use Chainlink Price Feeds for tamper-proof, decentralized price data. The oracle
                records the closing price at the top of each hour (XX:00:00 UTC).
              </p>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff', letterSpacing: '0.1em' }}>Verification</h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa' }}>
                All price data is publicly verifiable on-chain. Users can independently verify results
                using block explorers and Chainlink's public feeds.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section 5: Transparency & Risk */}
        <motion.section style={{ opacity: opacity6 }}>
          <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '2rem', color: '#fff', letterSpacing: '0.15em', fontFamily: 'Bungee, monospace' }}>
                TRANSPARENCY
              </h2>
              <ul style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', paddingLeft: '2rem', marginBottom: '4rem' }}>
                <li>All smart contracts are open-source and verified on Etherscan</li>
                <li>Round results are provably fair via on-chain data</li>
                <li>Distribution math is publicly auditable</li>
                <li>No hidden fees or manipulation possible</li>
              </ul>

              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '2rem', color: '#fff', letterSpacing: '0.15em', fontFamily: 'Bungee, monospace' }}>
                RISK DISCLOSURE
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#aaa', marginBottom: '4rem' }}>
                This is a game of chance based on market volatility. Players should only participate
                with funds they can afford to lose. Past performance does not guarantee future results.
                The game is designed for entertainment, not as an investment vehicle.
              </p>

              <div style={{ marginTop: '4rem', textAlign: 'center', color: '#666', fontSize: '0.9rem', paddingBottom: '4rem' }}>
                <p>For questions or support, contact us at: [email protected]</p>
                <p style={{ marginTop: '1rem' }}>
                  Smart contract address: [To be deployed]
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Social Links at bottom */}
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.a
            href="https://twitter.com/doubtandbelief"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'block',
              width: '100px',
              height: '100px',
              cursor: 'pointer',
            }}
          >
            <img
              src="/x-logo.png"
              alt="Twitter/X"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
              }}
            />
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default Whitepaper
