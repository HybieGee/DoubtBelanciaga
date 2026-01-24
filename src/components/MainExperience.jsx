import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import UI from './UI/UI'
import { useGameStore } from '../store/gameStore'

const MainExperience = () => {
  const gamePhase = useGameStore((state) => state.gamePhase)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>

      {/* UI Overlay */}
      <UI />
    </motion.div>
  )
}

export default MainExperience
