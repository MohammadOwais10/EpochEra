"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"

function BlockchainNetwork() {
  const groupRef = useRef()

  // Generate network nodes with proper validation
  const nodes = useMemo(() => {
    const temp = []
    const nodeCount = 8 // Reduced for better performance

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const radius = 6
      const height = (Math.random() - 0.5) * 3

      temp.push({
        position: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
        id: i,
      })
    }

    return temp
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
  })

  return (
    <group ref={groupRef}>
      {/* Render nodes */}
      {nodes.map((node, i) => (
        <Float key={node.id} speed={1 + i * 0.1} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh position={node.position}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#3b82f6" : i % 3 === 1 ? "#1e40af" : "#60a5fa"}
              emissive="#1e40af"
              emissiveIntensity={0.2}
              metalness={0.8}
              roughness={0.2}
            />

            {/* Node glow effect */}
            <mesh scale={1.2}>
              <boxGeometry args={[0.6, 0.6, 0.6]} />
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
            </mesh>
          </mesh>
        </Float>
      ))}

      {/* Simple connecting lines using basic geometry */}
      {nodes.map((node, i) => {
        const nextIndex = (i + 1) % nodes.length
        const nextNode = nodes[nextIndex]

        const midPoint = [
          (node.position[0] + nextNode.position[0]) / 2,
          (node.position[1] + nextNode.position[1]) / 2,
          (node.position[2] + nextNode.position[2]) / 2,
        ]

        const distance = Math.sqrt(
          Math.pow(nextNode.position[0] - node.position[0], 2) +
            Math.pow(nextNode.position[1] - node.position[1], 2) +
            Math.pow(nextNode.position[2] - node.position[2], 2),
        )

        return (
          <mesh key={`connection-${i}`} position={midPoint}>
            <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export default BlockchainNetwork
