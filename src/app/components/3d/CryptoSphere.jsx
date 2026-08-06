"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"

function CryptoSphere({ position = [0, 0, 0] }) {
  const sphereRef = useRef()

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.01
      sphereRef.current.rotation.y += 0.01
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={sphereRef} position={position}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.9}
          roughness={0.1}
          emissive="#1e40af"
          emissiveIntensity={0.1}
          wireframe
        />
      </mesh>
    </Float>
  )
}

export default CryptoSphere