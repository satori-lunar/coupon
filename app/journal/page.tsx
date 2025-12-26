'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import { recordActivity } from '@/lib/petSystem'
import { awardCoins, COIN_REWARDS } from '@/lib/coins'
import { updateStreak } from '@/lib/streaks'
import { format } from 'date-fns'
import type { JournalEntry } from '@/types'
import Link from 'next/link'

export default function JournalPage() {
  const { coupleId, currentUserId, pet } = useAppStore()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  useEffect(() => {
    if (coupleId) {
      loadEntries()
    }
  }, [coupleId])

  const loadEntries = async () => {
    const allEntries = await persistence.getJournalEntries(coupleId!)
    setEntries(allEntries)
  }

  const handleSubmit = async () => {
    if (!coupleId || !currentUserId || !content.trim()) return

    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      coupleId,
      authorId: currentUserId,
      content,
      mood: mood || undefined,
      isPrivate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await persistence.saveJournalEntry(entry)
    
    if (pet) {
      await recordActivity(pet, 'journal')
    }
    await awardCoins(coupleId, COIN_REWARDS.JOURNAL_ENTRY, 'Journal entry')
    await updateStreak(coupleId, 'journal')

    setContent('')
    setMood('')
    setIsPrivate(false)
    setShowForm(false)
    await loadEntries()
  }

  const visibleEntries = entries.filter(e => !e.isPrivate || e.authorId === currentUserId)

  if (!coupleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream to-blush flex items-center justify-center">
        <Link href="/" className="text-rose text-xl font-serif">
          Please complete onboarding first
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-blush p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-rose font-serif">
            ← Back to Dashboard
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-rose text-white rounded-full font-serif hover:bg-muted-rose transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Entry'}
          </button>
        </div>

        <h1 className="text-4xl font-serif text-rose mb-8">Journal 📝</h1>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md mb-6"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-40 px-4 py-3 rounded-lg border border-soft-gray focus:border-rose focus:outline-none text-lg mb-4"
            />
            <div className="flex gap-4 mb-4">
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="px-4 py-2 rounded-lg border border-soft-gray focus:border-rose focus:outline-none"
              >
                <option value="">Select mood (optional)</option>
                <option value="happy">😊 Happy</option>
                <option value="grateful">🙏 Grateful</option>
                <option value="loved">💕 Loved</option>
                <option value="peaceful">☮️ Peaceful</option>
                <option value="excited">🎉 Excited</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <span className="text-warm-gray">Private</span>
              </label>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="w-full px-6 py-3 bg-rose text-white rounded-full font-serif disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted-rose transition-colors"
            >
              Save Entry
            </button>
          </motion.div>
        )}

        <div className="space-y-4">
          {visibleEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-soft-gray">
                    {format(new Date(entry.createdAt), 'MMMM d, yyyy')}
                  </p>
                  {entry.mood && (
                    <span className="text-2xl">{entry.mood === 'happy' ? '😊' : entry.mood === 'grateful' ? '🙏' : entry.mood === 'loved' ? '💕' : entry.mood === 'peaceful' ? '☮️' : '🎉'}</span>
                  )}
                </div>
                {entry.isPrivate && (
                  <span className="text-xs text-soft-gray bg-cream px-2 py-1 rounded">Private</span>
                )}
              </div>
              <p className="text-warm-gray leading-relaxed whitespace-pre-wrap">{entry.content}</p>
            </motion.div>
          ))}

          {visibleEntries.length === 0 && (
            <div className="text-center text-warm-gray py-12">
              <p className="text-xl">No entries yet. Start writing! ✨</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

