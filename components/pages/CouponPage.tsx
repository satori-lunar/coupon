'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coupon } from '@/data/coupons'
import { isCouponRedeemed, getRedeemedDate, redeemCoupon } from '@/utils/storage'
import MemoryJournal from '@/components/MemoryJournal'

interface CouponPageProps {
  coupon: Coupon
  onNext: () => void
  onPrevious: () => void
}

export default function CouponPage({ coupon, onNext, onPrevious }: CouponPageProps) {
  const [redeemed, setRedeemed] = useState(false)
  const [redeemedDate, setRedeemedDate] = useState<string | null>(null)

  useEffect(() => {
    const checkRedeemed = () => {
      const isRedeemed = isCouponRedeemed(coupon.id)
      setRedeemed(isRedeemed)
      if (isRedeemed) {
        const date = getRedeemedDate(coupon.id)
        setRedeemedDate(date)
      }
    }
    
    checkRedeemed()
    // Check periodically in case localStorage was updated in another tab
    const interval = setInterval(checkRedeemed, 1000)
    return () => clearInterval(interval)
  }, [coupon.id])

  const handleRedeem = () => {
    if (!redeemed) {
      redeemCoupon(coupon.id)
      setRedeemed(true)
      setRedeemedDate(new Date().toISOString())
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-start px-8 md:px-16 pb-24 overflow-y-auto pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        {/* Decorative element */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-rose/20 via-blush/30 to-rose/20 flex items-center justify-center shadow-lg">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <svg
                className="w-14 h-14 text-rose/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="font-serif text-5xl md:text-6xl lg:text-7xl text-rose font-semibold"
          style={{ fontFamily: 'var(--font-serif)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {coupon.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-2xl md:text-3xl lg:text-4xl leading-loose text-warm-gray px-4 font-normal"
          style={{ fontFamily: 'var(--font-body)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {coupon.description}
        </motion.p>

        {/* Redeem button or status */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {redeemed ? (
            <div className="space-y-4">
              <div className="inline-block px-8 py-4 bg-gradient-to-r from-cream to-cream/90 border-2 border-rose/40 rounded-full shadow-md">
                <p className="text-rose font-handwritten text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'var(--font-handwritten)' }}>
                  Redeemed
                </p>
              </div>
              {redeemedDate && (
                <p className="text-warm-gray text-lg md:text-xl mt-3 font-medium">
                  {formatDate(redeemedDate)}
                </p>
              )}
            </div>
          ) : (
            <motion.button
              onClick={handleRedeem}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-5 bg-gradient-to-r from-rose/30 via-rose/25 to-rose/30 hover:from-rose/40 hover:via-rose/35 hover:to-rose/40 text-rose rounded-full transition-all duration-300 font-handwritten text-2xl md:text-3xl font-semibold shadow-lg hover:shadow-2xl border border-rose/30 backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-handwritten)' }}
            >
              Redeem This Moment
            </motion.button>
          )}
        </motion.div>

        {/* Memory Journal - Show when redeemed */}
        {redeemed && (
          <MemoryJournal couponId={coupon.id} couponTitle={coupon.title} />
        )}
      </motion.div>
    </div>
  )
}

