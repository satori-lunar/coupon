'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coupon } from '@/data/coupons'
import { isCouponRedeemed, getRedeemedDate, redeemCoupon } from '@/utils/storage'

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
    <div className="h-full w-full flex flex-col items-center justify-center px-8 md:px-16 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full text-center space-y-12"
      >
        {/* Decorative element */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-24 h-24 rounded-full bg-blush/30 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-rose/60"
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
              <div className="inline-block px-8 py-4 bg-cream border-2 border-rose/40 rounded-full">
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
            <button
              onClick={handleRedeem}
              className="px-12 py-5 bg-rose/25 hover:bg-rose/35 active:bg-rose/45 text-rose rounded-full transition-all duration-300 font-handwritten text-2xl md:text-3xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
              style={{ fontFamily: 'var(--font-handwritten)' }}
            >
              Redeem This Moment
            </button>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

