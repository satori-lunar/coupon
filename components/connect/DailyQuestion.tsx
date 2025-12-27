'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { MessageCircle, Sparkles, Heart, CheckCircle } from 'lucide-react'

type QuestionStage = 'answer' | 'waiting' | 'guess' | 'feedback' | 'complete'

interface DailyQuestionProps {
  onComplete?: () => void
}

export default function DailyQuestion({ onComplete }: DailyQuestionProps) {
  const {
    currentUserId,
    coupleId,
    profiles,
    couple,
    dailyPrompts,
    addDailyPromptResponse,
    addDailyPromptGuess,
    markGuessRevealed,
  } = useAppStore()

  const [stage, setStage] = useState<QuestionStage>('answer')
  const [myAnswer, setMyAnswer] = useState('')
  const [myGuess, setMyGuess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Today's date string
  const today = new Date().toISOString().split('T')[0]

  // Today's question (hardcoded for now, would come from a question bank)
  const todayQuestion = "What's your favorite movie?"

  // Get today's prompt from store
  const todayPrompt = dailyPrompts?.find(p => p.date === today)

  // Get partner info
  const partnerId = couple
    ? couple.partner1Id === currentUserId
      ? couple.partner2Id
      : couple.partner1Id
    : null
  const partnerProfile = partnerId ? profiles[partnerId] : null
  const partnerName = partnerProfile?.name || 'your partner'

  // Determine current stage based on stored data
  useEffect(() => {
    if (!currentUserId || !todayPrompt) {
      setStage('answer')
      return
    }

    const hasMyAnswer = todayPrompt.responses?.[currentUserId]
    const hasPartnerAnswer = partnerId && todayPrompt.responses?.[partnerId]
    const hasMyGuess = todayPrompt.guesses?.[currentUserId]
    const hasRevealed = todayPrompt.guessRevealed?.[currentUserId]

    if (!hasMyAnswer) {
      setStage('answer')
    } else if (!hasPartnerAnswer) {
      setStage('waiting')
    } else if (!hasMyGuess) {
      setStage('guess')
    } else if (!hasRevealed) {
      setStage('feedback')
    } else {
      setStage('complete')
    }
  }, [currentUserId, partnerId, todayPrompt])

  const handleSubmitAnswer = async () => {
    if (!currentUserId || !myAnswer.trim()) return

    setIsSubmitting(true)
    await addDailyPromptResponse(today, todayQuestion, currentUserId, myAnswer.trim())
    setMyAnswer('')
    setIsSubmitting(false)
  }

  const handleSubmitGuess = async () => {
    if (!currentUserId || !myGuess.trim()) return

    setIsSubmitting(true)
    await addDailyPromptGuess(today, currentUserId, myGuess.trim())
    setMyGuess('')
    setIsSubmitting(false)
  }

  const handleViewFeedback = async () => {
    if (!currentUserId) return
    await markGuessRevealed(today, currentUserId)
  }

  const handleDone = () => {
    if (onComplete) {
      onComplete()
    }
  }

  // Check if guess was correct
  const isGuessCorrect = () => {
    if (!currentUserId || !partnerId || !todayPrompt?.responses?.[partnerId] || !todayPrompt?.guesses?.[currentUserId]) {
      return false
    }
    const partnerAnswer = todayPrompt.responses[partnerId].toLowerCase().trim()
    const userGuess = todayPrompt.guesses[currentUserId].toLowerCase().trim()
    return partnerAnswer === userGuess
  }

  const renderStage = () => {
    switch (stage) {
      case 'answer':
        return (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about you</h2>
              <p className="text-gray-600">Your answer is private</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
              <p className="text-lg text-gray-900 text-center font-medium">{todayQuestion}</p>
            </div>

            <div>
              <textarea
                value={myAnswer}
                onChange={(e) => setMyAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none resize-none text-gray-900"
                rows={3}
              />
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !myAnswer.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:from-purple-600 hover:to-violet-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </motion.div>
        )

      case 'waiting':
        return (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-6 py-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center mx-auto shadow-lg"
            >
              <div className="text-4xl">💕</div>
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Waiting for {partnerName}</h2>
              <p className="text-gray-600">They're answering today's question</p>
            </div>
            <p className="text-sm text-purple-600 bg-purple-50 rounded-2xl px-4 py-3 inline-block">
              Come back later to see if you know them well! 💜
            </p>
          </motion.div>
        )

      case 'guess':
        return (
          <motion.div
            key="guess"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's see how well you know {partnerName}</h2>
              <p className="text-gray-600">Take your best guess</p>
            </div>

            <div className="bg-pink-50 rounded-2xl p-6 border-2 border-pink-200">
              <p className="text-lg text-gray-900 text-center font-medium">
                What is {partnerName}'s {todayQuestion.toLowerCase()}?
              </p>
            </div>

            <div>
              <textarea
                value={myGuess}
                onChange={(e) => setMyGuess(e.target.value)}
                placeholder="Type your guess..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none resize-none text-gray-900"
                rows={3}
              />
            </div>

            <button
              onClick={handleSubmitGuess}
              disabled={isSubmitting || !myGuess.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:from-pink-600 hover:to-rose-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Guess'}
            </button>
          </motion.div>
        )

      case 'feedback':
        const correct = isGuessCorrect()
        const partnerAnswer = partnerId && todayPrompt?.responses?.[partnerId]

        return (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 py-4"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className={`w-20 h-20 ${
                  correct
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                    : 'bg-gradient-to-br from-purple-400 to-violet-500'
                } rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
              >
                <div className="text-4xl">{correct ? '🎉' : '💛'}</div>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {correct ? 'You got it right!' : 'Not quite — now you know 💛'}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">The question was:</p>
                <p className="text-base font-semibold text-gray-900">{todayQuestion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{partnerName}'s answer:</p>
                <p className="text-lg font-bold text-purple-600">{partnerAnswer}</p>
              </div>
            </div>

            <div className="bg-violet-50 rounded-2xl px-4 py-3 border border-violet-200">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold">Private:</span> They won't see your guess
              </p>
            </div>

            <button
              onClick={handleViewFeedback}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg hover:from-purple-600 hover:to-violet-700 transition-all"
            >
              Done for today
            </button>
          </motion.div>
        )

      case 'complete':
        return (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All done for today!</h2>
              <p className="text-gray-600">Come back tomorrow for a new question</p>
            </div>
            <div className="text-6xl">💕</div>
            <button
              onClick={handleDone}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>
    </div>
  )
}
