'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { persistence } from '@/persistence/localStorageAdapter'
import type { Profile } from '@/types'
import WelcomeStep from './WelcomeStep'
import ProfileStep from './ProfileStep'
import PairingStep from './PairingStep'
import PetSelectionStep from './PetSelectionStep'
import { createPet } from '@/lib/petSystem'

type Step = 'welcome' | 'profile1' | 'profile2' | 'pairing' | 'pet' | 'complete'

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>('welcome')
  const [profile1, setProfile1] = useState<Partial<Profile>>({})
  const [profile2, setProfile2] = useState<Partial<Profile>>({})
  const [pairCode, setPairCode] = useState<string>('')
  const [petSpecies, setPetSpecies] = useState<'cat' | 'dog' | 'rabbit' | 'bird' | 'hamster'>('cat')
  const [petName, setPetName] = useState('')
  
  const { setCurrentUser, setCouple, addProfile, setPet, setCoins } = useAppStore()
  const router = useRouter()

  const generatePairCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleProfile1Complete = (profile: Profile) => {
    setProfile1(profile)
    setStep('profile2')
  }

  const handleProfile2Complete = (profile: Profile) => {
    setProfile2(profile)
    setStep('pairing')
  }

  const handlePairingComplete = async (code?: string) => {
    if (code) {
      // Joining existing couple
      const couple = await persistence.getCoupleByCode(code)
      if (couple) {
        const updatedCouple = {
          ...couple,
          partner2Id: profile2.id!,
          updatedAt: new Date().toISOString(),
        }
        await persistence.saveCouple(updatedCouple)
        await addProfile(profile2 as Profile)
        setCurrentUser(profile2.id!)
        setCouple(updatedCouple)
        setPairCode(couple.pairCode)
        setStep('pet')
      } else {
        alert('Couple not found. Please check the code and try again.')
      }
    } else {
      // Creating new couple
      const newCode = generatePairCode()
      const couple = {
        id: `couple-${Date.now()}`,
        partner1Id: profile1.id!,
        partner2Id: profile2.id!,
        pairCode: newCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      await persistence.saveCouple(couple)
      await addProfile(profile1 as Profile)
      await addProfile(profile2 as Profile)
      setCurrentUser(profile1.id!)
      setCouple(couple)
      setPairCode(newCode)
      setStep('pet')
    }
  }

  const handlePetComplete = async () => {
    try {
      const { couple } = useAppStore.getState()
      if (!couple) {
        if (pairCode) {
          const coupleByCode = await persistence.getCoupleByCode(pairCode)
          if (coupleByCode) {
            const pet = createPet(coupleByCode.id, petSpecies, petName)
            await persistence.savePet(pet)
            setPet(pet)
            setCoins(100)
            setStep('complete')
            return
          }
        }
        alert('Error: Couple not found. Please try again.')
        return
      }
      
      const pet = createPet(couple.id, petSpecies, petName)
      await persistence.savePet(pet)
      setPet(pet)
      setCoins(100)
      setStep('complete')
    } catch (error) {
      console.error('Error completing pet setup:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleComplete = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <WelcomeStep key="welcome" onNext={() => setStep('profile1')} />
          )}
          {step === 'profile1' && (
            <ProfileStep
              key="profile1"
              profileNumber={1}
              onComplete={handleProfile1Complete}
            />
          )}
          {step === 'profile2' && (
            <ProfileStep
              key="profile2"
              profileNumber={2}
              onComplete={handleProfile2Complete}
            />
          )}
          {step === 'pairing' && (
            <PairingStep
              key="pairing"
              pairCode={pairCode}
              onComplete={handlePairingComplete}
            />
          )}
          {step === 'pet' && (
            <PetSelectionStep
              key="pet"
              onComplete={handlePetComplete}
              petSpecies={petSpecies}
              setPetSpecies={setPetSpecies}
              petName={petName}
              setPetName={setPetName}
            />
          )}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="ios-card p-8 text-center"
            >
              <div className="text-6xl mb-4">✨</div>
              <h1 className="ios-text-large-title mb-2">Welcome!</h1>
              <p className="ios-text-body text-text-secondary mb-8">
                Your journey together begins now.
              </p>
              <button
                onClick={handleComplete}
                className="ios-button-primary w-full"
              >
                Get Started
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
