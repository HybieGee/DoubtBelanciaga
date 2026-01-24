import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Line } from '@react-three/drei'

const DoubtSide = () => {
  const groupRef = useRef()

  // Subtle animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[-5, 0, -3]}>
      {/* Background wall - BLACK */}
      <mesh position={[0, 5, -5]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#000" side={THREE.DoubleSide} />
      </mesh>

      {/* Horns/Spikes outline */}
      <Line
        points={[
          [-2, 0, 0],
          [-1.5, 3, 0],
          [-1, 0, 0],
        ]}
        color="#fff"
        lineWidth={2}
      />
      <Line
        points={[
          [1, 0, 0],
          [1.5, 3, 0],
          [2, 0, 0],
        ]}
        color="#fff"
        lineWidth={2}
      />

      {/* Devil horns sketch */}
      <group position={[0, 4, 0]}>
        {/* Left horn */}
        <mesh position={[-0.8, 0.5, 0]}>
          <coneGeometry args={[0.2, 1.5, 8]} />
          <meshBasicMaterial color="#000" />
        </mesh>
        <mesh position={[-0.8, 0.5, 0]}>
          <coneGeometry args={[0.21, 1.51, 8]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>

        {/* Right horn */}
        <mesh position={[0.8, 0.5, 0]}>
          <coneGeometry args={[0.2, 1.5, 8]} />
          <meshBasicMaterial color="#000" />
        </mesh>
        <mesh position={[0.8, 0.5, 0]}>
          <coneGeometry args={[0.21, 1.51, 8]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>
      </group>

      {/* 666 symbol */}
      <group position={[0, 2, 0.5]}>
        {/* This would be better with a text geometry, but simplified for now */}
        <Line
          points={[
            [-1.5, 0, 0],
            [-1, 0.5, 0],
            [-1.5, 1, 0],
          ]}
          color="#fff"
          lineWidth={3}
        />
        <Line
          points={[
            [-0.5, 0, 0],
            [0, 0.5, 0],
            [-0.5, 1, 0],
          ]}
          color="#fff"
          lineWidth={3}
        />
        <Line
          points={[
            [0.5, 0, 0],
            [1, 0.5, 0],
            [0.5, 1, 0],
          ]}
          color="#fff"
          lineWidth={3}
        />
      </group>

      {/* Cracks and chains - sketch style */}
      <Line
        points={[
          [-2, 0, 1],
          [-1.8, 0.5, 1],
          [-2.2, 1, 1],
          [-1.9, 1.5, 1],
        ]}
        color="#fff"
        lineWidth={1}
      />
    </group>
  )
}

export default DoubtSide
