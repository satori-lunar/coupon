export interface Coupon {
  id: string
  title: string
  description: string
  icon?: string
}

export const coupons: Coupon[] = [
  {
    id: 'museum-at-home',
    title: 'Museum at Home',
    description:
      'A night where we turn our space into a quiet gallery — art, candles, music, and time to wander through beauty together.',
  },
  {
    id: 'silence-and-touch',
    title: 'Silence & Touch',
    description:
      'A slow, intentional massage with no phones, no talking, and no rushing. Just presence and care.',
  },
  {
    id: 'directors-cut-movie-night',
    title: "Director's Cut Movie Night",
    description:
      'You choose the romance movie. I handle the atmosphere, the snacks, and being fully present beside you.',
  },
  {
    id: 'you-lead-i-follow',
    title: 'You Lead, I Follow',
    description:
      'A day where you decide everything — the pace, the plans, the vibe — and I follow joyfully.',
  },
  {
    id: 'ask-me-anything',
    title: 'Ask Me Anything',
    description:
      'An evening where you can ask anything, share anything, and know you are heard without fixing or defending.',
  },
  {
    id: 'recovery-day',
    title: 'Recovery Day',
    description:
      'A guilt-free rest day where I take care of everything so you can simply be.',
  },
  {
    id: 'letter-from-the-future',
    title: 'Letter From the Future',
    description:
      "A handwritten letter from me to you, dated years from now, reminding you of who you are and how deeply you're loved.",
  },
]

