// Streak tracking system

import { persistence } from '@/persistence/localStorageAdapter'
import type { Streak } from '@/types'

export async function updateStreak(
  coupleId: string,
  type: Streak['type']
): Promise<Streak> {
  const existing = await persistence.getStreak(coupleId, type)
  const today = new Date().toISOString().split('T')[0]
  
  if (!existing) {
    const newStreak: Streak = {
      coupleId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
      type,
    }
    await persistence.saveStreak(newStreak)
    return newStreak
  }

  const lastDate = existing.lastActivityDate.split('T')[0]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let currentStreak = existing.currentStreak
  let longestStreak = existing.longestStreak

  if (lastDate === today) {
    // Already counted today
    return existing
  } else if (lastDate === yesterdayStr) {
    // Continuing streak
    currentStreak += 1
    longestStreak = Math.max(longestStreak, currentStreak)
  } else {
    // Streak broken, start over
    currentStreak = 1
  }

  const updated: Streak = {
    ...existing,
    currentStreak,
    longestStreak,
    lastActivityDate: today,
  }

  await persistence.saveStreak(updated)
  return updated
}

export async function getStreak(
  coupleId: string,
  type: Streak['type']
): Promise<Streak | null> {
  return persistence.getStreak(coupleId, type)
}

