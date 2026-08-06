"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"

function FloatingCoins({ position, scale = 1, text = "EpochEra" }) {
  const coinRef = useRef()

  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.02
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} scale={scale}>
        <mesh ref={coinRef}>
          <cylinderGeometry args={[1, 1, 0.2, 16]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
            emissive="#1e40af"
            emissiveIntensity={0.1}
          />

          {/* Coin edge */}
          <mesh>
            <cylinderGeometry args={[1.05, 1.05, 0.15, 16]} />
            <meshStandardMaterial color="#1e40af" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Coin text using Text component */}
          <Text
            position={[0, 0.11, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {text}
          </Text>
        </mesh>
      </group>
    </Float>
  )
}

export default FloatingCoins