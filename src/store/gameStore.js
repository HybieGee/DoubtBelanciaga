import { create } from 'zustand'

// Restore wallet + side from previous session
const _savedWallet = localStorage.getItem('last_wallet')
const _savedSide   = _savedWallet ? localStorage.getItem(`joined_${_savedWallet}`) : null

export const useGameStore = create((set, get) => ({
  // User identification
  fingerprint: null,
  walletAddress: _savedWallet || null,

  // Game state
  gamePhase: 'choosing', // 'choosing', 'walking', 'waiting', 'results'
  userChoice: null, // 'doubt' or 'believe'

  // Round data
  currentRound: null,
  roundStartTime: null,
  roundEndTime: null,

  // Price data
  currentPrice: null,
  previousPrice: null,
  priceChange: null,

  // Stats
  doubtCount: 0,
  believeCount: 0,
  totalPool: 0,

  // Token readiness — false until TOKEN_MINT is a real address
  tokenReady: false,

  // Join state (wallet-keyed, persisted in localStorage)
  joinedSide: _savedSide || null,
  showClash: false,

  // Actions
  setTokenReady: (v) => set({ tokenReady: v }),
  setFingerprint: (fp) => set({ fingerprint: fp }),

  setWalletAddress: (address) => {
    const existing = localStorage.getItem(`joined_${address}`)
    localStorage.setItem('last_wallet', address)
    set({ walletAddress: address, joinedSide: existing || null })
  },

  makeChoice: (choice) => set({
    userChoice: choice,
    gamePhase: 'walking'
  }),

  setGamePhase: (phase) => set({ gamePhase: phase }),

  setJoinedSide: (side) => {
    const { walletAddress } = get()
    if (walletAddress) localStorage.setItem(`joined_${walletAddress}`, side)
    set({ joinedSide: side })
  },

  setShowClash: (v) => set({ showClash: v }),

  updateRoundData: (data) => set({
    currentRound: data.round,
    roundStartTime: data.startTime,
    roundEndTime: data.endTime,
    doubtCount: data.doubtCount,
    believeCount: data.believeCount,
    totalPool: data.totalPool,
  }),

  updatePriceData: (data) => set({
    currentPrice: data.current,
    previousPrice: data.previous,
    priceChange: data.change,
  }),

  reset: () => set({
    gamePhase: 'choosing',
    userChoice: null,
  }),
}))
