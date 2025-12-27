'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MessageCircle, Heart, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'

const dailyQuestions = [
  "What's one thing you're grateful for today?",
  "What made you smile today?",
  "What's something new you'd like to try together?",
  "What's a memory that always makes you happy?",
  "What's something you appreciate about your partner today?",
  "What's a goal you'd like to achieve together?",
  "What's something that made you feel loved this week?",
]

export default function DailyConnectionPrompt() {
  const { dailyPrompts, addDailyPromptResponse, currentUserId } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [answer, setAnswer] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Get today's question based on date
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayPrompt = dailyPrompts?.find(p => p.date === today)
  const questionIndex = new Date().getDate() % dailyQuestions.length
  const question = todayPrompt?.question || dailyQuestions[questionIndex]
  const hasAnswered = todayPrompt?.responses?.[currentUserId || '']

  const handleSave = async () => {
    if (!answer.trim() || isSaving) return

    setIsSaving(true)

    try {
      // Save the response
      if (addDailyPromptResponse && currentUserId) {
        await addDailyPromptResponse(today, question, currentUserId, answer)
      }

      // Show success state
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setIsExpanded(false)
        setAnswer('')
      }, 1500)
    } catch (error) {
      console.error('Error saving response:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ios-card p-5 relative overflow-hidden"
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose to-accent opacity-50" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-accent/10">
            <MessageCircle size={20} className="text-accent" />
          </div>
          <h3 className="ios-text-title-3">Daily Connection</h3>
        </div>
        {hasAnswered && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle size={16} />
            <span className="text-xs font-medium">Answered</span>
          </div>
        )}
      </div>

      <p className="ios-text-body mb-4 text-text-secondary italic">{question}</p>

      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="expand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(true)}
            className="ios-button-secondary w-full flex items-center justify-center gap-2"
          >
            <Heart size={16} />
            {hasAnswered ? 'View Answer' : 'Share Your Answer'}
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 rounded-xl border border-separator bg-background ios-text-body resize-none focus:border-accent focus:outline-none transition-colors"
              rows={4}
              disabled={isSaving}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsExpanded(false)
                  setAnswer('')
                }}
                disabled={isSaving}
                className="ios-button-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!answer.trim() || isSaving}
                className="ios-button-primary flex-1 flex items-center justify-center gap-2"
              >
                {showSuccess ? (
                  <>
                    <CheckCircle size={16} />
                    Saved!
                  </>
                ) : isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Heart size={16} />
                    Save
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

