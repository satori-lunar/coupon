# Together - Relationship Growth App

A modern, iOS-inspired relationship app for couples built with Next.js, TypeScript, and Tailwind CSS. This app focuses on relationship growth through meaningful connections, personalized dates, and shared experiences.

## 🎨 Design Philosophy

This app is designed to feel like a **native iOS app**, not a website. It follows Apple Human Interface Guidelines with:

- **Calm, polished UI** with soft colors and generous spacing
- **Card-based layouts** with subtle shadows
- **Bottom tab navigation** (native mobile pattern)
- **Subtle animations** (150-250ms transitions)
- **System font stack** for that native feel
- **Mobile-first design** optimized for iPhone viewport

## 🏗️ Architecture

### Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (iOS-inspired design system)
- **Framer Motion** (subtle animations)
- **Zustand** (state management)
- **localStorage** (default persistence, ready for Supabase)

### App Structure

```
app/
├── (tabs)/          # Tab navigation routes
│   ├── page.tsx     # Home tab
│   ├── connect/     # Connect tab
│   ├── dates/       # Dates tab
│   ├── play/        # Play tab
│   └── more/        # More tab
├── layout.tsx       # Root layout
└── page.tsx         # Entry point (onboarding/router)

components/
├── navigation/      # Tab bar & app layout
├── home/            # Home tab components
├── connect/         # Connect tab components
├── dates/           # Dates tab components
├── play/            # Play tab components
├── more/            # More tab components
└── onboarding/      # Onboarding flow

lib/
├── store.ts         # Zustand state management
└── ...

persistence/
└── localStorageAdapter.ts  # Default storage (swap for Supabase)
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 📱 Features

### Home Tab
- **Greeting** with time-based message
- **Relationship Pulse** - Daily mood check-ins
- **Pet Status** - Companion animal happiness
- **Upcoming Plans** - Next scheduled date preview
- **Daily Connection Prompt** - One question per day

### Connect Tab
- **Conversation Starters** - Deep, gentle questions
- **Weekly Reflection** - Reflect on your week together
- **Shared Journal** - Private journal entries

### Dates Tab
- **Personalized Date Generator** - AI-style date suggestions
- **In-Person & Virtual** modes
- **Step-by-step guides** for each date
- **Schedule & Save** dates

### Play Tab
- **Memory Match** - Co-play memory game
- **Tap to Fly** - Simple Flappy-style game
- **Decision Spinner** - Let chance decide

### More Tab
- **Moments** - Reframed coupon system (sentimental gestures)
- **Virtual Gifts** - Letters, playlists, voice notes, recipes
- **Memories Timeline** - Shared memory gallery
- **Settings** - Accessibility & preferences

## 🎨 Design System

### Colors
- **Background**: `#F9F9F9` (soft neutral)
- **Card**: `#FFFFFF` (white)
- **Accent**: `#FF6B9D` (rose/blush)
- **Text**: Black with opacity levels (primary, secondary, tertiary)

### Typography
Uses iOS-style font sizing:
- Large Title: 34px
- Title 1-3: 28px, 22px, 20px
- Body: 17px
- Subhead: 15px
- Caption: 12px, 11px

### Spacing
iOS-inspired spacing scale with generous padding and rounded corners (16-20px radius).

### Motion
- Duration: 200ms (iOS standard)
- Easing: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- Subtle fade/slide transitions only

## 🔧 Customization

### Personalizing Content

1. **Date Ideas**: Edit `components/dates/DateGenerator.tsx` to add more date suggestions
2. **Conversation Starters**: Edit `components/connect/ConversationStarters.tsx`
3. **Daily Prompts**: Edit `components/home/DailyConnectionPrompt.tsx`
4. **Pet Options**: Edit `components/onboarding/PetSelectionStep.tsx`

### Adding Supabase

To switch from localStorage to Supabase:

1. Update `persistence/localStorageAdapter.ts` or create `supabaseAdapter.ts`
2. Update `lib/store.ts` to use the new adapter
3. Add environment variables for Supabase credentials

See `persistence/types.ts` for the adapter interface.

## 📝 Notes

- **Mobile-first**: Designed for iPhone viewport (375px width)
- **Accessibility**: Includes reduced motion and high contrast options
- **Privacy**: All data stored locally by default (no external APIs)
- **Onboarding**: Clean, step-by-step flow with partner pairing via code

## 🎯 Core Principles

1. **Feels like a native app**, not a website
2. **Calm and emotionally safe** design
3. **Relationship growth** over gimmicks
4. **Thoughtful interactions** with subtle motion
5. **Apple-quality** polish and attention to detail

## 📄 License

MIT

---

Built with ❤️ for couples who want to grow together.
