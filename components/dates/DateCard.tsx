'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Calendar, MapPin, Video } from 'lucide-react'

interface DateCardProps {
  date: {
    id: string
    title: string
    description: string
    why: string
    steps: string[]
    virtual?: string
  }
}

export default function DateCard({ date }: DateCardProps) {
  const { addScheduledDate, coupleId } = useAppStore()
  const [isVirtual, setIsVirtual] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  const handleSchedule = () => {
    if (coupleId) {
      addScheduledDate({
        id: date.id,
        coupleId,
        title: date.title,
        scheduledFor: new Date().toISOString(),
        status: 'scheduled',
      })
      setShowSchedule(false)
    }
  }

  return (
    <div className="ios-card p-5 space-y-4">
      <div>
        <h2 className="ios-text-title-2 mb-2">{date.title}</h2>
        <p className="ios-text-body text-text-secondary">{date.description}</p>
      </div>

      <div className="p-3 rounded-xl bg-accent-light">
        <p className="ios-text-subhead font-medium mb-1">Why this fits you:</p>
        <p className="ios-text-body text-text-secondary">{date.why}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsVirtual(false)}
          className={`flex-1 ios-button ${!isVirtual ? 'ios-button-primary' : 'ios-button-secondary'}`}
        >
          <MapPin size={16} className="inline mr-2" />
          In Person
        </button>
        <button
          onClick={() => setIsVirtual(true)}
          className={`flex-1 ios-button ${isVirtual ? 'ios-button-primary' : 'ios-button-secondary'}`}
        >
          <Video size={16} className="inline mr-2" />
          Virtual
        </button>
      </div>

      <div>
        <h3 className="ios-text-title-3 mb-3">Steps:</h3>
        <ol className="space-y-2">
          {date.steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center ios-text-caption-1 font-medium">
                {index + 1}
              </span>
              <span className="ios-text-body flex-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {isVirtual && date.virtual && (
        <div className="p-3 rounded-xl bg-background border border-separator">
          <p className="ios-text-body">{date.virtual}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex-1 ios-button-secondary"
        >
          <Calendar size={16} className="inline mr-2" />
          Schedule
        </button>
        <button className="flex-1 ios-button-primary">
          Save
        </button>
      </div>

      {showSchedule && (
        <div className="p-3 rounded-xl bg-background border border-separator">
          <input
            type="date"
            className="w-full p-2 rounded-lg border border-separator bg-card ios-text-body"
          />
          <button
            onClick={handleSchedule}
            className="ios-button-primary w-full mt-3"
          >
            Confirm Date
          </button>
        </div>
      )}
    </div>
  )
}

