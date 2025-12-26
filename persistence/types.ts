// Persistence abstraction types

export interface PersistenceAdapter {
  // Profile operations
  saveProfile(profile: any): Promise<void>
  getProfile(profileId: string): Promise<any | null>
  getAllProfiles(): Promise<any[]>

  // Couple operations
  saveCouple(couple: any): Promise<void>
  getCouple(coupleId: string): Promise<any | null>
  getCoupleByCode(code: string): Promise<any | null>

  // Pet operations
  savePet(pet: any): Promise<void>
  getPet(coupleId: string): Promise<any | null>

  // Coupon operations
  saveRedeemedCoupon(coupon: any): Promise<void>
  getRedeemedCoupons(coupleId: string): Promise<any[]>

  // Gift operations
  saveGift(gift: any): Promise<void>
  getGifts(coupleId: string): Promise<any[]>
  updateGift(giftId: string, updates: any): Promise<void>

  // Game operations
  saveGameScore(score: any): Promise<void>
  getGameScores(gameId: string, coupleId: string): Promise<any[]>

  // Journal operations
  saveJournalEntry(entry: any): Promise<void>
  getJournalEntries(coupleId: string): Promise<any[]>
  updateJournalEntry(entryId: string, updates: any): Promise<void>

  // Memory operations
  saveMemory(memory: any): Promise<void>
  getMemories(coupleId: string): Promise<any[]>

  // Achievement operations
  saveAchievement(achievement: any): Promise<void>
  getAchievements(coupleId: string): Promise<any[]>

  // Streak operations
  saveStreak(streak: any): Promise<void>
  getStreak(coupleId: string, type: string): Promise<any | null>

  // Scheduled date operations
  saveScheduledDate(date: any): Promise<void>
  getScheduledDates(coupleId: string): Promise<any[]>
  updateScheduledDate(dateId: string, updates: any): Promise<void>

  // Virtual date room operations
  saveVirtualDateRoom(room: any): Promise<void>
  getVirtualDateRoom(roomId: string): Promise<any | null>
  getVirtualDateRoomByCode(code: string): Promise<any | null>

  // App state operations
  saveAppState(state: any): Promise<void>
  getAppState(): Promise<any | null>

  // Generic operations
  delete(key: string): Promise<void>
  clear(): Promise<void>
}

