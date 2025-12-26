// localStorage-based persistence adapter
// This is the default implementation. To use Supabase, swap this with supabaseAdapter.ts

import { PersistenceAdapter } from './types'

const STORAGE_PREFIX = 'couples-app-'

class LocalStoragePersistence implements PersistenceAdapter {
  private getKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`
  }

  private async save(key: string, data: any): Promise<void> {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  private async load<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(this.getKey(key))
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      return null
    }
  }

  private async loadArray<T>(key: string): Promise<T[]> {
    const data = await this.load<T[]>(key)
    return data || []
  }

  // Profile operations
  async saveProfile(profile: any): Promise<void> {
    const profiles = await this.loadArray<any>('profiles')
    const index = profiles.findIndex((p: any) => p.id === profile.id)
    if (index >= 0) {
      profiles[index] = { ...profiles[index], ...profile, updatedAt: new Date().toISOString() }
    } else {
      profiles.push({ ...profile, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    }
    await this.save('profiles', profiles)
  }

  async getProfile(profileId: string): Promise<any | null> {
    const profiles = await this.loadArray<any>('profiles')
    return profiles.find((p: any) => p.id === profileId) || null
  }

  async getAllProfiles(): Promise<any[]> {
    return this.loadArray<any>('profiles')
  }

  // Couple operations
  async saveCouple(couple: any): Promise<void> {
    const couples = await this.loadArray<any>('couples')
    const index = couples.findIndex((c: any) => c.id === couple.id)
    if (index >= 0) {
      couples[index] = { ...couples[index], ...couple, updatedAt: new Date().toISOString() }
    } else {
      couples.push({ ...couple, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    }
    await this.save('couples', couples)
  }

  async getCouple(coupleId: string): Promise<any | null> {
    const couples = await this.loadArray<any>('couples')
    return couples.find((c: any) => c.id === coupleId) || null
  }

  async getCoupleByCode(code: string): Promise<any | null> {
    const couples = await this.loadArray<any>('couples')
    return couples.find((c: any) => c.pairCode === code) || null
  }

  // Pet operations
  async savePet(pet: any): Promise<void> {
    await this.save(`pet-${pet.coupleId}`, { ...pet, updatedAt: new Date().toISOString() })
  }

  async getPet(coupleId: string): Promise<any | null> {
    return this.load(`pet-${coupleId}`)
  }

  // Coupon operations
  async saveRedeemedCoupon(coupon: any): Promise<void> {
    const redeemed = await this.loadArray<any>('redeemed-coupons')
    redeemed.push({ ...coupon, redeemedAt: new Date().toISOString() })
    await this.save('redeemed-coupons', redeemed)
  }

  async getRedeemedCoupons(coupleId: string): Promise<any[]> {
    const redeemed = await this.loadArray<any>('redeemed-coupons')
    return redeemed.filter((c: any) => c.coupleId === coupleId)
  }

  // Gift operations
  async saveGift(gift: any): Promise<void> {
    const gifts = await this.loadArray<any>('gifts')
    gifts.push({ ...gift, sentAt: new Date().toISOString() })
    await this.save('gifts', gifts)
  }

  async getGifts(coupleId: string): Promise<any[]> {
    const gifts = await this.loadArray<any>('gifts')
    return gifts.filter((g: any) => g.coupleId === coupleId)
  }

  async updateGift(giftId: string, updates: any): Promise<void> {
    const gifts = await this.loadArray<any>('gifts')
    const index = gifts.findIndex((g: any) => g.id === giftId)
    if (index >= 0) {
      gifts[index] = { ...gifts[index], ...updates }
      await this.save('gifts', gifts)
    }
  }

  // Game operations
  async saveGameScore(score: any): Promise<void> {
    const scores = await this.loadArray<any>('game-scores')
    scores.push({ ...score, playedAt: new Date().toISOString() })
    // Keep only top 100 scores per game
    const gameScores = scores.filter((s: any) => s.gameId === score.gameId).sort((a: any, b: any) => b.score - a.score).slice(0, 100)
    const otherScores = scores.filter((s: any) => s.gameId !== score.gameId)
    await this.save('game-scores', [...otherScores, ...gameScores])
  }

  async getGameScores(gameId: string, coupleId: string): Promise<any[]> {
    const scores = await this.loadArray<any>('game-scores')
    return scores.filter((s: any) => s.gameId === gameId && s.coupleId === coupleId).sort((a: any, b: any) => b.score - a.score)
  }

  // Journal operations
  async saveJournalEntry(entry: any): Promise<void> {
    const entries = await this.loadArray<any>('journal-entries')
    const index = entries.findIndex((e: any) => e.id === entry.id)
    if (index >= 0) {
      entries[index] = { ...entries[index], ...entry, updatedAt: new Date().toISOString() }
    } else {
      entries.push({ ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    }
    await this.save('journal-entries', entries)
  }

  async getJournalEntries(coupleId: string): Promise<any[]> {
    const entries = await this.loadArray<any>('journal-entries')
    return entries.filter((e: any) => e.coupleId === coupleId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async updateJournalEntry(entryId: string, updates: any): Promise<void> {
    const entries = await this.loadArray<any>('journal-entries')
    const index = entries.findIndex((e: any) => e.id === entryId)
    if (index >= 0) {
      entries[index] = { ...entries[index], ...updates, updatedAt: new Date().toISOString() }
      await this.save('journal-entries', entries)
    }
  }

  // Memory operations
  async saveMemory(memory: any): Promise<void> {
    const memories = await this.loadArray<any>('memories')
    memories.push({ ...memory, createdAt: new Date().toISOString() })
    await this.save('memories', memories)
  }

  async getMemories(coupleId: string): Promise<any[]> {
    const memories = await this.loadArray<any>('memories')
    return memories.filter((m: any) => m.coupleId === coupleId).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Achievement operations
  async saveAchievement(achievement: any): Promise<void> {
    const achievements = await this.loadArray<any>('achievements')
    achievements.push({ ...achievement, unlockedAt: new Date().toISOString() })
    await this.save('achievements', achievements)
  }

  async getAchievements(coupleId: string): Promise<any[]> {
    const achievements = await this.loadArray<any>('achievements')
    return achievements.filter((a: any) => a.coupleId === coupleId).sort((a: any, b: any) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
  }

  // Streak operations
  async saveStreak(streak: any): Promise<void> {
    await this.save(`streak-${streak.coupleId}-${streak.type}`, streak)
  }

  async getStreak(coupleId: string, type: string): Promise<any | null> {
    return this.load(`streak-${coupleId}-${type}`)
  }

  // Scheduled date operations
  async saveScheduledDate(date: any): Promise<void> {
    const dates = await this.loadArray<any>('scheduled-dates')
    const index = dates.findIndex((d: any) => d.id === date.id)
    if (index >= 0) {
      dates[index] = { ...dates[index], ...date }
    } else {
      dates.push(date)
    }
    await this.save('scheduled-dates', dates)
  }

  async getScheduledDates(coupleId: string): Promise<any[]> {
    const dates = await this.loadArray<any>('scheduled-dates')
    return dates.filter((d: any) => d.coupleId === coupleId).sort((a: any, b: any) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
  }

  async updateScheduledDate(dateId: string, updates: any): Promise<void> {
    const dates = await this.loadArray<any>('scheduled-dates')
    const index = dates.findIndex((d: any) => d.id === dateId)
    if (index >= 0) {
      dates[index] = { ...dates[index], ...updates }
      await this.save('scheduled-dates', dates)
    }
  }

  // Virtual date room operations
  async saveVirtualDateRoom(room: any): Promise<void> {
    await this.save(`virtual-room-${room.id}`, room)
  }

  async getVirtualDateRoom(roomId: string): Promise<any | null> {
    return this.load(`virtual-room-${roomId}`)
  }

  async getVirtualDateRoomByCode(code: string): Promise<any | null> {
    // For localStorage, we need to search through all rooms
    // In production with Supabase, this would be a proper query
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.getKey('virtual-room-')))
    for (const key of keys) {
      const room: any = await this.load(key.replace(this.getKey(''), ''))
      if (room && room.shareCode === code) {
        return room
      }
    }
    return null
  }

  // App state operations
  async saveAppState(state: any): Promise<void> {
    await this.save('app-state', state)
  }

  async getAppState(): Promise<any | null> {
    return this.load('app-state')
  }

  // Generic operations
  async delete(key: string): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.getKey(key))
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return
    const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_PREFIX))
    keys.forEach(key => localStorage.removeItem(key))
  }
}

export const persistence = new LocalStoragePersistence()

