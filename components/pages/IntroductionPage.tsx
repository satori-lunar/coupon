'use client'

import { motion } from 'framer-motion'

interface IntroductionPageProps {
  onNext: () => void
  onPrevious: () => void
}

export default function IntroductionPage({ onNext, onPrevious }: IntroductionPageProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 md:px-16 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center space-y-8"
      >
        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl leading-loose text-warm-gray font-normal"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          This is not a book of chores or obligations.
        </motion.p>
        
        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl leading-loose text-warm-gray font-normal"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          It is a collection of moments — intentional, present, and deeply shared.
        </motion.p>

        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl leading-loose text-warm-gray mt-12 font-normal"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Each page holds a promise to slow down, to connect, and to be fully here with you.
        </motion.p>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-gradient-to-r from-rose/30 via-rose/25 to-rose/30 hover:from-rose/40 hover:via-rose/35 hover:to-rose/40 text-rose rounded-full transition-all duration-300 font-handwritten text-2xl md:text-3xl font-semibold shadow-lg hover:shadow-xl border border-rose/30"
            style={{ fontFamily: 'var(--font-handwritten)' }}
          >
            Turn the page →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

