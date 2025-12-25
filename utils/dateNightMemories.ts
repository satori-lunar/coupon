const DATE_NIGHT_MEMORIES_KEY = 'book-of-moments-date-night-memories'

export interface DateNightMemory {
  dateNightId: string
  photos: string[] // base64 encoded images
  videos: string[] // base64 encoded videos or URLs
  notes: string
  completedAt: string
  createdAt: string
  updatedAt: string
}

export function getDateNightMemories(): Record<string, DateNightMemory> {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(DATE_NIGHT_MEMORIES_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function getDateNightMemory(dateNightId: string): DateNightMemory | null {
  const memories = getDateNightMemories()
  return memories[dateNightId] || null
}

export function saveDateNightMemory(dateNightId: string, memory: Partial<DateNightMemory>): void {
  if (typeof window === 'undefined') return
  
  const memories = getDateNightMemories()
  const existing = memories[dateNightId]
  
  const newMemory: DateNightMemory = {
    dateNightId,
    photos: memory.photos || existing?.photos || [],
    videos: memory.videos || existing?.videos || [],
    notes: memory.notes || existing?.notes || '',
    completedAt: memory.completedAt || existing?.completedAt || new Date().toISOString(),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  memories[dateNightId] = newMemory
  localStorage.setItem(DATE_NIGHT_MEMORIES_KEY, JSON.stringify(memories))
}

export function addDateNightPhoto(dateNightId: string, photoBase64: string): void {
  const memory = getDateNightMemory(dateNightId) || { photos: [], videos: [], notes: '' }
  memory.photos = [...(memory.photos || []), photoBase64]
  saveDateNightMemory(dateNightId, memory)
}

export function addDateNightVideo(dateNightId: string, videoBase64: string): void {
  const memory = getDateNightMemory(dateNightId) || { photos: [], videos: [], notes: '' }
  memory.videos = [...(memory.videos || []), videoBase64]
  saveDateNightMemory(dateNightId, memory)
}

export function updateDateNightNotes(dateNightId: string, notes: string): void {
  saveDateNightMemory(dateNightId, { notes })
}

export function deleteDateNightPhoto(dateNightId: string, photoIndex: number): void {
  const memory = getDateNightMemory(dateNightId)
  if (!memory) return
  
  const newPhotos = memory.photos.filter((_, i) => i !== photoIndex)
  saveDateNightMemory(dateNightId, { photos: newPhotos })
}

export function deleteDateNightVideo(dateNightId: string, videoIndex: number): void {
  const memory = getDateNightMemory(dateNightId)
  if (!memory) return
  
  const newVideos = memory.videos.filter((_, i) => i !== videoIndex)
  saveDateNightMemory(dateNightId, { videos: newVideos })
}

export function getAllDateNightMemories(): DateNightMemory[] {
  const memories = getDateNightMemories()
  return Object.values(memories)
}
