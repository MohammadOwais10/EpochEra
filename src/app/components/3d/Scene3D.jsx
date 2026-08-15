"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"
import CryptoSphere from "./CryptoSphere"
import BlockchainNetwork from "./BlockchainNetwork"
import FloatingCoins from "./FloatingCoins"

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#3b82f6" wireframe />
    </mesh>
  )
}

function Scene3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          try {
            gl.setClearColor(0x000000, 0)
          } catch (error) {
            console.warn('WebGL context failed:', error)
          }
        }}
        fallback={<div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Lighting */}
          <Environment preset="night" />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#1e40af" />
          <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={1} color="#60a5fa" castShadow />

          {/* 3D Models */}
          <CryptoSphere position={[0, 0, 0]} />
          <BlockchainNetwork />

          {/* Floating Coins */}
          <FloatingCoins position={[-6, 2, -4]} scale={0.6} text="EpochEra" />
          <FloatingCoins position={[6, -1, -2]} scale={0.4} text="BTC" />
          <FloatingCoins position={[0, 4, -6]} scale={0.5} text="TON" />
          <FloatingCoins position={[-4, -3, 1]} scale={0.3} text="USDT" />

          {/* Controls */}
          <OrbitControls
            eNableZoom={false}
            eNablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Scene3D
