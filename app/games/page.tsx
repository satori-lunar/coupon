'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import { recordActivity } from '@/lib/petSystem'
import { awardCoins, COIN_REWARDS } from '@/lib/coins'
import FlappyGame from '@/games/FlappyGame'
import MemoryGame from '@/games/MemoryGame'
import Link from 'next/link'

export default function GamesPage() {
  const { coupleId, pet } = useAppStore()
  const [activeGame, setActiveGame] = useState<'flappy' | 'memory' | null>(null)

  const handleGameScore = async (score: number) => {
    if (!coupleId || !pet) return

    await recordActivity(pet, 'game')
    await awardCoins(coupleId, COIN_REWARDS.PLAY_GAME, 'Played game')
    
    // Save high score
    await persistence.saveGameScore({
      id: `score-${Date.now()}`,
      gameId: activeGame,
      coupleId,
      playerId: useAppStore.getState().currentUserId || '',
      score,
      playedAt: new Date().toISOString(),
    })
  }

  if (!coupleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-blush flex items-center justify-center">
        <Link href="/" className="text-rose text-xl font-serif">
          Please complete onboarding first
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-blush p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-rose mb-4 inline-block font-serif">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-serif text-rose mb-8">Mini Games 🎮</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            onClick={() => setActiveGame('flappy')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md text-center hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-6xl mb-4">🐦</div>
            <h2 className="text-2xl font-serif text-rose mb-2">Flappy Love</h2>
            <p className="text-warm-gray">Tap to fly and avoid obstacles!</p>
          </motion.button>

          <motion.button
            onClick={() => setActiveGame('memory')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md text-center hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-serif text-rose mb-2">Memory Match</h2>
            <p className="text-warm-gray">Find matching pairs of emojis!</p>
          </motion.button>
        </div>

        {activeGame === 'flappy' && (
          <FlappyGame
            onScore={handleGameScore}
            onClose={() => setActiveGame(null)}
          />
        )}

        {activeGame === 'memory' && (
          <MemoryGame
            onScore={handleGameScore}
            onClose={() => setActiveGame(null)}
          />
        )}
      </div>
    </div>
  )
}

