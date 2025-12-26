'use client'

import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GiftsSection() {
  const router = useRouter()

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={20} className="text-accent" />
        <h2 className="ios-text-title-3">Virtual Gifts</h2>
      </div>
      <p className="ios-text-secondary text-subhead mb-4">
        Send thoughtful gifts to your partner
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push('/more/gifts/letter')}
          className="ios-card-interactive p-4 text-center"
        >
          <span className="text-3xl block mb-2">💌</span>
          <span className="ios-text-body">Letter</span>
        </button>
        <button
          onClick={() => router.push('/more/gifts/playlist')}
          className="ios-card-interactive p-4 text-center"
        >
          <span className="text-3xl block mb-2">🎵</span>
          <span className="ios-text-body">Playlist</span>
        </button>
        <button
          onClick={() => router.push('/more/gifts/voice')}
          className="ios-card-interactive p-4 text-center"
        >
          <span className="text-3xl block mb-2">🎤</span>
          <span className="ios-text-body">Voice Note</span>
        </button>
        <button
          onClick={() => router.push('/more/gifts/recipe')}
          className="ios-card-interactive p-4 text-center"
        >
          <span className="text-3xl block mb-2">🍳</span>
          <span className="ios-text-body">Recipe</span>
        </button>
      </div>
    </div>
  )
}

