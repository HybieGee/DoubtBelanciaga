import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/gameStore'

const Character = () => {
  const meshRef = useRef()
  const groupRef = useRef()
  const gamePhase = useGameStore((state) => state.gamePhase)
  const userChoice = useGameStore((state) => state.userChoice)

  // Idle animation
  useFrame(({ clock }) => {
    if (meshRef.current && gamePhase === 'choosing') {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.05
    }
  })

  // Walking animation
  useEffect(() => {
    if (gamePhase === 'walking' && userChoice && groupRef.current) {
      const targetX = userChoice === 'doubt' ? -5 : 5
      const startX = 0
      const duration = 3000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)

        groupRef.current.position.x = startX + (targetX - startX) * eased

        // Rotate to face direction
        groupRef.current.rotation.y = userChoice === 'doubt' ? Math.PI / 4 : -Math.PI / 4

        // Bob up and down while walking
        groupRef.current.position.y = Math.sin(progress * Math.PI * 8) * 0.1

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [gamePhase, userChoice])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Simple character representation - sketch style */}
      <group ref={meshRef}>
        {/* Head - wireframe sphere */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>

        {/* Body - wireframe cylinder */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.8, 8]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.35, 1.2, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>
        <mesh position={[0.35, 1.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 6]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.15, 0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.8, 6]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>
        <mesh position={[0.15, 0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.8, 6]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>
      </group>
    </group>
  )
}

export default Character
