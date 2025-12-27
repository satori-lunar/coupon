'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import AppLayout from '@/components/navigation/AppLayout'
import WeeklySuggestions from '@/components/connect/WeeklySuggestions'
import { MessageCircle, Calendar, Send, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RootPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { loadAppState, currentUserId, profiles, dailyPrompts, couple } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    const checkOnboarding = async () => {
      await loadAppState()
      setIsLoading(false)
    }
    checkOnboarding()
  }, [loadAppState])

  // Check daily question status
  const today = new Date().toISOString().split('T')[0]
  const todayPrompt = dailyPrompts?.find(p => p.date === today)
  const partnerId = couple
    ? couple.partner1Id === currentUserId
      ? couple.partner2Id
      : couple.partner1Id
    : null

  const hasMyAnswer = currentUserId && todayPrompt?.responses?.[currentUserId]
  const hasPartnerAnswer = partnerId && todayPrompt?.responses?.[partnerId]
  const hasMyGuess = currentUserId && todayPrompt?.guesses?.[currentUserId]
  const hasRevealed = currentUserId && todayPrompt?.guessRevealed?.[currentUserId]
  const isQuestionComplete = hasMyAnswer && hasPartnerAnswer && hasMyGuess && hasRevealed

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  const currentUser = currentUserId ? profiles[currentUserId] : null
  const userName = currentUser?.name || 'Sarah'

  // Get greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <AppLayout>
      <div className="pb-24 px-4 pt-12 max-w-md mx-auto">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">{greeting}, {userName}</h1>
          <p className="text-base text-gray-600">How are you and your partner feeling today?</p>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl overflow-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-violet-300 p-8 aspect-[4/3] flex items-center justify-center shadow-lg"
        >
          <div className="text-7xl">💑</div>
        </motion.div>

        {/* Daily Question Card - THE HEART OF THE APP */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl p-6 mb-5 shadow-lg border border-purple-100/50 active:scale-[0.98] transition-transform cursor-pointer"
          onClick={() => router.push('/daily-question')}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-600 mb-2">
                {isQuestionComplete ? "Today's Question ✓" : "Today's Question"}
              </p>
              <p className="text-gray-900 text-base leading-relaxed">
                {isQuestionComplete
                  ? "Great job! Come back tomorrow for a new question."
                  : !hasMyAnswer
                  ? "What's your favorite movie?"
                  : !hasPartnerAnswer
                  ? "Waiting for your partner to answer..."
                  : !hasMyGuess
                  ? "Now guess your partner's answer!"
                  : "See how well you know them"}
              </p>
            </div>
          </div>
          {!isQuestionComplete && (
            <button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3.5 rounded-2xl text-base font-semibold hover:from-purple-600 hover:to-violet-700 transition-all shadow-md">
              {!hasMyAnswer
                ? "Answer Now"
                : !hasPartnerAnswer
                ? "Check Status"
                : !hasMyGuess
                ? "Make Your Guess"
                : "View Results"}
            </button>
          )}
          {isQuestionComplete && (
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">Come back tomorrow 💜</p>
            </div>
          )}
        </motion.div>

        {/* Weekly Love Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <WeeklySuggestions />
        </motion.div>

        {/* Relationship Pulse */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-6 mb-5 shadow-lg border border-pink-100/50"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm text-gray-500 mb-2 font-medium">Connection Streak</p>
              <p className="text-3xl font-bold text-gray-900">14 days 🔥</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-2 font-medium">This Week</p>
              <p className="text-3xl font-bold text-gray-900">5/7</p>
            </div>
          </div>
          <div className="w-full bg-purple-50 h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '71%' }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-purple-500 to-violet-600 h-full rounded-full shadow-sm"
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">You're doing amazing! Keep it up 💜</p>
        </motion.div>

        {/* Pet Companion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-6 mb-6 shadow-lg border border-amber-200/50 active:scale-[0.98] transition-transform cursor-pointer"
          onClick={() => router.push('/more')}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-md">
              🐰
            </div>
            <div className="flex-1">
              <p className="text-gray-900 mb-1 font-semibold text-base">Benny is happy!</p>
              <p className="text-sm text-gray-600">Keep connecting to feed your pet</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-3"
        >
          <p className="text-sm font-semibold text-gray-500 px-1 mb-3">Quick Actions</p>

          <button
            onClick={() => router.push('/dates')}
            className="w-full bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform hover:shadow-lg"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 text-base font-semibold">Plan a date</p>
              <p className="text-sm text-gray-500">Browse personalized ideas</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>

          <button
            onClick={() => router.push('/more')}
            className="w-full bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform hover:shadow-lg"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 text-base font-semibold">Send something sweet</p>
              <p className="text-sm text-gray-500">Share a note or gift</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </motion.div>
      </div>
    </AppLayout>
  )
}
