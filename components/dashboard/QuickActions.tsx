'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function QuickActions() {
  const actions = [
    { label: 'Generate Date', href: '/dates', emoji: '💕', color: 'bg-rose' },
    { label: 'Coupon Book', href: '/coupons', emoji: '📖', color: 'bg-muted-rose' },
    { label: 'Play Games', href: '/games', emoji: '🎮', color: 'bg-blush' },
    { label: 'Send Gift', href: '/gifts', emoji: '🎁', color: 'bg-cream' },
    { label: 'Journal', href: '/journal', emoji: '📝', color: 'bg-rose/20' },
    { label: 'Memories', href: '/memories', emoji: '✨', color: 'bg-muted-rose/20' },
    { label: 'Virtual Date', href: '/virtual-date', emoji: '💻', color: 'bg-blush/50' },
    { label: 'Settings', href: '/settings', emoji: '⚙️', color: 'bg-cream/50' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md"
    >
      <h2 className="text-2xl font-serif text-rose mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <motion.button
              className={`w-full ${action.color} rounded-xl p-6 text-center hover:shadow-lg transition-shadow`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">{action.emoji}</div>
              <div className="text-warm-gray font-serif">{action.label}</div>
            </motion.button>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

