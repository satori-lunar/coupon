'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import { spendCoins, getCoins, GIFT_COSTS } from '@/lib/coins'
import type { VirtualGift } from '@/types'
import Link from 'next/link'

const availableGifts = [
  { type: 'flower', title: 'Virtual Flower', description: 'Send a beautiful virtual flower', emoji: '🌹', cost: GIFT_COSTS.flower },
  { type: 'playlist', title: 'Playlist Share', description: 'Share a curated playlist', emoji: '🎵', cost: GIFT_COSTS.playlist },
  { type: 'voice-note', title: 'Voice Note', description: 'Record a personal message', emoji: '🎤', cost: GIFT_COSTS['voice-note'] },
  { type: 'recipe', title: 'Recipe Voucher', description: 'Share a favorite recipe', emoji: '📝', cost: GIFT_COSTS.recipe },
  { type: 'coupon', title: 'Custom Coupon', description: 'Create a custom moment coupon', emoji: '🎫', cost: GIFT_COSTS.coupon },
  { type: 'animation', title: 'Love Animation', description: 'A sweet animated message', emoji: '💕', cost: GIFT_COSTS.animation },
]

export default function GiftsPage() {
  const { coupleId, currentUserId, profiles } = useAppStore()
  const [coins, setCoins] = useState(0)
  const [gifts, setGifts] = useState<VirtualGift[]>([])

  useEffect(() => {
    if (coupleId) {
      loadData()
    }
  }, [coupleId])

  const loadData = async () => {
    const coinBalance = await getCoins(coupleId!)
    setCoins(coinBalance)
    const allGifts = await persistence.getGifts(coupleId!)
    setGifts(allGifts)
  }

  const handleSendGift = async (giftType: VirtualGift['type'], cost: number) => {
    if (!coupleId || !currentUserId) return

    if (coins < cost) {
      alert('Not enough coins!')
      return
    }

    const success = await spendCoins(coupleId, cost)
    if (!success) {
      alert('Failed to send gift')
      return
    }

    const partnerId = Object.keys(profiles).find(id => id !== currentUserId)
    if (!partnerId) return

    const gift: VirtualGift = {
      id: `gift-${Date.now()}`,
      type: giftType,
      title: availableGifts.find(g => g.type === giftType)?.title || 'Gift',
      description: availableGifts.find(g => g.type === giftType)?.description || '',
      cost,
      from: currentUserId,
      to: partnerId,
      sentAt: new Date().toISOString(),
    }

    await persistence.saveGift({ ...gift, coupleId })
    await loadData()
    alert('Gift sent! 💕')
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

  const receivedGifts = gifts.filter(g => g.to === currentUserId && !g.redeemedAt)
  const sentGifts = gifts.filter(g => g.from === currentUserId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-blush p-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-rose mb-4 inline-block font-serif">
          ← Back to Dashboard
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md mb-6 text-center">
          <p className="text-3xl font-serif text-rose">💰 {coins} Coins</p>
        </div>

        <h1 className="text-4xl font-serif text-rose mb-8">Gift Store 🎁</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {availableGifts.map((gift) => (
            <motion.div
              key={gift.type}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-5xl mb-4 text-center">{gift.emoji}</div>
              <h2 className="text-xl font-serif text-rose mb-2">{gift.title}</h2>
              <p className="text-warm-gray mb-4">{gift.description}</p>
              <button
                onClick={() => handleSendGift(gift.type as VirtualGift['type'], gift.cost)}
                disabled={coins < gift.cost}
                className="w-full px-6 py-3 bg-rose text-white rounded-full font-serif disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted-rose transition-colors"
              >
                Send ({gift.cost} coins)
              </button>
            </motion.div>
          ))}
        </div>

        {receivedGifts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-rose mb-4">Gifts Received 💌</h2>
            <div className="space-y-3">
              {receivedGifts.map((gift) => (
                <div key={gift.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md">
                  <p className="font-serif text-rose">{gift.title}</p>
                  <p className="text-warm-gray text-sm">{gift.description}</p>
                  <button
                    onClick={async () => {
                      await persistence.updateGift(gift.id, { redeemedAt: new Date().toISOString() })
                      await loadData()
                    }}
                    className="mt-2 px-4 py-2 bg-rose text-white rounded-full text-sm font-serif"
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

