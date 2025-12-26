'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import { format } from 'date-fns'
import type { Memory } from '@/types'
import Link from 'next/link'

export default function MemoriesPage() {
  const { coupleId } = useAppStore()
  const [memories, setMemories] = useState<Memory[]>([])

  useEffect(() => {
    if (coupleId) {
      loadMemories()
    }
  }, [coupleId])

  const loadMemories = async () => {
    const allMemories = await persistence.getMemories(coupleId!)
    setMemories(allMemories)
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

        <h1 className="text-4xl font-serif text-rose mb-8">Memories Timeline ✨</h1>

        <div className="space-y-6">
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-serif text-rose">{memory.title}</h2>
                <p className="text-sm text-soft-gray">
                  {format(new Date(memory.date), 'MMMM d, yyyy')}
                </p>
              </div>
              <p className="text-warm-gray mb-4">{memory.description}</p>
              {memory.photos && memory.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {memory.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Memory ${index + 1}`}
                      className="rounded-lg w-full h-32 object-cover"
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {memories.length === 0 && (
            <div className="text-center text-warm-gray py-12">
              <p className="text-xl">No memories yet. Start creating moments together! ✨</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

