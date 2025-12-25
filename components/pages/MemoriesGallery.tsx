'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllMemories, getMemory } from '@/utils/memories'
import { coupons } from '@/data/coupons'

interface MemoriesGalleryProps {
  onBack: () => void
}

export default function MemoriesGallery({ onBack }: MemoriesGalleryProps) {
  const [memories, setMemories] = useState(getAllMemories())
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null)

  useEffect(() => {
    // Refresh memories periodically
    const interval = setInterval(() => {
      setMemories(getAllMemories())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const getCouponTitle = (couponId: string) => {
    return coupons.find(c => c.id === couponId)?.title || couponId
  }

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
            Your Memories
          </h2>
          <p className="text-xl md:text-2xl text-warm-gray" style={{ fontFamily: 'var(--font-body)' }}>
            No memories yet. Redeem a moment and add photos, videos, or journal entries to remember it forever.
          </p>
          <button
            onClick={onBack}
            className="mt-8 px-8 py-3 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-xl"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            ← Back to Book
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
            Your Memories
          </h2>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-lg"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            ← Back
          </button>
        </motion.div>

        {/* Memories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((memory) => {
            const coupon = coupons.find(c => c.id === memory.couponId)
            return (
              <motion.div
                key={memory.couponId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cream/50 rounded-lg p-6 space-y-4 border border-rose/20"
              >
                {/* Coupon Title */}
                <h3 className="font-serif text-2xl md:text-3xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
                  {coupon?.title || memory.couponId}
                </h3>

                {/* Date */}
                <p className="text-warm-gray text-sm">
                  {formatDate(memory.createdAt)}
                </p>

                {/* Notes */}
                {memory.notes && (
                  <div className="bg-cream/70 rounded p-4">
                    <p className="text-warm-gray text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {memory.notes}
                    </p>
                  </div>
                )}

                {/* Photos */}
                {memory.photos && memory.photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {memory.photos.slice(0, 4).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Memory ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedMemory(memory.couponId)}
                      />
                    ))}
                    {memory.photos.length > 4 && (
                      <div className="w-full h-32 bg-rose/20 rounded-lg flex items-center justify-center text-rose font-handwritten text-lg">
                        +{memory.photos.length - 4} more
                      </div>
                    )}
                  </div>
                )}

                {/* Videos */}
                {memory.videos && memory.videos.length > 0 && (
                  <div className="space-y-2">
                    {memory.videos.slice(0, 2).map((video, index) => (
                      <video
                        key={index}
                        src={video}
                        controls
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* View Full Memory Button */}
                <button
                  onClick={() => setSelectedMemory(memory.couponId)}
                  className="w-full px-4 py-2 bg-rose/20 hover:bg-rose/30 text-rose rounded-full transition-all duration-300 font-handwritten text-lg"
                  style={{ fontFamily: 'var(--font-handwritten)' }}
                >
                  View Full Memory
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Full Memory Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMemory(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cream rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const memory = getMemory(selectedMemory)
              const coupon = coupons.find(c => c.id === selectedMemory)
              if (!memory) return null

              return (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-3xl md:text-4xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
                      {coupon?.title || selectedMemory}
                    </h3>
                    <button
                      onClick={() => setSelectedMemory(null)}
                      className="text-warm-gray hover:text-rose text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <p className="text-warm-gray text-lg">
                    {formatDate(memory.createdAt)}
                  </p>

                  {memory.notes && (
                    <div className="bg-cream/70 rounded p-4">
                      <p className="text-warm-gray text-xl leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                        {memory.notes}
                      </p>
                    </div>
                  )}

                  {memory.photos && memory.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {memory.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {memory.videos && memory.videos.length > 0 && (
                    <div className="space-y-3">
                      {memory.videos.map((video, index) => (
                        <video
                          key={index}
                          src={video}
                          controls
                          className="w-full rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </motion.div>
        </div>
      )}
    </div>
  )
}

