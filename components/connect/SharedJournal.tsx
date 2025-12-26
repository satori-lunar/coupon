'use client'

import { useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { format } from 'date-fns'

export default function SharedJournal() {
  const { currentUserId, profiles } = useAppStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const [entries, setEntries] = useState<Array<{
    id: string
    content: string
    authorId: string
    date: string
  }>>([])

  const currentUser = currentUserId ? profiles[currentUserId] : null

  const handleAddEntry = (content: string) => {
    if (currentUserId && content.trim()) {
      setEntries([
        {
          id: Date.now().toString(),
          content,
          authorId: currentUserId,
          date: new Date().toISOString(),
        },
        ...entries,
      ])
      setIsExpanded(false)
    }
  }

  return (
    <div className="ios-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-accent" />
          <h2 className="ios-text-title-3">Shared Journal</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full bg-accent-light text-accent"
        >
          <Plus size={20} />
        </button>
      </div>

      {isExpanded && (
        <div className="mb-4 space-y-3">
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-3 rounded-xl border border-separator bg-background ios-text-body resize-none"
            rows={4}
            id="journal-entry"
          />
          <button
            onClick={() => {
              const textarea = document.getElementById('journal-entry') as HTMLTextAreaElement
              if (textarea) {
                handleAddEntry(textarea.value)
                textarea.value = ''
              }
            }}
            className="ios-button-primary w-full"
          >
            Add Entry
          </button>
        </div>
      )}

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="ios-text-secondary text-subhead text-center py-4">
            No entries yet. Start sharing your thoughts.
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="p-3 rounded-xl bg-background border border-separator">
              <div className="flex items-center gap-2 mb-2">
                <span className="ios-text-body font-medium">
                  {currentUser?.name || 'You'}
                </span>
                <span className="ios-text-secondary text-caption-1">
                  {format(new Date(entry.date), 'MMM d')}
                </span>
              </div>
              <p className="ios-text-body">{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

