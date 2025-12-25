'use client'

import { motion } from 'framer-motion'

interface FinalPageProps {
  onPrevious: () => void
}

export default function FinalPage({ onPrevious }: FinalPageProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center space-y-8"
      >
        <motion.p
          className="text-2xl md:text-3xl leading-relaxed text-warm-gray"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          This book never really ends.
        </motion.p>
        
        <motion.p
          className="text-2xl md:text-3xl leading-relaxed text-warm-gray mt-8"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          There are always more moments waiting.
        </motion.p>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <svg
            className="w-16 h-16 md:w-20 md:h-20 mx-auto text-rose/60"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

