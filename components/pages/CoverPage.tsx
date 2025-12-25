'use client'

import { motion } from 'framer-motion'
import { personalization } from '@/config/personalization'

interface CoverPageProps {
  onNext: () => void
}

export default function CoverPage({ onNext }: CoverPageProps) {
  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center px-8 cursor-pointer"
      onClick={onNext}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center space-y-8 relative"
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
        >
          <div className="w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
        </motion.div>
        <motion.h1
          className="font-serif text-5xl md:text-7xl text-warm-gray mb-6 relative z-10 font-bold"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          A Book of Moments
        </motion.h1>
        
        <motion.p
          className="font-handwritten text-xl md:text-2xl text-soft-gray relative z-10"
          style={{ fontFamily: 'var(--font-handwritten)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Created just for you
        </motion.p>

        {personalization.name && (
          <motion.p
            className="font-handwritten text-3xl md:text-4xl text-rose mt-4 relative z-10"
            style={{ fontFamily: 'var(--font-handwritten)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {personalization.name}
          </motion.p>
        )}

        <motion.div
          className="mt-12 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8, type: 'spring' }}
        >
          <motion.svg
            className="w-14 h-14 md:w-16 md:h-16 mx-auto gradient-rose-modern"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
        </motion.div>

        <motion.p
          className="mt-8 text-warm-gray text-xl md:text-2xl font-medium relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Tap or swipe to begin
        </motion.p>
      </motion.div>
    </div>
  )
}

