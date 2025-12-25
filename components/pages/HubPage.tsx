'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface HubPageProps {
  onNavigate: (section: 'book' | 'memories' | 'date-nights') => void
}

export default function HubPage({ onNavigate }: HubPageProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
            A Book of Moments
          </h1>
          <p className="text-xl md:text-2xl text-warm-gray" style={{ fontFamily: 'var(--font-body)' }}>
            Choose your journey
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* Coupons Book */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('book')}
            className="relative card-modern p-8 text-center space-y-4 transition-all duration-300 hover:card-modern-hover overflow-hidden group"
          >
            <div className="absolute inset-0 gradient-rose-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-5xl mb-2 relative z-10"
            >
              📖
            </motion.div>
            <h2 className="font-serif text-2xl md:text-3xl text-warm-gray group-hover:text-rose transition-colors relative z-10" style={{ fontFamily: 'var(--font-serif)' }}>
              The Book
            </h2>
            <p className="text-soft-gray text-base leading-relaxed relative z-10" style={{ fontFamily: 'var(--font-body)' }}>
              Moments of intention and presence
            </p>
          </motion.button>

          {/* Memories Gallery */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('memories')}
            className="relative card-modern p-8 text-center space-y-4 transition-all duration-300 hover:card-modern-hover overflow-hidden group"
          >
            <div className="absolute inset-0 gradient-rose-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="text-5xl mb-2 relative z-10"
            >
              📸
            </motion.div>
            <h2 className="font-serif text-2xl md:text-3xl text-warm-gray group-hover:text-rose transition-colors relative z-10" style={{ fontFamily: 'var(--font-serif)' }}>
              Memories
            </h2>
            <p className="text-soft-gray text-base leading-relaxed relative z-10" style={{ fontFamily: 'var(--font-body)' }}>
              Photos, videos, and journal entries
            </p>
          </motion.button>

          {/* Date Nights */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('date-nights')}
            className="relative card-modern p-8 text-center space-y-4 transition-all duration-300 hover:card-modern-hover overflow-hidden group"
          >
            <div className="absolute inset-0 gradient-rose-soft opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="text-5xl mb-2 relative z-10"
            >
              💕
            </motion.div>
            <h2 className="font-serif text-2xl md:text-3xl text-warm-gray group-hover:text-rose transition-colors relative z-10" style={{ fontFamily: 'var(--font-serif)' }}>
              Date Nights
            </h2>
            <p className="text-soft-gray text-base leading-relaxed relative z-10" style={{ fontFamily: 'var(--font-body)' }}>
              Adventures and experiences together
            </p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

