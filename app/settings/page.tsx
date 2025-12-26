'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

export default function SettingsPage() {
  const { settings, updateSettings } = useAppStore()
  const [fontSize, setFontSize] = useState(settings.fontSize)

  const handleFontSizeChange = (size: 'normal' | 'large') => {
    setFontSize(size)
    updateSettings({ fontSize: size })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-blush p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-rose mb-4 inline-block font-serif">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-serif text-rose mb-8">Settings ⚙️</h1>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-serif text-rose mb-4">Accessibility</h2>
            <div>
              <label className="block text-warm-gray mb-2">Font Size</label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleFontSizeChange('normal')}
                  className={`px-6 py-3 rounded-full font-serif transition-colors ${
                    fontSize === 'normal'
                      ? 'bg-rose text-white'
                      : 'bg-cream text-warm-gray hover:bg-blush'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => handleFontSizeChange('large')}
                  className={`px-6 py-3 rounded-full font-serif transition-colors ${
                    fontSize === 'large'
                      ? 'bg-rose text-white'
                      : 'bg-cream text-warm-gray hover:bg-blush'
                  }`}
                >
                  Large
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif text-rose mb-4">Privacy</h2>
            <p className="text-warm-gray text-sm mb-4">
              Your data is stored locally on your device. No information is shared with third parties.
            </p>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to export your data?')) {
                  const state = await useAppStore.getState().saveAppState()
                  const dataStr = JSON.stringify(state, null, 2)
                  const blob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'couples-app-data.json'
                  a.click()
                }
              }}
              className="px-6 py-3 bg-cream text-warm-gray rounded-full font-serif hover:bg-blush transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

