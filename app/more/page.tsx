'use client'

import AppLayout from '@/components/navigation/AppLayout'
import MomentsSection from '@/components/more/MomentsSection'
import GiftsSection from '@/components/more/GiftsSection'
import MemoriesSection from '@/components/more/MemoriesSection'
import SettingsSection from '@/components/more/SettingsSection'
import { motion } from 'framer-motion'
import { MoreHorizontal } from 'lucide-react'

export default function MorePage() {
  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <MoreHorizontal size={28} className="text-accent" />
            <h1 className="ios-text-large-title">More</h1>
          </div>
          <p className="ios-text-secondary text-subhead">
            Gifts, moments, and settings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <MomentsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <GiftsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <MemoriesSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
        >
          <SettingsSection />
        </motion.div>
      </div>
    </AppLayout>
  )
}

