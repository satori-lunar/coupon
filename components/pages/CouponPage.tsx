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
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose via-orange to-rose flex items-center justify-center shadow-lg">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-warm-gray font-bold"
          style={{ fontFamily: 'var(--font-serif)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {coupon.title}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-xl md:text-2xl leading-relaxed text-soft-gray px-4 font-normal"
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
              <div className="inline-block px-8 py-4 bg-gray-light border-2 border-rose/30 rounded-full shadow-sm">
                <p className="text-rose font-handwritten text-xl md:text-2xl font-semibold" style={{ fontFamily: 'var(--font-handwritten)' }}>
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
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 gradient-rose-modern text-white rounded-full transition-all duration-300 font-handwritten text-xl md:text-2xl font-semibold shadow-lg hover:shadow-xl"
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

