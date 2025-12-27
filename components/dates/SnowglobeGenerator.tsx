'use client'

import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useAppStore } from '@/lib/store'
import { generateDateSuggestions } from '@/lib/dateGenerator'
import DateCard from './DateCard'

// Snow particle component
function SnowParticle({ position, onComplete }: { position: [number, number, number], onComplete: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [fallSpeed] = useState(() => Math.random() * 0.02 + 0.01)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y -= fallSpeed

      // Reset particle when it falls below the globe
      if (meshRef.current.position.y < -2) {
        meshRef.current.position.y = 2
        meshRef.current.position.x = (Math.random() - 0.5) * 4
        meshRef.current.position.z = (Math.random() - 0.5) * 4
      }

      // Rotate particle
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  )
}

// Snow particles system
function SnowParticles({ isShaking }: { isShaking: boolean }) {
  const particles = Array.from({ length: isShaking ? 100 : 50 }, (_, i) => (
    <SnowParticle
      key={i}
      position={[
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      ]}
      onComplete={() => {}} // Could be used for particle lifecycle
    />
  ))

  return <>{particles}</>
}

// Main snowglobe scene
function SnowglobeScene({ isShaking }: { isShaking: boolean }) {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 5)
  }, [camera])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Snow globe base */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 32]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Snow globe */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color="#87CEEB"
          transparent
          opacity={0.3}
          transmission={0.9}
          thickness={0.1}
          roughness={0}
          metalness={0}
        />
      </mesh>

      {/* Snow particles */}
      <SnowParticles isShaking={isShaking} />

      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!isShaking}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  )
}

// Shake detector hook
function useShakeDetector(onShake: () => void, threshold: number = 15) {
  const [isShaking, setIsShaking] = useState(false)
  const shakeTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0
    let lastTime = Date.now()

    const handleMotion = (event: DeviceMotionEvent) => {
      const { accelerationIncludingGravity } = event
      if (!accelerationIncludingGravity) return

      const { x, y, z } = accelerationIncludingGravity
      if (x === null || y === null || z === null) return

      const currentTime = Date.now()
      const timeDiff = currentTime - lastTime

      if (timeDiff > 100) { // Sample every 100ms
        const deltaX = Math.abs(x - lastX)
        const deltaY = Math.abs(y - lastY)
        const deltaZ = Math.abs(z - lastZ)

        const totalDelta = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ)

        if (totalDelta > threshold) {
          setIsShaking(true)
          onShake()

          // Clear existing timeout
          if (shakeTimeoutRef.current) {
            clearTimeout(shakeTimeoutRef.current)
          }

          // Reset shaking state after animation
          shakeTimeoutRef.current = setTimeout(() => {
            setIsShaking(false)
          }, 2000)
        }

        lastX = x
        lastY = y
        lastZ = z
        lastTime = currentTime
      }
    }

    // Check if device motion is supported
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion, true)
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion, true)
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current)
      }
    }
  }, [onShake, threshold])

  return isShaking
}

interface SnowglobeGeneratorProps {
  onDateGenerated: (date: any) => void
}

export default function SnowglobeGenerator({ onDateGenerated }: SnowglobeGeneratorProps) {
  const { coupleId, profiles } = useAppStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDate, setGeneratedDate] = useState<any>(null)
  const [showInstructions, setShowInstructions] = useState(true)

  const isShaking = useShakeDetector(() => {
    handleShake()
  })

  const handleShake = async () => {
    if (isGenerating || !coupleId) return

    setIsGenerating(true)
    setShowInstructions(false)

    try {
      // Get profiles for the couple
      const profileIds = Object.keys(profiles)
      if (profileIds.length < 2) return

      const profile1 = profiles[profileIds[0]]
      const profile2 = profiles[profileIds[1]]

      // Generate random tailored date
      const suggestions = await generateDateSuggestions(profile1, profile2)
      const randomDate = suggestions[Math.floor(Math.random() * suggestions.length)]

      // Simulate loading time for dramatic effect
      setTimeout(() => {
        setGeneratedDate(randomDate.date)
        onDateGenerated(randomDate.date)
        setIsGenerating(false)
      }, 2000)

    } catch (error) {
      console.error('Error generating date:', error)
      setIsGenerating(false)
    }
  }

  const handleManualShake = () => {
    handleShake()
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-blue-900 to-blue-700 rounded-2xl overflow-hidden">
      {/* 3D Scene */}
      <Canvas className="absolute inset-0">
        <SnowglobeScene isShaking={isShaking || isGenerating} />
      </Canvas>

      {/* Instructions Overlay */}
      <AnimatePresence>
        {showInstructions && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <div className="text-center text-white p-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🥶
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Shake for a Date!</h3>
              <p className="text-sm opacity-90 mb-4">
                Shake your device or tap the button to generate a personalized date idea
              </p>
              <button
                onClick={handleManualShake}
                className="ios-button-primary"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Shake!'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating Animation */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <div className="text-center text-white">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-4xl mb-4"
              >
                ❄️
              </motion.div>
              <p className="text-lg font-semibold">Finding the perfect date...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date Reveal */}
      <AnimatePresence>
        {generatedDate && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
              <DateCard date={generatedDate} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}