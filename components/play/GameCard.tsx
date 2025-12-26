'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface GameCardProps {
  game: {
    id: string
    title: string
    description: string
    icon: string
  }
}

export default function GameCard({ game }: GameCardProps) {
  const router = useRouter()

  const handlePlay = () => {
    router.push(`/play/${game.id}`)
  }

  return (
    <button
      onClick={handlePlay}
      className="ios-card-interactive p-5 w-full text-left"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-accent-light flex items-center justify-center text-3xl">
          {game.icon}
        </div>
        <div className="flex-1">
          <h3 className="ios-text-title-3 mb-1">{game.title}</h3>
          <p className="ios-text-secondary text-subhead">{game.description}</p>
        </div>
      </div>
    </button>
  )
}

