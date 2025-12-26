'use client'

import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'

export default function MemoriesSection() {
  const router = useRouter()

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Camera size={20} className="text-accent" />
        <h2 className="ios-text-title-3">Memories</h2>
      </div>
      <p className="ios-text-secondary text-subhead mb-4">
        Your shared timeline of special moments
      </p>
      <button
        onClick={() => router.push('/more/memories')}
        className="ios-button-secondary w-full"
      >
        View Timeline
      </button>
    </div>
  )
}

