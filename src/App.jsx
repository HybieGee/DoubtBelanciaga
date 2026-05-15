import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import MainExperience from './components/MainExperience'
import AudioToggle from './components/UI/AudioToggle'
import PortraitBlock from './components/UI/PortraitBlock'
import { useGameStore } from './store/gameStore'
import { initFingerprint } from './utils/fingerprint'

function App() {
  const [loading, setLoading] = useState(true)
  const setFingerprint = useGameStore((state) => state.setFingerprint)

  useEffect(() => {
    // Version marker to confirm deployment
    console.log('%c🚀 DOUBT & BELIEF v2.1 - Build: 2026-01-25-21:15', 'background: #000; color: #0f0; font-size: 14px; padding: 5px;')

    // Initialize fingerprint on load
    initFingerprint().then((fp) => {
      setFingerprint(fp)
      setTimeout(() => setLoading(false), 3000) // Minimum 3s loading for dramatic effect
    })
  }, [setFingerprint])

  return (
    <>
      <PortraitBlock />
      <AudioToggle />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" />
        ) : (
          <MainExperience key="experience" />
        )}
      </AnimatePresence>
    </>
  )
}

export default App
