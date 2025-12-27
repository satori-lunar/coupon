'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, MessageCircle, Calendar, Gamepad2, MoreHorizontal } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'connect', label: 'Connect', icon: MessageCircle, path: '/connect' },
  { id: 'dates', label: 'Dates', icon: Calendar, path: '/dates' },
  { id: 'play', label: 'Play', icon: Gamepad2, path: '/play' },
  { id: 'more', label: 'More', icon: MoreHorizontal, path: '/more' },
]

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const activeTab = tabs.find(tab => pathname === tab.path) || tabs[0]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-separator safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.path

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  size={24}
                  className={`transition-colors duration-ios ${
                    isActive ? 'text-accent' : 'text-text-tertiary'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                    initial={false}
                    transition={{
                      type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
                  />
                )}
              </div>
              <span
                className={`text-caption-2 mt-0.5 transition-colors duration-ios ${
                  isActive ? 'text-accent font-medium' : 'text-text-tertiary'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

