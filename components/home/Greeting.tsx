'use client'

import { format } from 'date-fns'

interface GreetingProps {
  name: string
}

export default function Greeting({ name }: GreetingProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div>
      <h1 className="ios-text-large-title">{getGreeting()}, {name}</h1>
      <p className="ios-text-secondary text-subhead mt-1">
        {format(new Date(), 'EEEE, MMMM d')}
      </p>
    </div>
  )
}

