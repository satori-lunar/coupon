'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { DateNight, getRandomPrompt } from '@/data/dateNights'

interface DateNightCardProps {
  dateNight: DateNight
  onReveal: () => void
}

export default function DateNightCard({ dateNight, onReveal }: DateNightCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchProgress, setScratchProgress] = useState(0)
  const [shakeCount, setShakeCount] = useState(0)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-50, 50], [-15, 15])

  // Shake detection
  useEffect(() => {
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (isRevealed) return
      
      const acceleration = e.accelerationIncludingGravity
      if (acceleration) {
        const totalAcceleration = Math.sqrt(
          Math.pow(acceleration.x || 0, 2) +
          Math.pow(acceleration.y || 0, 2) +
          Math.pow(acceleration.z || 0, 2)
        )
        
        if (totalAcceleration > 15) {
          setShakeCount(prev => prev + 1)
          if (shakeCount >= 2) {
            reveal()
          }
        }
      }
    }

    if (typeof DeviceMotionEvent !== 'undefined') {
      const DeviceMotionEventWithPermission = DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<PermissionState>
      }
      
      if (DeviceMotionEventWithPermission.requestPermission) {
        DeviceMotionEventWithPermission.requestPermission().then(permission => {
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handleDeviceMotion)
          }
        })
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion)
      }
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion)
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion)
    }
  }, [isRevealed, shakeCount])

  const reveal = () => {
    if (isRevealed) return
    setIsRevealed(true)
    // Select a random prompt
    if (dateNight.prompts && dateNight.prompts.length > 0) {
      const randomPrompt = getRandomPrompt(dateNight)
      setSelectedPrompt(randomPrompt)
    }
    onReveal()
  }

  const handleShake = () => {
    if (isRevealed) return
    
    animate(x, [0, -20, 20, -20, 20, 0], {
      duration: 0.5,
      onComplete: () => {
        setShakeCount(prev => {
          const newCount = prev + 1
          if (newCount >= 3) {
            reveal()
          }
          return newCount
        })
      }
    })
  }

  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return
    
    setIsScratching(true)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const x = clientX - rect.left
    const y = clientY - rect.top
    
    // Create scratch effect with canvas-like reveal
    const scratchArea = document.getElementById('scratch-area')
    if (scratchArea) {
      const scratch = document.createElement('div')
      scratch.style.position = 'absolute'
      scratch.style.left = `${x - 20}px`
      scratch.style.top = `${y - 20}px`
      scratch.style.width = '40px'
      scratch.style.height = '40px'
      scratch.style.borderRadius = '50%'
      scratch.style.background = 'transparent'
      scratch.style.pointerEvents = 'none'
      scratch.style.mixBlendMode = 'destination-out'
      scratchArea.appendChild(scratch)
      
      setTimeout(() => scratch.remove(), 500)
    }
    
    setScratchProgress(prev => {
      const newProgress = Math.min(prev + 3, 100)
      if (newProgress >= 80) {
        reveal()
      }
      return newProgress
    })
  }

  const handleScratchEnd = () => {
    setIsScratching(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className="relative bg-gradient-to-br from-cream via-cream/95 to-cream rounded-2xl shadow-2xl overflow-hidden cursor-pointer border border-rose/20"
        style={{ rotate }}
        drag="x"
        dragConstraints={{ left: -50, right: 50 }}
        dragElastic={0.2}
        whileHover={{ scale: 1.02 }}
        onDragEnd={() => {
          x.set(0)
          if (!isRevealed) {
            handleShake()
          }
        }}
        onClick={handleShake}
      >
        {/* Scratch-off overlay */}
        {!isRevealed && (
          <div
            id="scratch-area"
            className="absolute inset-0 bg-gradient-to-br from-rose/95 via-blush/95 to-warm-gray/95 z-10 cursor-grab active:cursor-grabbing select-none backdrop-blur-sm"
            onMouseMove={isScratching ? handleScratch : undefined}
            onMouseDown={(e) => {
              setIsScratching(true)
              handleScratch(e)
            }}
            onMouseUp={handleScratchEnd}
            onMouseLeave={handleScratchEnd}
            onTouchMove={isScratching ? handleScratch : undefined}
            onTouchStart={(e) => {
              setIsScratching(true)
              handleScratch(e)
            }}
            onTouchEnd={handleScratchEnd}
          >
            <div 
              className="h-full flex items-center justify-center relative transition-opacity duration-300"
              style={{ opacity: 1 - (scratchProgress / 100) }}
            >
              <div className="text-center p-8 relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <p className="text-2xl md:text-3xl text-cream font-handwritten mb-2" style={{ fontFamily: 'var(--font-handwritten)' }}>
                  Shake or Scratch
                </p>
                <p className="text-lg text-cream/80">
                  to reveal your date night
                </p>
                {scratchProgress > 0 && scratchProgress < 80 && (
                  <p className="text-sm text-cream/60 mt-2">
                    Keep going...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Revealed content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.8 }}
          transition={{ duration: 0.5 }}
          className="p-10 space-y-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: isRevealed ? 1 : 0, rotate: isRevealed ? 0 : -180 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-6"
            >
              💕
            </motion.div>
            <h3 className="font-serif text-3xl md:text-4xl text-rose mb-6 drop-shadow-sm" style={{ fontFamily: 'var(--font-serif)' }}>
              {dateNight.title}
            </h3>
            <p className="text-xl md:text-2xl text-warm-gray leading-relaxed mb-8 px-2" style={{ fontFamily: 'var(--font-body)' }}>
              {dateNight.description}
            </p>
            
            {/* Random Prompt/Idea */}
            {selectedPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 p-6 bg-gradient-to-br from-rose/15 to-blush/10 rounded-xl border border-rose/30 shadow-md"
              >
                <p className="text-lg md:text-xl text-rose font-semibold mb-2" style={{ fontFamily: 'var(--font-handwritten)' }}>
                  💡 Your Adventure Idea:
                </p>
                <p className="text-lg md:text-xl text-warm-gray leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  {selectedPrompt}
                </p>
                {dateNight.prompts && dateNight.prompts.length > 1 && (
                  <button
                    onClick={() => {
                      const newPrompt = dateNight.prompts[Math.floor(Math.random() * dateNight.prompts.length)]
                      setSelectedPrompt(newPrompt)
                    }}
                    className="text-rose hover:text-rose/80 text-sm underline font-handwritten"
                    style={{ fontFamily: 'var(--font-handwritten)' }}
                  >
                    Get another idea →
                  </button>
                )}
              </motion.div>
            )}
            
            {/* Show all prompts button */}
            {dateNight.prompts && dateNight.prompts.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isRevealed ? 1 : 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  const randomPrompt = dateNight.prompts[Math.floor(Math.random() * dateNight.prompts.length)]
                  setSelectedPrompt(randomPrompt)
                }}
                className="mt-4 px-6 py-3 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-lg"
                style={{ fontFamily: 'var(--font-handwritten)' }}
              >
                {selectedPrompt ? 'Get Another Idea' : 'Get Adventure Ideas'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {!isRevealed && (
        <div className="mt-4 text-center text-warm-gray text-sm">
          <p>Shake your device or drag the card to reveal</p>
        </div>
      )}
    </div>
  )
}

