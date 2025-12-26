'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import Link from 'next/link'

export default function VirtualDatePage() {
  const { coupleId } = useAppStore()
  const [shareCode, setShareCode] = useState('')
  const [joinCode, setJoinCode] = useState('')

  const generateShareCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateRoom = async () => {
    if (!coupleId) return

    const code = generateShareCode()
    const room = {
      id: `room-${Date.now()}`,
      coupleId,
      shareCode: code,
      status: 'waiting',
      participants: [useAppStore.getState().currentUserId || ''],
      createdAt: new Date().toISOString(),
    }

    await persistence.saveVirtualDateRoom(room)
    setShareCode(code)
  }

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return

    const room = await persistence.getVirtualDateRoomByCode(joinCode.trim().toUpperCase())
    if (room) {
      // Update room with new participant
      const updatedRoom = {
        ...room,
        participants: [...room.participants, useAppStore.getState().currentUserId || ''],
        status: 'active',
      }
      await persistence.saveVirtualDateRoom(updatedRoom)
      alert('Joined room! Share this link with your partner.')
    } else {
      alert('Room not found. Please check the code.')
    }
  }

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
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-rose mb-4 inline-block font-serif">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-serif text-rose mb-8">Virtual Date Room 💻</h1>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-rose mb-4">Create Room</h2>
            <button
              onClick={handleCreateRoom}
              className="w-full px-6 py-3 bg-rose text-white rounded-full font-serif hover:bg-muted-rose transition-colors"
            >
              Create Virtual Date Room
            </button>
            {shareCode && (
              <div className="mt-4 bg-cream rounded-lg p-4">
                <p className="text-warm-gray mb-2">Share this code with your partner:</p>
                <p className="text-3xl font-mono font-bold text-rose text-center">{shareCode}</p>
                <p className="text-sm text-soft-gray mt-2 text-center">
                  Or share this link: {typeof window !== 'undefined' && window.location.href}?room={shareCode}
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-serif text-rose mb-4">Join Room</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="flex-1 px-4 py-3 rounded-lg border border-soft-gray focus:border-rose focus:outline-none text-lg"
                maxLength={6}
              />
              <button
                onClick={handleJoinRoom}
                className="px-6 py-3 bg-rose text-white rounded-full font-serif hover:bg-muted-rose transition-colors"
              >
                Join
              </button>
            </div>
          </div>

          <div className="bg-blush/50 rounded-lg p-4">
            <p className="text-warm-gray text-sm">
              <strong>Note:</strong> This is a basic implementation. For real-time synchronization,
              you'll need to implement WebRTC or use a service like Supabase Realtime.
              See README.md for implementation details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

