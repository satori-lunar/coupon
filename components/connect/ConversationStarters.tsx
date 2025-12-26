'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { MessageCircle } from 'lucide-react'

const conversationStarters = [
  { id: '1', question: "What's something you've been thinking about lately?", category: 'deep' as const },
  { id: '2', question: "What's a small moment that made you happy today?", category: 'gentle' as const },
  { id: '3', question: "What's something new you'd like to learn together?", category: 'fun' as const },
  { id: '4', question: "What's a memory from our relationship that stands out?", category: 'reflection' as const },
  { id: '5', question: "What's something you appreciate about me that you haven't said recently?", category: 'gentle' as const },
  { id: '6', question: "What's a goal or dream you'd like to share?", category: 'deep' as const },
]

export default function ConversationStarters() {
  const { conversationStarters: usedStarters, addConversationStarter } = useAppStore()
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const availableQuestions = conversationStarters.filter(
    q => !usedStarters?.some(used => used.id === q.id)
  )

  const handleSelectQuestion = (question: typeof conversationStarters[0]) => {
    setSelectedQuestion(question.id)
    addConversationStarter({
      id: question.id,
      question: question.question,
      category: question.category,
      used: true,
      usedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle size={20} className="text-accent" />
        <h2 className="ios-text-title-3">Conversation Starters</h2>
      </div>
      <p className="ios-text-secondary text-subhead mb-4">
        Deep, gentle questions to spark meaningful conversations
      </p>
      <div className="space-y-2">
        {availableQuestions.slice(0, 3).map((question) => (
          <button
            key={question.id}
            onClick={() => handleSelectQuestion(question)}
            className="w-full ios-card-interactive p-4 text-left"
          >
            <p className="ios-text-body">{question.question}</p>
            <span className="ios-text-secondary text-caption-1 mt-1 block">
              {question.category === 'deep' && '💭 Deep'}
              {question.category === 'gentle' && '💛 Gentle'}
              {question.category === 'fun' && '✨ Fun'}
              {question.category === 'reflection' && '🌙 Reflection'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

