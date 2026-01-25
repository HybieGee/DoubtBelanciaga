import { useGameStore } from '../../store/gameStore'
import ChoicePrompt from './ChoicePrompt'
import GameStats from './GameStats'
import Timer from './Timer'
import WalletButton from './WalletButton'
import Results from './Results'
import Whitepaper from './Whitepaper'
import { useState } from 'react'

const UI = () => {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const [showWhitepaper, setShowWhitepaper] = useState(false)

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              letterSpacing: '0.2em',
            }}
          >
            <span style={{ color: '#fff' }}>DOUBT</span>
            <span style={{ color: '#666' }}> & </span>
            <span style={{ color: '#fff' }}>BELIEF</span>
          </h1>
          <button
            onClick={() => setShowWhitepaper(true)}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #fff',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#fff'
              e.target.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.color = '#fff'
            }}
          >
            WHITEPAPER
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Timer />
          <WalletButton />
        </div>
      </div>

      {/* Main UI based on game phase */}
      {gamePhase === 'choosing' && <ChoicePrompt />}
      {(gamePhase === 'waiting' || gamePhase === 'walking') && <GameStats />}
      {gamePhase === 'results' && <Results />}

      {/* Whitepaper modal */}
      {showWhitepaper && <Whitepaper onClose={() => setShowWhitepaper(false)} />}

      {/* Split screen indicator lines */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(180deg, #fff 0%, transparent 50%, #fff 100%)',
          pointerEvents: 'none',
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      {/* Version indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '4px 8px',
          background: 'rgba(0, 255, 0, 0.1)',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          color: '#0f0',
          fontSize: '10px',
          fontFamily: 'monospace',
          zIndex: 9999,
          opacity: 0.7,
        }}
      >
        v2.7
      </div>
    </>
  )
}

export default UI
