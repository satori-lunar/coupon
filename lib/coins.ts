// Couple coins system - earning and spending

import { persistence } from '@/persistence/localStorageAdapter'

export const COIN_REWARDS = {
  COMPLETE_DATE: 50,
  REDEEM_COUPON: 30,
  PLAY_GAME: 20,
  JOURNAL_ENTRY: 15,
  SEND_GIFT: 10, // Small reward for giving
  STREAK_BONUS: 25, // Bonus for maintaining streaks
  PET_LEVEL_UP: 100,
  ACHIEVEMENT: 50,
}

export const GIFT_COSTS = {
  flower: 20,
  playlist: 15,
  'voice-note': 25,
  recipe: 30,
  video: 40,
  coupon: 50,
  animation: 35,
}

/**
 * Award coins for an activity
 */
export async function awardCoins(
  coupleId: string,
  amount: number,
  reason: string
): Promise<void> {
  // In a real app, this would update a coins balance in the database
  // For now, we'll track it in app state
  const appState = await persistence.getAppState()
  const currentCoins = appState?.coins || 0
  await persistence.saveAppState({
    ...appState,
    coins: currentCoins + amount,
  })
}

/**
 * Spend coins (returns true if successful, false if insufficient)
 */
export async function spendCoins(
  coupleId: string,
  amount: number
): Promise<boolean> {
  const appState = await persistence.getAppState()
  const currentCoins = appState?.coins || 0
  
  if (currentCoins < amount) {
    return false
  }

  await persistence.saveAppState({
    ...appState,
    coins: currentCoins - amount,
  })
  return true
}

/**
 * Get current coin balance
 */
export async function getCoins(coupleId: string): Promise<number> {
  const appState = await persistence.getAppState()
  return appState?.coins || 0
}

