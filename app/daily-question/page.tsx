'use client'

import { useRouter } from 'next/navigation'
import AppLayout from '@/components/navigation/AppLayout'
import DailyQuestion from '@/components/connect/DailyQuestion'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DailyQuestionPage() {
  const router = useRouter()

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50 px-4 pt-6 pb-24">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 mb-6 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6 border border-purple-100/50"
        >
          <DailyQuestion onComplete={() => router.push('/')} />
        </motion.div>
      </div>
    </AppLayout>
  )
}
