import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import DoubtSide from './DoubtSide'
import BelieveSide from './BelieveSide'

const SplitEnvironment = () => {
  return (
    <group>
      {/* Split Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Dividing line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 20]} />
        <meshBasicMaterial color="#fff" />
      </mesh>

      {/* DOUBT environment (left side) */}
      <DoubtSide />

      {/* BELIEVE environment (right side) */}
      <BelieveSide />
    </group>
  )
}

export default SplitEnvironment
