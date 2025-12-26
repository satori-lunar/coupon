'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import { recordActivity } from '@/lib/petSystem'
import { awardCoins, COIN_REWARDS } from '@/lib/coins'
import { coupons } from '@/data/coupons'
import type { Coupon, RedeemedCoupon } from '@/types'
import Link from 'next/link'

export default function CouponBookPage() {
  const { coupleId, pet } = useAppStore()
  const [currentPage, setCurrentPage] = useState(0)
  const [redeemedCoupons, setRedeemedCoupons] = useState<RedeemedCoupon[]>([])

  useEffect(() => {
    if (coupleId) {
      loadRedeemedCoupons()
    }
  }, [coupleId])

  const loadRedeemedCoupons = async () => {
    const redeemed = await persistence.getRedeemedCoupons(coupleId!)
    setRedeemedCoupons(redeemed)
  }

  const handleRedeem = async (coupon: Coupon) => {
    if (!coupleId || !pet) return

    const currentUserId = useAppStore.getState().currentUserId
    const redeemed: RedeemedCoupon = {
      couponId: coupon.id,
      redeemedAt: new Date().toISOString(),
      redeemedBy: currentUserId || '',
      location: prompt('Where did you redeem this? (optional)') || undefined,
      note: prompt('Add a note about this moment (optional)') || undefined,
    }

    await persistence.saveRedeemedCoupon({ ...redeemed, coupleId })
    await recordActivity(pet, 'gift')
    await awardCoins(coupleId, COIN_REWARDS.REDEEM_COUPON, 'Redeemed coupon')
    
    setRedeemedCoupons([...redeemedCoupons, redeemed])
    alert('Coupon redeemed! Enjoy your moment together! 💕')
  }

  const isRedeemed = (couponId: string) => {
    return redeemedCoupons.some(rc => rc.couponId === couponId)
  }

  const getRedeemedInfo = (couponId: string) => {
    return redeemedCoupons.find(rc => rc.couponId === couponId)
  }

  const goToNextPage = () => {
    if (currentPage < coupons.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
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

  const currentCoupon = coupons[currentPage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-blush flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Link href="/" className="text-rose mb-4 inline-block font-serif">
          ← Back to Dashboard
        </Link>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl min-h-[500px] flex flex-col justify-between"
          >
            <div>
              <h2 className="text-3xl font-serif text-rose mb-4">{currentCoupon.title}</h2>
              <p className="text-xl text-warm-gray leading-relaxed mb-6">{currentCoupon.description}</p>

              {isRedeemed(currentCoupon.id) && (
                <div className="bg-cream rounded-lg p-4 mb-4">
                  <p className="text-soft-gray text-sm">
                    Redeemed on {new Date(getRedeemedInfo(currentCoupon.id)!.redeemedAt).toLocaleDateString()}
                  </p>
                  {getRedeemedInfo(currentCoupon.id)?.note && (
                    <p className="text-warm-gray mt-2">{getRedeemedInfo(currentCoupon.id)?.note}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="px-6 py-3 bg-cream text-warm-gray rounded-full font-serif disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blush transition-colors"
              >
                Previous
              </button>

              {!isRedeemed(currentCoupon.id) ? (
                <button
                  onClick={() => handleRedeem(currentCoupon)}
                  className="px-8 py-4 bg-rose text-white rounded-full text-lg font-serif hover:bg-muted-rose transition-colors"
                >
                  Redeem This Moment
                </button>
              ) : (
                <div className="px-8 py-4 bg-soft-gray text-white rounded-full text-lg font-serif">
                  Redeemed
                </div>
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === coupons.length - 1}
                className="px-6 py-3 bg-cream text-warm-gray rounded-full font-serif disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blush transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-4">
          {coupons.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentPage ? 'bg-rose w-8' : 'bg-soft-gray/40 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

