'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllDateNightMemories } from '@/utils/dateNightMemories'
import { dateNights } from '@/data/dateNights'

interface DateNightAdventureBookProps {
  onBack: () => void
}

export default function DateNightAdventureBook({ onBack }: DateNightAdventureBookProps) {
  const [memories, setMemories] = useState(getAllDateNightMemories())

  useEffect(() => {
    const interval = setInterval(() => {
      setMemories(getAllDateNightMemories())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (memories.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center px-8 md:px-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-2xl"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
            Your Adventure Book
          </h2>
          <p className="text-xl md:text-2xl text-warm-gray" style={{ fontFamily: 'var(--font-body)' }}>
            No adventures yet. Complete a date night and add photos, videos, or journal entries to remember it forever.
          </p>
          <button
            onClick={onBack}
            className="mt-8 px-8 py-3 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-xl"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            ← Back
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto px-4 md:px-8 pb-24">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
            Your Adventure Book
          </h2>
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-gradient-to-r from-rose/25 to-rose/20 hover:from-rose/35 hover:to-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-lg shadow-md hover:shadow-lg border border-rose/30"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            ← Back
          </motion.button>
        </motion.div>

        {/* Memories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((memory) => {
            const dateNight = dateNights.find(d => d.id === memory.dateNightId)
            return (
              <motion.div
                key={memory.dateNightId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-gradient-to-br from-cream/70 to-cream/50 rounded-2xl p-6 space-y-4 border border-rose/30 shadow-lg hover:shadow-xl transition-all"
              >
                {/* Date Night Title */}
                <h3 className="font-serif text-2xl md:text-3xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
                  {dateNight?.title || memory.dateNightId}
                </h3>

                {/* Date */}
                <p className="text-warm-gray text-sm">
                  {formatDate(memory.completedAt)}
                </p>

                {/* Notes */}
                {memory.notes && (
                  <div className="bg-cream/80 rounded-xl p-4 border border-rose/20 shadow-inner">
                    <p className="text-warm-gray text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {memory.notes}
                    </p>
                  </div>
                )}

                {/* Photos */}
                {memory.photos && memory.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {memory.photos.slice(0, 4).map((photo, index) => (
                      <motion.img
                        key={index}
                        src={photo}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-36 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        whileHover={{ scale: 1.05 }}
                      />
                    ))}
                    {memory.photos.length > 4 && (
                      <div className="w-full h-36 bg-gradient-to-br from-rose/20 to-blush/20 rounded-xl flex items-center justify-center text-rose font-handwritten text-lg border border-rose/30 shadow-md">
                        +{memory.photos.length - 4} more
                      </div>
                    )}
                  </div>
                )}

                {/* Videos */}
                {memory.videos && memory.videos.length > 0 && (
                  <div className="space-y-2">
                    {memory.videos.slice(0, 1).map((video, index) => (
                      <video
                        key={index}
                        src={video}
                        controls
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

