import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import SplitEnvironment from './3D/SplitEnvironment'
import Character from './3D/Character'
import { useGameStore } from '../store/gameStore'
import * as THREE from 'three'

const Scene = () => {
  const controlsRef = useRef()
  const cameraRef = useRef()
  const gamePhase = useGameStore((state) => state.gamePhase)
  const userChoice = useGameStore((state) => state.userChoice)

  // Subtle camera drift for atmosphere
  useFrame(({ clock }) => {
    if (cameraRef.current && gamePhase === 'choosing') {
      const t = clock.getElapsedTime()
      cameraRef.current.position.x = Math.sin(t * 0.1) * 0.3
      cameraRef.current.position.y = 2 + Math.sin(t * 0.15) * 0.2
    }
  })

  // Camera movement based on choice
  useEffect(() => {
    if (gamePhase === 'walking' && userChoice && cameraRef.current) {
      const targetX = userChoice === 'doubt' ? -3 : 3
      const startX = cameraRef.current.position.x
      const duration = 2000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic

        cameraRef.current.position.x = startX + (targetX - startX) * eased

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          useGameStore.getState().setGamePhase('waiting')
        }
      }

      animate()
    }
  }, [gamePhase, userChoice])

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2, 8]}
        fov={50}
      />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[-5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

      {/* Environment */}
      <SplitEnvironment />

      {/* Character */}
      <Character />

      {/* Controls (disabled during gameplay) */}
      {gamePhase === 'choosing' && (
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
        />
      )}
    </>
  )
}

export default Scene
