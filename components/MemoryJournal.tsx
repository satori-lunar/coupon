'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getMemory, addPhoto, addVideo, updateNotes, deletePhoto, deleteVideo } from '@/utils/memories'

interface MemoryJournalProps {
  couponId: string
  couponTitle: string
}

export default function MemoryJournal({ couponId, couponTitle }: MemoryJournalProps) {
  const [memory, setMemory] = useState(getMemory(couponId))
  const [notes, setNotes] = useState(memory?.notes || '')
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const currentMemory = getMemory(couponId)
    setMemory(currentMemory)
    setNotes(currentMemory?.notes || '')
  }, [couponId])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit file size to 5MB for photos, 10MB for videos
    const maxSize = type === 'photo' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File is too large. Maximum size: ${type === 'photo' ? '5MB' : '10MB'}`)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (type === 'photo') {
        addPhoto(couponId, base64)
      } else {
        addVideo(couponId, base64)
      }
      // Refresh memory
      setTimeout(() => {
        setMemory(getMemory(couponId))
      }, 100)
    }
    reader.readAsDataURL(file)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    updateNotes(couponId, value)
  }

  const handleDeletePhoto = (index: number) => {
    if (confirm('Delete this photo?')) {
      deletePhoto(couponId, index)
      setMemory(getMemory(couponId))
    }
  }

  const handleDeleteVideo = (index: number) => {
    if (confirm('Delete this video?')) {
      deleteVideo(couponId, index)
      setMemory(getMemory(couponId))
    }
  }

  if (!isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-8 py-4 bg-gradient-to-r from-blush/30 to-blush/20 hover:from-blush/40 hover:to-blush/30 text-warm-gray rounded-full transition-all duration-300 font-handwritten text-lg md:text-xl shadow-md hover:shadow-lg border border-rose/20"
        style={{ fontFamily: 'var(--font-handwritten)' }}
      >
        {memory ? '📝 View Memories' : '✨ Add Memories'}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 w-full max-w-2xl space-y-8"
    >
      <div className="bg-gradient-to-br from-cream/80 to-cream/60 rounded-2xl p-8 border border-rose/30 shadow-lg space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-3xl md:text-4xl text-rose" style={{ fontFamily: 'var(--font-serif)' }}>
            Memories of {couponTitle}
          </h3>
          <motion.button
            onClick={() => setIsExpanded(false)}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-warm-gray hover:text-rose transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose/10"
          >
            ✕
          </motion.button>
        </div>

        {/* Notes/Journal */}
        <div className="space-y-3">
          <label className="block text-warm-gray text-xl font-semibold">Journal Your Thoughts</label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Write about this moment... how did it feel? What made it special?"
            className="w-full h-40 p-5 bg-cream/70 border-2 border-rose/20 rounded-xl text-warm-gray text-lg resize-none focus:outline-none focus:border-rose/40 focus:ring-2 focus:ring-rose/20 shadow-inner transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          />
        </div>

        {/* Photos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-warm-gray text-xl font-semibold">Photos</label>
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-rose/25 to-rose/20 hover:from-rose/35 hover:to-rose/30 text-rose rounded-full text-sm transition-all shadow-md border border-rose/30"
            >
              + Add Photo
            </motion.button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, 'photo')}
            className="hidden"
          />
          {memory?.photos && memory.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {memory.photos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={photo}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                  <motion.button
                    onClick={() => handleDeletePhoto(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-warm-gray text-xl font-semibold">Videos</label>
            <motion.button
              onClick={() => videoInputRef.current?.click()}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-rose/25 to-rose/20 hover:from-rose/35 hover:to-rose/30 text-rose rounded-full text-sm transition-all shadow-md border border-rose/30"
            >
              + Add Video
            </motion.button>
          </div>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={(e) => handleFileSelect(e, 'video')}
            className="hidden"
          />
          {memory?.videos && memory.videos.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {memory.videos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <video
                    src={video}
                    controls
                    className="w-full rounded-xl"
                  />
                  <motion.button
                    onClick={() => handleDeleteVideo(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

