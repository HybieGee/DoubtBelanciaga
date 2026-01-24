import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import MainExperience from './components/MainExperience'
import { useGameStore } from './store/gameStore'
import { initFingerprint } from './utils/fingerprint'

function App() {
  const [loading, setLoading] = useState(true)
  const setFingerprint = useGameStore((state) => state.setFingerprint)

  useEffect(() => {
    // Initialize fingerprint on load
    initFingerprint().then((fp) => {
      setFingerprint(fp)
      setTimeout(() => setLoading(false), 3000) // Minimum 3s loading for dramatic effect
    })
  }, [setFingerprint])

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" />
      ) : (
        <MainExperience key="experience" />
      )}
    </AnimatePresence>
  )
}

export default App
