'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import type { ScheduledDate } from '@/types'

interface UpcomingDatesProps {
  dates: ScheduledDate[]
}

export default function UpcomingDates({ dates }: UpcomingDatesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
    >
      <h2 className="text-2xl font-serif text-rose mb-4">Upcoming Dates 📅</h2>
      <div className="space-y-3">
        {dates.slice(0, 3).map((date) => (
          <div key={date.id} className="bg-cream rounded-lg p-4">
            <p className="font-serif text-warm-gray font-semibold">
              {format(new Date(date.scheduledFor), 'MMMM d, yyyy')}
            </p>
            <p className="text-soft-gray">{date.notes || 'Scheduled date'}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

