'use client'

import AppLayout from '@/components/navigation/AppLayout'
import GameCard from '@/components/play/GameCard'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'

const games = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Find matching pairs together',
    icon: '🧠',
  },
  {
    id: 'tap-fly',
    title: 'Tap to Fly',
    description: 'Simple, fun co-play game',
    icon: '🐦',
  },
  {
    id: 'spinner',
    title: 'Decision Spinner',
    description: 'Let chance decide for you',
    icon: '🎯',
  },
]

export default function PlayPage() {
  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 size={28} className="text-accent" />
            <h1 className="ios-text-large-title">Play</h1>
          </div>
          <p className="ios-text-secondary text-subhead">
            Light, joyful bonding activities
          </p>
        </motion.div>

        <div className="space-y-3">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

