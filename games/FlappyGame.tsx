'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface FlappyGameProps {
  onScore: (score: number) => void
  onClose: () => void
}

export default function FlappyGame({ onScore, onClose }: FlappyGameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [birdY, setBirdY] = useState(250)
  const [pipes, setPipes] = useState<Array<{ x: number; top: number; bottom: number }>>([])
  const gameLoopRef = useRef<number>()
  const birdVelocityRef = useRef(0)

  const GRAVITY = 0.5
  const JUMP_STRENGTH = -8
  const PIPE_SPEED = 3
  const PIPE_GAP = 150
  const PIPE_WIDTH = 60

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = () => {
      // Update bird
      birdVelocityRef.current += GRAVITY
      setBirdY(prev => {
        const newY = prev + birdVelocityRef.current
        if (newY < 0 || newY > 500) {
          handleGameOver()
          return prev
        }
        return newY
      })

      // Update pipes
      setPipes(prev => {
        const updated = prev.map(pipe => ({
          ...pipe,
          x: pipe.x - PIPE_SPEED,
        })).filter(pipe => pipe.x > -PIPE_WIDTH)

        // Check collisions
        const birdX = 100
        updated.forEach(pipe => {
          if (
            birdX < pipe.x + PIPE_WIDTH &&
            birdX + 40 > pipe.x &&
            (birdY < pipe.top || birdY + 40 > pipe.bottom)
          ) {
            handleGameOver()
          }
        })

        // Add new pipe
        if (updated.length === 0 || updated[updated.length - 1].x < 300) {
          const top = Math.random() * (400 - PIPE_GAP)
          updated.push({
            x: 600,
            top,
            bottom: top + PIPE_GAP,
          })
        }

        // Check score
        updated.forEach(pipe => {
          if (pipe.x + PIPE_WIDTH < birdX && pipe.x + PIPE_WIDTH > birdX - PIPE_SPEED) {
            setScore(prev => prev + 1)
          }
        })

        return updated
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameStarted, gameOver])

  const handleJump = () => {
    if (!gameStarted) {
      setGameStarted(true)
    }
    birdVelocityRef.current = JUMP_STRENGTH
  }

  const handleGameOver = () => {
    setGameOver(true)
    onScore(score)
  }

  const handleRestart = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
    setBirdY(250)
    setPipes([])
    birdVelocityRef.current = 0
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif text-rose">Flappy Love 💕</h2>
          <button onClick={onClose} className="text-warm-gray hover:text-rose">
            ✕
          </button>
        </div>

        <div
          className="bg-gradient-to-b from-blue-300 to-blue-500 rounded-lg relative overflow-hidden"
          style={{ height: '500px', width: '100%' }}
          onClick={handleJump}
        >
          {/* Bird */}
          <motion.div
            animate={{ y: birdY }}
            className="absolute left-20 w-10 h-10 bg-yellow-400 rounded-full"
            style={{ top: 0 }}
          >
            🐦
          </motion.div>

          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <div key={index}>
              <div
                className="absolute bg-green-600"
                style={{
                  left: pipe.x,
                  top: 0,
                  width: PIPE_WIDTH,
                  height: pipe.top,
                }}
              />
              <div
                className="absolute bg-green-600"
                style={{
                  left: pipe.x,
                  top: pipe.bottom,
                  width: PIPE_WIDTH,
                  height: 500 - pipe.bottom,
                }}
              />
            </div>
          ))}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-2xl font-serif mb-4">Game Over!</p>
                <p className="text-xl mb-4">Score: {score}</p>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-rose rounded-full font-serif"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}

          {/* Start Screen */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-2xl font-serif mb-4">Tap to Fly!</p>
                <p className="text-sm">Click anywhere to start</p>
              </div>
            </div>
          )}

          {/* Score */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold">
            {score}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

