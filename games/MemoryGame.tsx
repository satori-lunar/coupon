'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MemoryGameProps {
  onScore: (score: number) => void
  onClose: () => void
}

const emojis = ['💕', '🌹', '✨', '🎁', '💝', '🌟', '💖', '🌙']

export default function MemoryGame({ onScore, onClose }: MemoryGameProps) {
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true)
      const score = Math.max(0, 1000 - moves * 10)
      onScore(score)
    }
  }, [matched, cards])

  const startGame = () => {
    const pairs = [...emojis, ...emojis]
    const shuffled = pairs.sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1)
      const [first, second] = newFlipped
      if (cards[first] === cards[second]) {
        setMatched(prev => [...prev, first, second])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif text-rose">Memory Match 💕</h2>
          <button onClick={onClose} className="text-warm-gray hover:text-rose">
            ✕
          </button>
        </div>

        <div className="mb-4 text-center">
          <p className="text-warm-gray">Moves: {moves}</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index)
            return (
              <motion.button
                key={index}
                onClick={() => handleCardClick(index)}
                disabled={matched.includes(index)}
                className="aspect-square bg-cream rounded-lg text-3xl flex items-center justify-center disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isFlipped ? card : '?'}
              </motion.button>
            )
          })}
        </div>

        {gameWon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <p className="text-2xl font-serif text-rose mb-4">You Won! 🎉</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-rose text-white rounded-full font-serif"
            >
              Play Again
            </button>
          </motion.div>
        )}

        <button
          onClick={startGame}
          className="mt-4 w-full px-6 py-3 bg-cream text-warm-gray rounded-full font-serif"
        >
          New Game
        </button>
      </motion.div>
    </div>
  )
}

