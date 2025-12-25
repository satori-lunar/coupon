const MEMORIES_KEY = 'book-of-moments-memories'

export interface Memory {
  couponId: string
  photos: string[] // base64 encoded images
  videos: string[] // base64 encoded videos or URLs
  notes: string
  createdAt: string
  updatedAt: string
}

export function getMemories(): Record<string, Memory> {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(MEMORIES_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export function getMemory(couponId: string): Memory | null {
  const memories = getMemories()
  return memories[couponId] || null
}

export function saveMemory(couponId: string, memory: Partial<Memory>): void {
  if (typeof window === 'undefined') return
  
  const memories = getMemories()
  const existing = memories[couponId]
  
  const newMemory: Memory = {
    couponId,
    photos: memory.photos || existing?.photos || [],
    videos: memory.videos || existing?.videos || [],
    notes: memory.notes || existing?.notes || '',
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  memories[couponId] = newMemory
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories))
}

export function addPhoto(couponId: string, photoBase64: string): void {
  const memory = getMemory(couponId) || { photos: [], videos: [], notes: '' }
  memory.photos = [...(memory.photos || []), photoBase64]
  saveMemory(couponId, memory)
}

export function addVideo(couponId: string, videoBase64: string): void {
  const memory = getMemory(couponId) || { photos: [], videos: [], notes: '' }
  memory.videos = [...(memory.videos || []), videoBase64]
  saveMemory(couponId, memory)
}

export function updateNotes(couponId: string, notes: string): void {
  saveMemory(couponId, { notes })
}

export function deletePhoto(couponId: string, photoIndex: number): void {
  const memory = getMemory(couponId)
  if (!memory) return
  
  const newPhotos = memory.photos.filter((_, i) => i !== photoIndex)
  saveMemory(couponId, { photos: newPhotos })
}

export function deleteVideo(couponId: string, videoIndex: number): void {
  const memory = getMemory(couponId)
  if (!memory) return
  
  const newVideos = memory.videos.filter((_, i) => i !== videoIndex)
  saveMemory(couponId, { videos: newVideos })
}

export function getAllMemories(): Memory[] {
  const memories = getMemories()
  return Object.values(memories)
}

