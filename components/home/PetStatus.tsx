'use client'

import { useAppStore } from '@/lib/store'
import { Heart } from 'lucide-react'

export default function PetStatus() {
  const { pet } = useAppStore()

  if (!pet) return null

  const happinessPercentage = pet.happiness || 0

  return (
    <div className="ios-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center">
            <span className="text-2xl">
              {pet.species === 'cat' ? '🐱' : pet.species === 'dog' ? '🐶' : '🐰'}
            </span>
          </div>
          <div>
            <p className="ios-text-body font-medium">{pet.name}</p>
            <p className="ios-text-secondary text-caption-1">Happiness: {happinessPercentage}%</p>
          </div>
        </div>
        <Heart size={16} className="text-accent" />
      </div>
    </div>
  )
}

