'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

export default function WeeklyReflection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={20} className="text-accent" />
        <h2 className="ios-text-title-3">Weekly Reflection</h2>
      </div>
      <p className="ios-text-secondary text-subhead mb-4">
        Take a moment to reflect on your week together
      </p>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="ios-button-secondary w-full"
        >
          Start Reflection
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="ios-text-body font-medium block mb-2">
              What went well this week?
            </label>
            <textarea
              placeholder="Share your thoughts..."
              className="w-full p-3 rounded-xl border border-separator bg-background ios-text-body resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="ios-text-body font-medium block mb-2">
              What would you like to improve?
            </label>
            <textarea
              placeholder="Share your thoughts..."
              className="w-full p-3 rounded-xl border border-separator bg-background ios-text-body resize-none"
              rows={3}
            />
          </div>
          <button className="ios-button-primary w-full">
            Save Reflection
          </button>
        </div>
      )}
    </div>
  )
}

