import { motion } from 'framer-motion'

const Whitepaper = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflowY: 'auto',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#000',
          border: '2px solid #fff',
          padding: '3rem',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#fff',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: '2px solid #fff',
            color: '#fff',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ✕ CLOSE
        </button>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', letterSpacing: '0.2em' }}>
          WHITEPAPER
        </h1>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f0' }}>
            1. CONCEPT
          </h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            DOUBT & BELIEF is an interactive PvP experience that transforms crypto market
            volatility into a social game. Players choose between two philosophies:
            <strong> DOUBT</strong> (betting on price decline) or <strong>BELIEF</strong> (betting
            on price growth). Every hour, the market decides the winner.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f0' }}>
            2. GAME MECHANICS
          </h2>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Hourly Rounds
          </h3>
          <p style={{ lineHeight: '1.8', color: '#ccc', marginBottom: '1rem' }}>
            Each round lasts exactly one hour. Players must make their choice before the round
            ends. Once the hour concludes, the price is compared to the previous hour's closing
            price.
          </p>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Outcome Logic
          </h3>
          <ul style={{ lineHeight: '1.8', color: '#ccc', paddingLeft: '2rem' }}>
            <li>If the price increases → <strong>BELIEVERS win</strong></li>
            <li>If the price decreases → <strong>DOUBTERS win</strong></li>
            <li>If the price is unchanged → Round is void, fees returned</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f0' }}>
            3. ECONOMIC MODEL
          </h2>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Entry Fee
          </h3>
          <p style={{ lineHeight: '1.8', color: '#ccc', marginBottom: '1rem' }}>
            All participants pay a fixed gas fee to enter each round. This fee is denominated in
            ETH and contributes to the prize pool.
          </p>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Distribution
          </h3>
          <ul style={{ lineHeight: '1.8', color: '#ccc', paddingLeft: '2rem' }}>
            <li><strong>95%</strong> of all fees → Distributed to winners</li>
            <li><strong>5%</strong> of all fees → Marketing and development</li>
          </ul>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', marginTop: '1rem', color: '#fff' }}>
            Payout Calculation
          </h3>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            Winners share the pool proportionally. If 100 people play DOUBT and 50 play BELIEVE,
            and DOUBT wins, each DOUBTER receives: (Total Pool × 0.95) / 100
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f0' }}>
            4. PRICE ORACLE
          </h2>
          <p style={{ lineHeight: '1.8', color: '#ccc', marginBottom: '1rem' }}>
            We use Chainlink Price Feeds for tamper-proof, decentralized price data. The oracle
            records the closing price at the top of each hour (XX:00:00 UTC).
          </p>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Verification
          </h3>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            All price data is publicly verifiable on-chain. Users can independently verify results
            using block explorers and Chainlink's public feeds.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f0' }}>
            5. ANTI-ABUSE MEASURES
          </h2>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Fingerprinting
          </h3>
          <p style={{ lineHeight: '1.8', color: '#ccc', marginBottom: '1rem' }}>
            Users are identified via browser fingerprinting (IP + device signature). This prevents
            multi-accounting without requiring registration.
          </p>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            Wallet Verification
          </h3>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            Rewards can only be claimed once per wallet per round. Claiming requires wallet
            connection and transaction signature, preventing abuse while maintaining privacy.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f0' }}>
            6. TRANSPARENCY
          </h2>
          <ul style={{ lineHeight: '1.8', color: '#ccc', paddingLeft: '2rem' }}>
            <li>All smart contracts are open-source and verified on Etherscan</li>
            <li>Round results are provably fair via on-chain data</li>
            <li>Distribution math is publicly auditable</li>
            <li>No hidden fees or manipulation possible</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f0' }}>
            7. RISK DISCLOSURE
          </h2>
          <p style={{ lineHeight: '1.8', color: '#ccc' }}>
            This is a game of chance based on market volatility. Players should only participate
            with funds they can afford to lose. Past performance does not guarantee future results.
            The game is designed for entertainment, not as an investment vehicle.
          </p>
        </section>

        <div style={{ marginTop: '3rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
          <p>For questions or support, contact us at: [email protected]</p>
          <p style={{ marginTop: '1rem' }}>
            Smart contract address: [To be deployed]
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Whitepaper
