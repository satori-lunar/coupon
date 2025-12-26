'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { persistence } from '@/persistence/localStorageAdapter'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
import Dashboard from '@/components/dashboard/Dashboard'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const { loadAppState, coupleId } = useAppStore()

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
      <div className="min-h-screen bg-gradient-to-br from-cream to-blush flex items-center justify-center">
        <div className="text-rose text-2xl font-serif">Loading...</div>
      </div>
    )
  }

  if (needsOnboarding || !coupleId) {
    return <OnboardingFlow />
  }

  return <Dashboard />
}
