'use client'

import AppLayout from '@/components/navigation/AppLayout'
import ConversationStarters from '@/components/connect/ConversationStarters'
import WeeklyReflection from '@/components/connect/WeeklyReflection'
import SharedJournal from '@/components/connect/SharedJournal'
import { motion } from 'framer-motion'

export default function ConnectPage() {
  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="ios-text-large-title mb-1">Connect</h1>
          <p className="ios-text-secondary text-subhead">
            Grow together through meaningful conversations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <ConversationStarters />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <WeeklyReflection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <SharedJournal />
        </motion.div>
      </div>
    </AppLayout>
  )
}

