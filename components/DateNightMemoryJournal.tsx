'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getDateNightMemory, addDateNightPhoto, addDateNightVideo, updateDateNightNotes, deleteDateNightPhoto, deleteDateNightVideo } from '@/utils/dateNightMemories'

interface DateNightMemoryJournalProps {
  dateNightId: string
  dateNightTitle: string
}

export default function DateNightMemoryJournal({ dateNightId, dateNightTitle }: DateNightMemoryJournalProps) {
  const [memory, setMemory] = useState(getDateNightMemory(dateNightId))
  const [notes, setNotes] = useState(memory?.notes || '')
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentMemory = getDateNightMemory(dateNightId)
    setMemory(currentMemory)
    setNotes(currentMemory?.notes || '')
  }, [dateNightId])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = type === 'photo' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File is too large. Maximum size: ${type === 'photo' ? '5MB' : '10MB'}`)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (type === 'photo') {
        addDateNightPhoto(dateNightId, base64)
      } else {
        addDateNightVideo(dateNightId, base64)
      }
      setTimeout(() => {
        setMemory(getDateNightMemory(dateNightId))
      }, 100)
    }
    reader.readAsDataURL(file)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    updateDateNightNotes(dateNightId, value)
  }

  const handleDeletePhoto = (index: number) => {
    if (confirm('Delete this photo?')) {
      deleteDateNightPhoto(dateNightId, index)
      setMemory(getDateNightMemory(dateNightId))
    }
  }

  const handleDeleteVideo = (index: number) => {
    if (confirm('Delete this video?')) {
      deleteDateNightVideo(dateNightId, index)
      setMemory(getDateNightMemory(dateNightId))
    }
  }

  if (!isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="mt-6 px-6 py-3 bg-blush/20 hover:bg-blush/30 text-warm-gray rounded-full transition-all duration-300 font-handwritten text-lg md:text-xl"
        style={{ fontFamily: 'var(--font-handwritten)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {memory ? '📝 View Memories' : '✨ Add Memories'}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full max-w-2xl space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif text-2xl md:text-3xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
          Memories of {dateNightTitle}
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-warm-gray hover:text-rose transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Notes/Journal */}
      <div className="space-y-2">
        <label className="block text-warm-gray text-lg font-medium">Journal Your Experience</label>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="How was your date night? What made it special? What will you remember?"
          className="w-full h-32 p-4 bg-cream/50 border border-rose/20 rounded-lg text-warm-gray text-lg resize-none focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/20"
          style={{ fontFamily: 'var(--font-body)' }}
        />
      </div>

      {/* Photos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-warm-gray text-lg font-medium">Photos</label>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-rose/20 hover:bg-rose/30 text-rose rounded-full text-sm transition-colors"
          >
            + Add Photo
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, 'photo')}
          className="hidden"
        />
        {memory?.photos && memory.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {memory.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeletePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Videos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-warm-gray text-lg font-medium">Videos</label>
          <button
            onClick={() => videoInputRef.current?.click()}
            className="px-4 py-2 bg-rose/20 hover:bg-rose/30 text-rose rounded-full text-sm transition-colors"
          >
            + Add Video
          </button>
        </div>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleFileSelect(e, 'video')}
          className="hidden"
        />
        {memory?.videos && memory.videos.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {memory.videos.map((video, index) => (
              <div key={index} className="relative group">
                <video
                  src={video}
                  controls
                  className="w-full rounded-lg"
                />
                <button
                  onClick={() => handleDeleteVideo(index)}
                  className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

