'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const prompts = [
  "What's a small moment from today that made you smile?",
  "What's something new you'd like to try together?",
  "What's one thing you're grateful for about your partner?",
  "What's a memory that always makes you laugh?",
  "What's a dream you have for your future together?",
  "What's something your partner does that you find endearing?",
  "What's a place you'd love to visit together?",
  "What's a skill you'd like to learn together?",
]

export default function DailyPrompt() {
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    // Get a prompt based on the day of the year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setPrompt(prompts[dayOfYear % prompts.length])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
    >
      <h2 className="text-2xl font-serif text-rose mb-4">Daily Prompt 💭</h2>
      <p className="text-lg text-warm-gray leading-relaxed">{prompt}</p>
      <p className="text-sm text-soft-gray mt-4 italic">
        Take a moment to discuss this together today.
      </p>
    </motion.div>
  )
}

