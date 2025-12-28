export interface ImportantDate {
  id: string
  type: 'anniversary' | 'birthday' | 'custom'
  title: string
  date: string // ISO format YYYY-MM-DD
  recurring: boolean
  partnerId?: string
  notes?: string
}

export interface DateReminder {
  dateId: string
  daysUntil: number
  message: string
}

export function getUpcomingDates(dates: ImportantDate[]): ImportantDate[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return dates
    .map(date => {
      const dateObj = new Date(date.date)
      const thisYear = new Date(today.getFullYear(), dateObj.getMonth(), dateObj.getDate())

      // If the date has passed this year and it's recurring, use next year
      if (thisYear < today && date.recurring) {
        thisYear.setFullYear(today.getFullYear() + 1)
      }

      const daysUntil = Math.ceil((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      return { ...date, daysUntil }
    })
    .filter((d: any) => d.daysUntil >= 0 && d.daysUntil <= 90) // Next 90 days
    .sort((a: any, b: any) => a.daysUntil - b.daysUntil)
}

export function getReminders(dates: ImportantDate[]): DateReminder[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const reminders: DateReminder[] = []

  dates.forEach(date => {
    const dateObj = new Date(date.date)
    const thisYear = new Date(today.getFullYear(), dateObj.getMonth(), dateObj.getDate())

    if (thisYear < today && date.recurring) {
      thisYear.setFullYear(today.getFullYear() + 1)
    }

    const daysUntil = Math.ceil((thisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Create reminders at 7 days, 3 days, and day-of
    if (daysUntil === 7) {
      reminders.push({
        dateId: date.id,
        daysUntil: 7,
        message: `${date.title} is coming up in one week!`,
      })
    } else if (daysUntil === 3) {
      reminders.push({
        dateId: date.id,
        daysUntil: 3,
        message: `${date.title} is in 3 days - time to plan!`,
      })
    } else if (daysUntil === 0) {
      reminders.push({
        dateId: date.id,
        daysUntil: 0,
        message: `Today is ${date.title}! 🎉`,
      })
    }
  })

  return reminders
}
