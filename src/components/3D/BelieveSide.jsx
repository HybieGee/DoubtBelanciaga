import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Line } from '@react-three/drei'

const BelieveSide = () => {
  const groupRef = useRef()
  const haloRef = useRef()

  // Subtle animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[5, 0, -3]}>
      {/* Background wall - WHITE */}
      <mesh position={[0, 5, -5]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#fff" side={THREE.DoubleSide} />
      </mesh>

      {/* Angel wings outline */}
      <group position={[0, 3, 0]}>
        {/* Left wing */}
        <Line
          points={[
            [-0.5, 0, 0],
            [-1.5, 0.5, 0],
            [-2.5, 0.3, 0],
            [-2, -0.5, 0],
            [-0.5, -0.3, 0],
          ]}
          color="#000"
          lineWidth={2}
        />
        <Line
          points={[
            [-1, 0.2, 0],
            [-1.8, 0.4, 0],
          ]}
          color="#000"
          lineWidth={1}
        />

        {/* Right wing */}
        <Line
          points={[
            [0.5, 0, 0],
            [1.5, 0.5, 0],
            [2.5, 0.3, 0],
            [2, -0.5, 0],
            [0.5, -0.3, 0],
          ]}
          color="#000"
          lineWidth={2}
        />
        <Line
          points={[
            [1, 0.2, 0],
            [1.8, 0.4, 0],
          ]}
          color="#000"
          lineWidth={1}
        />
      </group>

      {/* Halo */}
      <group ref={haloRef} position={[0, 5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.05, 8, 32]} />
          <meshBasicMaterial color="#fff" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.81, 0.06, 8, 32]} />
          <meshBasicMaterial color="#000" wireframe />
        </mesh>
      </group>

      {/* Light rays */}
      <Line
        points={[
          [0, 6, 0],
          [0, 8, 0],
        ]}
        color="#000"
        lineWidth={3}
      />
      <Line
        points={[
          [-0.5, 6, 0],
          [-1, 8, 0],
        ]}
        color="#000"
        lineWidth={2}
      />
      <Line
        points={[
          [0.5, 6, 0],
          [1, 8, 0],
        ]}
        color="#000"
        lineWidth={2}
      />

      {/* Cross symbol */}
      <group position={[0, 2, 0.5]}>
        <Line
          points={[
            [0, -0.5, 0],
            [0, 1.5, 0],
          ]}
          color="#000"
          lineWidth={3}
        />
        <Line
          points={[
            [-0.5, 0.5, 0],
            [0.5, 0.5, 0],
          ]}
          color="#000"
          lineWidth={3}
        />
      </group>
    </group>
  )
}

export default BelieveSide
