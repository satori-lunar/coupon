'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface HubProps {
  onNavigate: (section: 'book' | 'memories' | 'dateNight') => void
}

export default function Hub({ onNavigate }: HubProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 md:px-16 pb-24 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-12 text-center"
      >
        {/* Header */}
        <div className="space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
            A Book of Moments
          </h1>
          <p className="text-xl md:text-2xl text-warm-gray" style={{ fontFamily: 'var(--font-body)' }}>
            Choose your journey
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Book of Moments */}
          <motion.button
            onClick={() => onNavigate('book')}
            className="bg-cream/50 rounded-lg p-8 space-y-4 border-2 border-rose/20 hover:border-rose/40 transition-all duration-300 text-left group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-5xl mb-4">📖</div>
            <h3 className="font-serif text-2xl md:text-3xl text-rose group-hover:text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
              Book of Moments
            </h3>
            <p className="text-warm-gray text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              Flip through your collection of intentional moments and experiences together.
            </p>
          </motion.button>

          {/* Memory Book */}
          <motion.button
            onClick={() => onNavigate('memories')}
            className="bg-cream/50 rounded-lg p-8 space-y-4 border-2 border-rose/20 hover:border-rose/40 transition-all duration-300 text-left group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-5xl mb-4">📸</div>
            <h3 className="font-serif text-2xl md:text-3xl text-rose group-hover:text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
              Memory Book
            </h3>
            <p className="text-warm-gray text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              View all your photos, videos, and journal entries from moments you've shared.
            </p>
          </motion.button>

          {/* Date Night Adventures */}
          <motion.button
            onClick={() => onNavigate('dateNight')}
            className="bg-cream/50 rounded-lg p-8 space-y-4 border-2 border-rose/20 hover:border-rose/40 transition-all duration-300 text-left group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-5xl mb-4">💕</div>
            <h3 className="font-serif text-2xl md:text-3xl text-rose group-hover:text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
              Date Night Adventures
            </h3>
            <p className="text-warm-gray text-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              Generate surprise date nights and document your adventures together.
            </p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

