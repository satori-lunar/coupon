'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import AppLayout from '@/components/navigation/AppLayout'
import Greeting from '@/components/home/Greeting'
import RelationshipPulseCard from '@/components/home/RelationshipPulseCard'
import PetStatus from '@/components/home/PetStatus'
import UpcomingPlanPreview from '@/components/home/UpcomingPlanPreview'
import DailyConnectionPrompt from '@/components/home/DailyConnectionPrompt'
import { motion } from 'framer-motion'

export default function RootPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const { loadAppState, coupleId, currentUserId, profiles } = useAppStore()

  useEffect(() => {
    const checkOnboarding = async () => {
      await loadAppState()
      const state = await persistence.getAppState()
      
      if (!state || !state.coupleId) {
        setNeedsOnboarding(true)
      }
      setIsLoading(false)
    }

    checkOnboarding()
  }, [loadAppState])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  if (needsOnboarding || !coupleId) {
    return <OnboardingFlow />
  }

  // Render home tab if we have a couple
  const currentUser = currentUserId ? profiles[currentUserId] : null
  const userName = currentUser?.name || 'there'

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Greeting name={userName} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <RelationshipPulseCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
        >
          <PetStatus />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <UpcomingPlanPreview />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
        >
          <DailyConnectionPrompt />
        </motion.div>
      </div>
    </AppLayout>
  )
}
