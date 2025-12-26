'use client'

import { motion } from 'framer-motion'
import type { Pet } from '@/types'

const petEmojis = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bird: '🐦',
  hamster: '🐹',
}

interface PetDisplayProps {
  pet: Pet
  hunger: number
  happiness: number
  status: { status: string; emoji: string; needsAttention: boolean }
}

export default function PetDisplay({ pet, hunger, happiness, status }: PetDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-serif text-rose">{pet.name}</h2>
          <p className="text-soft-gray">Level {pet.level} {petEmojis[pet.species]}</p>
        </div>
        <div className="text-4xl">{petEmojis[pet.species]}</div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-soft-gray mb-1">
            <span>Hunger</span>
            <span>{Math.round(hunger)}%</span>
          </div>
          <div className="w-full bg-cream rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hunger}%` }}
              className={`h-3 rounded-full ${
                hunger > 50 ? 'bg-green-500' : hunger > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-soft-gray mb-1">
            <span>Happiness</span>
            <span>{Math.round(happiness)}%</span>
          </div>
          <div className="w-full bg-cream rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${happiness}%` }}
              className={`h-3 rounded-full ${
                happiness > 50 ? 'bg-green-500' : happiness > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {status.needsAttention && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blush/50 rounded-lg p-3 text-center"
          >
            <p className="text-warm-gray">
              {status.emoji} {status.status}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

