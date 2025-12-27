'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import AppLayout from '@/components/navigation/AppLayout'
import { MessageCircle, Calendar, Send, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RootPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { loadAppState, currentUserId, profiles } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    const checkOnboarding = async () => {
      await loadAppState()
      setIsLoading(false)
    }
    checkOnboarding()
  }, [loadAppStore])

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
          <h1 className="text-2xl text-gray-900 mb-1">{greeting}, {userName}</h1>
          <p className="text-gray-500">How are you and your partner feeling today?</p>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-purple-100 p-6 aspect-[4/3] flex items-center justify-center"
        >
          <div className="text-6xl">💑</div>
        </motion.div>

        {/* Daily Connection Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform cursor-pointer"
          onClick={() => router.push('/connect')}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-rose-500 mb-1">Today's Connection</p>
              <p className="text-gray-900">
                What's one thing your partner did recently that made you feel loved?
              </p>
            </div>
          </div>
          <button className="w-full bg-rose-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors">
            Answer Together
          </button>
        </motion.div>

        {/* Relationship Pulse */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Connection Streak</p>
              <p className="text-2xl text-gray-900">14 days 🔥</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">This Week</p>
              <p className="text-2xl text-gray-900">5/7</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: '71%' }} />
          </div>
        </motion.div>

        {/* Pet Companion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 shadow-sm border border-amber-100 active:scale-[0.99] transition-transform cursor-pointer"
          onClick={() => router.push('/more')}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
              🐰
            </div>
            <div className="flex-1">
              <p className="text-gray-900 mb-1 font-medium">Benny is happy!</p>
              <p className="text-xs text-gray-600">Keep connecting to feed your pet</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <p className="text-xs text-gray-500 px-1 mb-2">Quick Actions</p>

          <button
            onClick={() => router.push('/dates')}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 text-sm font-medium">Plan a date</p>
              <p className="text-xs text-gray-500">Browse personalized ideas</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>

          <button
            onClick={() => router.push('/more')}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <Send className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-gray-900 text-sm font-medium">Send something sweet</p>
              <p className="text-xs text-gray-500">Share a note or gift</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </motion.div>
      </div>
    </AppLayout>
  )
}
