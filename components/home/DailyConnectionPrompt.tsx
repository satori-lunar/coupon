'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MessageCircle } from 'lucide-react'
import { format } from 'date-fns'

const dailyQuestions = [
  "What's one thing you're grateful for today?",
  "What made you smile today?",
  "What's something new you'd like to try together?",
  "What's a memory that always makes you happy?",
  "What's something you appreciate about your partner today?",
  "What's a goal you'd like to achieve together?",
  "What's something that made you feel loved this week?",
]

export default function DailyConnectionPrompt() {
  const { dailyPrompts } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)

  // Get today's question based on date
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayPrompt = dailyPrompts?.find(p => p.date === today)
  const questionIndex = new Date().getDate() % dailyQuestions.length
  const question = todayPrompt?.question || dailyQuestions[questionIndex]

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <MessageCircle size={20} className="text-accent" />
        <h3 className="ios-text-title-3">Daily Connection</h3>
      </div>
      <p className="ios-text-body mb-4">{question}</p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ios-button-secondary w-full"
      >
        {isExpanded ? 'Hide' : 'Share Your Answer'}
      </button>
      {isExpanded && (
        <div className="mt-4">
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-3 rounded-xl border border-separator bg-background ios-text-body resize-none"
            rows={4}
          />
          <button className="ios-button-primary w-full mt-3">
            Save
          </button>
        </div>
      )}
    </div>
  )
}

