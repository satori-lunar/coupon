'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Gift, Plus } from 'lucide-react'
import { format } from 'date-fns'

export default function MomentsSection() {
  const { moments, addMoment, currentUserId, coupleId } = useAppStore()
  const [showCreate, setShowCreate] = useState(false)

  const handleCreateMoment = (title: string, description: string) => {
    if (currentUserId && coupleId) {
      addMoment({
        id: Date.now().toString(),
        coupleId,
        title,
        description,
        category: 'coupon',
        from: currentUserId,
        to: '', // Will be partner
        createdAt: new Date().toISOString(),
      })
      setShowCreate(false)
    }
  }

  return (
    <div className="ios-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift size={20} className="text-accent" />
          <h2 className="ios-text-title-3">Moments</h2>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="p-2 rounded-full bg-accent-light text-accent"
        >
          <Plus size={20} />
        </button>
      </div>

      {showCreate && (
        <div className="mb-4 space-y-3 p-3 rounded-xl bg-background border border-separator">
          <input
            type="text"
            placeholder="Moment title"
            className="w-full p-3 rounded-xl border border-separator bg-card ios-text-body"
            id="moment-title"
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 rounded-xl border border-separator bg-card ios-text-body resize-none"
            rows={3}
            id="moment-description"
          />
          <button
            onClick={() => {
              const titleInput = document.getElementById('moment-title') as HTMLInputElement
              const descInput = document.getElementById('moment-description') as HTMLTextAreaElement
              if (titleInput && descInput) {
                handleCreateMoment(titleInput.value, descInput.value)
                titleInput.value = ''
                descInput.value = ''
              }
            }}
            className="ios-button-primary w-full"
          >
            Create Moment
          </button>
        </div>
      )}

      <div className="space-y-2">
        {moments && moments.length > 0 ? (
          moments.map((moment) => (
            <div key={moment.id} className="p-3 rounded-xl bg-background border border-separator">
              <h3 className="ios-text-body font-medium mb-1">{moment.title}</h3>
              <p className="ios-text-secondary text-subhead">{moment.description}</p>
              <p className="ios-text-secondary text-caption-1 mt-2">
                {format(new Date(moment.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          ))
        ) : (
          <p className="ios-text-secondary text-subhead text-center py-4">
            No moments yet. Create one to share with your partner.
          </p>
        )}
      </div>
    </div>
  )
}

