'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Sparkles } from 'lucide-react'

const dateIdeas = [
  {
    title: 'Cozy Home Cooking',
    description: 'Cook a new recipe together and enjoy it by candlelight',
    why: 'Perfect for indoor lovers who enjoy quality time',
    steps: [
      'Choose a recipe neither of you have tried',
      'Shop for ingredients together',
      'Cook side by side',
      'Set the table with candles',
      'Enjoy your creation together',
    ],
    virtual: 'Cook the same recipe while video calling',
  },
  {
    title: 'Sunset Picnic',
    description: 'Pack a basket and watch the sunset together',
    why: 'Great for outdoor enthusiasts who love simple moments',
    steps: [
      'Pack favorite snacks and drinks',
      'Find a scenic spot',
      'Arrive 30 minutes before sunset',
      'Spread out a blanket',
      'Enjoy the view together',
    ],
    virtual: 'Have a picnic while video calling from different locations',
  },
  {
    title: 'Creative Workshop',
    description: 'Try a new creative activity together',
    why: 'Ideal for couples who love learning and creating',
    steps: [
      'Choose an activity (painting, pottery, etc.)',
      'Set up your workspace',
      'Follow a tutorial together',
      'Share your creations',
      'Display them at home',
    ],
    virtual: 'Do the same activity while video calling',
  },
]

export default function DateGenerator({ onGenerate }: { onGenerate: (date: any) => void }) {
  const { profiles, currentUserId } = useAppStore()
  const [isGenerating, setIsGenerating] = useState(false)

  const generateDate = () => {
    setIsGenerating(true)
    // Simulate personalized date generation
    setTimeout(() => {
      const randomDate = dateIdeas[Math.floor(Math.random() * dateIdeas.length)]
      onGenerate({
        ...randomDate,
        id: Date.now().toString(),
      })
      setIsGenerating(false)
    }, 800)
  }

  return (
    <div className="ios-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-accent" />
        <h2 className="ios-text-title-3">Generate a Date</h2>
      </div>
      <p className="ios-text-secondary text-subhead mb-4">
        Get a personalized date idea based on both your preferences
      </p>
      <button
        onClick={generateDate}
        disabled={isGenerating}
        className="ios-button-primary w-full"
      >
        {isGenerating ? 'Generating...' : 'Generate Date Idea'}
      </button>
    </div>
  )
}

