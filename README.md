# Couples App - A Book of Moments

A romantic, playful, and deeply personal couples relationship app built with Next.js 14. This app evolves the "A Book of Moments" coupon book into a full couple-first product with date night generation, virtual gifts, an in-app pet, mini-games, journaling, and more.

## ✨ Features

### Core Features
- **Onboarding Flow**: Create profiles for both partners with personality questionnaires
- **Date Night Generator**: AI-powered date suggestions tailored to both partners' preferences
- **Coupon Book**: Digital flipbook with redeemable romantic moments
- **Virtual Gifts**: Send gifts using earned coins (flowers, playlists, voice notes, etc.)
- **In-App Pet**: A pet that grows and thrives as you complete activities together
- **Mini-Games**: Playful games to enjoy together (Flappy Love, Memory Match)
- **Journal**: Private and shared journal entries with mood tracking
- **Memories Timeline**: View all your shared moments and experiences
- **Streaks & Achievements**: Track your consistency and celebrate milestones
- **Coins System**: Earn coins through activities, spend on gifts

### Technical Features
- **Persistence Abstraction**: Easy swap between localStorage (default) and Supabase
- **Mobile-First Design**: Optimized for touch and swipe interactions
- **Accessibility**: Large font toggle, keyboard navigation, ARIA labels
- **PWA Ready**: Can be installed as a progressive web app
- **TypeScript**: Full type safety throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd coupon
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
coupon/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main dashboard/home
│   ├── dates/             # Date generator page
│   ├── coupons/           # Coupon book page
│   ├── games/             # Mini-games page
│   ├── gifts/             # Virtual gifts store
│   ├── journal/           # Journal entries
│   ├── memories/          # Memories timeline
│   └── settings/          # App settings
├── components/            # React components
│   ├── onboarding/       # Onboarding flow components
│   ├── dashboard/        # Dashboard components
│   └── pages/            # Page components
├── games/                # Mini-game components
├── lib/                  # Core logic
│   ├── store.ts          # Zustand state management
│   ├── dateGenerator.ts  # Date matching algorithm
│   ├── petSystem.ts      # Pet logic
│   ├── coins.ts          # Currency system
│   └── streaks.ts        # Streak tracking
├── persistence/          # Data persistence layer
│   ├── localStorageAdapter.ts  # Default: localStorage
│   └── supabaseAdapter.ts       # Optional: Supabase
├── types/                # TypeScript type definitions
├── data/                 # Static data (coupons, date templates)
└── config/               # Configuration files
```

## 🎨 Customization

### Personalization

1. **Names & Pronouns**: Set during onboarding, stored in profiles
2. **Coupons**: Edit `data/coupons.ts` to add/modify coupon content
3. **Date Templates**: Edit `data/dateTemplates.ts` to customize date suggestions
4. **Colors**: Adjust palette in `tailwind.config.js`
5. **Fonts**: Modify font imports in `app/layout.tsx`

### Adding New Features

The app is designed to be easily extensible:

- **New Games**: Add components in `games/` and register in `app/games/page.tsx`
- **New Gift Types**: Add to `GIFT_COSTS` in `lib/coins.ts` and update `app/gifts/page.tsx`
- **New Date Categories**: Add templates to `data/dateTemplates.ts` with proper tags

## 🔄 Switching to Supabase

The app uses localStorage by default, but is architected to easily swap to Supabase:

1. **Install Supabase**:
```bash
npm install @supabase/supabase-js
```

2. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

3. **Set Environment Variables**:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. **Update Persistence**:
   - Uncomment and implement `persistence/supabaseAdapter.ts`
   - Update `lib/store.ts` to import from `supabaseAdapter` instead of `localStorageAdapter`

5. **Create Database Tables**:
   See `persistence/supabaseAdapter.ts` for table structure requirements

## 🚢 Deployment to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Environment Variables** (if using Supabase):
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard

The app is production-ready and will deploy automatically!

## 🎮 How to Use

### First Time Setup

1. **Onboarding**: Both partners create profiles with interests and preferences
2. **Pairing**: One partner creates a pair code, the other joins with the code
3. **Pet Selection**: Choose a pet species and name
4. **Start Exploring**: Use the dashboard to navigate features

### Daily Usage

- **Generate Dates**: Get 3 personalized date suggestions based on your preferences
- **Redeem Coupons**: Flip through the coupon book and redeem moments
- **Play Games**: Earn coins and have fun together
- **Journal**: Write entries (private or shared) about your experiences
- **Send Gifts**: Use earned coins to send virtual gifts to your partner
- **Care for Pet**: Feed and play with your pet to keep them happy

### Tips

- Complete dates and activities to earn coins
- Maintain streaks for bonus rewards
- Your pet levels up as you spend time together
- Check the daily prompt for conversation starters

## 🧪 Testing

Run tests (when implemented):
```bash
npm test
```

## 📝 Data Persistence

### localStorage (Default)
- All data stored locally in browser
- No backend required
- Data persists across sessions
- **Note**: Data is device-specific

### Supabase (Optional)
- Cloud-based persistence
- Sync across devices
- Real-time updates (when implemented)
- Requires Supabase account

## 🔒 Privacy

- All data is stored locally by default
- No data collection without explicit consent
- Privacy settings in Settings page
- Data export available for backup

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Date Utilities**: date-fns
- **Fonts**: Google Fonts (Dancing Script, Playfair Display, Crimson Text)

## 📄 License

Private project - created with love.

## 💝 Notes for Personalization

This app was designed to be deeply personal. Feel free to:
- Customize all copy and messaging
- Add your own date ideas and coupons
- Modify the color palette to match your preferences
- Add personal photos or artwork
- Adjust the pet system to your liking

The code is well-commented and organized to make customization easy.

---

Built with ❤️ for couples who want to grow together.
