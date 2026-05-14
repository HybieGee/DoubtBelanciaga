import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { connectWallet } from '../../utils/wallet'

const WalletButton = () => {
  const walletAddress = useGameStore((state) => state.walletAddress)
  const setWalletAddress = useGameStore((state) => state.setWalletAddress)
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    setConnecting(true)
    try {
      const address = await connectWallet()
      setWalletAddress(address)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert('Failed to connect wallet. Please make sure MetaMask is installed.')
    } finally {
      setConnecting(false)
    }
  }

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      disabled={connecting || walletAddress}
      style={{
        padding: '0.75rem 1.5rem',
        background: walletAddress ? 'transparent' : '#fff',
        color: walletAddress ? '#fff' : '#000',
        border: walletAddress ? '1px solid #fff' : 'none',
        cursor: connecting || walletAddress ? 'default' : 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        opacity: connecting ? 0.5 : 1,
      }}
    >
      {connecting
        ? 'CONNECTING...'
        : walletAddress
        ? formatAddress(walletAddress)
        : 'CONNECT WALLET'}
    </motion.button>
  )
}

export default WalletButton
