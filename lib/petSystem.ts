// Pet system logic - hunger, happiness, leveling

import type { Pet } from '@/types'
import { persistence } from '@/persistence/localStorageAdapter'

export const PET_CONFIG = {
  MAX_HUNGER: 100,
  MAX_HAPPINESS: 100,
  HUNGER_DECAY_PER_HOUR: 2, // Pet gets hungrier over time
  HAPPINESS_DECAY_PER_HOUR: 1,
  EXPERIENCE_PER_ACTIVITY: 10,
  EXPERIENCE_FOR_LEVEL: (level: number) => level * 50, // Level 1 = 50 XP, Level 2 = 100 XP, etc.
  FOOD_PER_FEEDING: 30,
  HAPPINESS_PER_PLAY: 20,
}

export interface PetActivity {
  type: 'date' | 'game' | 'journal' | 'gift' | 'feed' | 'play'
  timestamp: string
}

/**
 * Calculate pet's current hunger based on last fed time
 */
export function calculateHunger(pet: Pet): number {
  if (!pet.lastFedAt) return PET_CONFIG.MAX_HUNGER

  const hoursSinceFed = (Date.now() - new Date(pet.lastFedAt).getTime()) / (1000 * 60 * 60)
  const hunger = Math.max(0, pet.hunger - hoursSinceFed * PET_CONFIG.HUNGER_DECAY_PER_HOUR)
  return Math.min(PET_CONFIG.MAX_HUNGER, Math.max(0, hunger))
}

/**
 * Calculate pet's current happiness based on last played time
 */
export function calculateHappiness(pet: Pet): number {
  if (!pet.lastPlayedAt) return PET_CONFIG.MAX_HAPPINESS

  const hoursSincePlayed = (Date.now() - new Date(pet.lastPlayedAt).getTime()) / (1000 * 60 * 60)
  const happiness = Math.max(0, pet.happiness - hoursSincePlayed * PET_CONFIG.HAPPINESS_DECAY_PER_HOUR)
  return Math.min(PET_CONFIG.MAX_HAPPINESS, Math.max(0, happiness))
}

/**
 * Feed the pet - increases hunger
 */
export async function feedPet(pet: Pet): Promise<Pet> {
  const newHunger = Math.min(PET_CONFIG.MAX_HUNGER, pet.hunger + PET_CONFIG.FOOD_PER_FEEDING)
  const updatedPet: Pet = {
    ...pet,
    hunger: newHunger,
    lastFedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await persistence.savePet(updatedPet)
  return updatedPet
}

/**
 * Play with the pet - increases happiness
 */
export async function playWithPet(pet: Pet): Promise<Pet> {
  const newHappiness = Math.min(PET_CONFIG.MAX_HAPPINESS, pet.happiness + PET_CONFIG.HAPPINESS_PER_PLAY)
  const updatedPet: Pet = {
    ...pet,
    happiness: newHappiness,
    lastPlayedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await persistence.savePet(updatedPet)
  return updatedPet
}

/**
 * Record an activity and award experience
 * Returns updated pet and whether it leveled up
 */
export async function recordActivity(
  pet: Pet,
  activityType: PetActivity['type']
): Promise<{ pet: Pet; leveledUp: boolean; newLevel?: number }> {
  const oldLevel = pet.level
  const newExperience = pet.experience + PET_CONFIG.EXPERIENCE_PER_ACTIVITY
  const experienceNeeded = PET_CONFIG.EXPERIENCE_FOR_LEVEL(pet.level + 1)
  
  let newLevel = pet.level
  let leveledUp = false

  if (newExperience >= experienceNeeded) {
    newLevel = pet.level + 1
    leveledUp = true
  }

  // Update hunger and happiness based on activity
  let newHunger = calculateHunger(pet)
  let newHappiness = calculateHappiness(pet)

  // Activities give small boosts
  if (activityType === 'date' || activityType === 'game') {
    newHappiness = Math.min(PET_CONFIG.MAX_HAPPINESS, newHappiness + 5)
  }

  const updatedPet: Pet = {
    ...pet,
    level: newLevel,
    experience: newExperience,
    hunger: newHunger,
    happiness: newHappiness,
    updatedAt: new Date().toISOString(),
  }

  await persistence.savePet(updatedPet)

  return {
    pet: updatedPet,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
  }
}

/**
 * Get pet status message
 */
export function getPetStatus(pet: Pet): { status: string; emoji: string; needsAttention: boolean } {
  const hunger = calculateHunger(pet)
  const happiness = calculateHappiness(pet)

  if (hunger < 20) {
    return { status: 'Very hungry', emoji: '😟', needsAttention: true }
  }
  if (happiness < 20) {
    return { status: 'Feeling lonely', emoji: '😔', needsAttention: true }
  }
  if (hunger < 50 || happiness < 50) {
    return { status: 'Could use some care', emoji: '😐', needsAttention: true }
  }
  if (pet.level >= 5) {
    return { status: 'Thriving!', emoji: '🌟', needsAttention: false }
  }
  return { status: 'Happy and healthy', emoji: '😊', needsAttention: false }
}

/**
 * Create a new pet
 */
export function createPet(
  coupleId: string,
  species: Pet['species'],
  name: string
): Pet {
  return {
    id: `pet-${Date.now()}`,
    coupleId,
    species,
    name,
    level: 1,
    experience: 0,
    hunger: PET_CONFIG.MAX_HUNGER,
    happiness: PET_CONFIG.MAX_HAPPINESS,
    lastFedAt: new Date().toISOString(),
    lastPlayedAt: new Date().toISOString(),
    unlockedAnimations: [],
    unlockedBackgrounds: ['default'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

