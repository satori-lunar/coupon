const STORAGE_KEY = 'book-of-moments-redeemed'

export interface RedeemedCoupon {
  id: string
  redeemedAt: string
}

export function getRedeemedCoupons(): RedeemedCoupon[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isCouponRedeemed(couponId: string): boolean {
  const redeemed = getRedeemedCoupons()
  return redeemed.some(c => c.id === couponId)
}

export function getRedeemedDate(couponId: string): string | null {
  const redeemed = getRedeemedCoupons()
  const coupon = redeemed.find(c => c.id === couponId)
  return coupon?.redeemedAt || null
}

export function redeemCoupon(couponId: string): void {
  if (typeof window === 'undefined') return
  
  const redeemed = getRedeemedCoupons()
  
  // Don't allow redeeming twice
  if (redeemed.some(c => c.id === couponId)) return
  
  const newRedeemed: RedeemedCoupon = {
    id: couponId,
    redeemedAt: new Date().toISOString(),
  }
  
  redeemed.push(newRedeemed)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(redeemed))
}

export function clearAllRedeemedCoupons(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

