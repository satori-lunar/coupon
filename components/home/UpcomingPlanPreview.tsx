'use client'

import { useAppStore } from '@/lib/store'
import { Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function UpcomingPlanPreview() {
  const { scheduledDates } = useAppStore()

  // Get next scheduled date
  const upcomingDates = scheduledDates?.filter(
    date => date.status === 'scheduled' && new Date(date.scheduledFor) >= new Date()
  ) || []
  const nextDate = upcomingDates.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())[0]

  if (!nextDate) {
    return (
      <div className="ios-card p-5">
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-accent" />
          <div>
            <h3 className="ios-text-title-3">No upcoming dates</h3>
            <p className="ios-text-secondary text-subhead mt-1">
              Plan something special together
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-3">
        <Calendar size={20} className="text-accent" />
        <div className="flex-1">
          <h3 className="ios-text-title-3">Upcoming Date</h3>
          <p className="ios-text-body mt-1">{nextDate.title || 'Date Night'}</p>
          <p className="ios-text-secondary text-subhead mt-1">
            {format(new Date(nextDate.scheduledFor), 'EEEE, MMMM d')}
          </p>
        </div>
      </div>
    </div>
  )
}

