'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface PairingStepProps {
  pairCode: string
  onComplete: (code?: string) => void
}

export default function PairingStep({ pairCode, onComplete }: PairingStepProps) {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [joinCode, setJoinCode] = useState('')

  const handleJoin = () => {
    if (joinCode.trim()) {
      onComplete(joinCode.trim().toUpperCase())
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
    >
      <h2 className="text-3xl font-serif text-rose mb-6 text-center">
        Connect Together
      </h2>

      <div className="space-y-4 mb-6">
        <button
          onClick={() => setMode('create')}
          className={`w-full px-6 py-3 rounded-lg transition-colors ${
            mode === 'create' ? 'bg-rose text-white' : 'bg-cream text-warm-gray'
          }`}
        >
          Create New Pair
        </button>
        <button
          onClick={() => setMode('join')}
          className={`w-full px-6 py-3 rounded-lg transition-colors ${
            mode === 'join' ? 'bg-rose text-white' : 'bg-cream text-warm-gray'
          }`}
        >
          Join Existing Pair
        </button>
      </div>

      {mode === 'create' ? (
        <div className="text-center space-y-6">
          <p className="text-warm-gray">
            Share this code with your partner to connect:
          </p>
          <div className="bg-cream p-6 rounded-lg">
            <p className="text-4xl font-mono font-bold text-rose tracking-wider">
              {pairCode}
            </p>
          </div>
          <p className="text-sm text-soft-gray">
            Your partner should enter this code in their app to join you.
          </p>
          <motion.button
            onClick={() => onComplete()}
            className="px-8 py-4 bg-rose text-white rounded-full text-lg font-serif hover:bg-muted-rose transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-warm-gray mb-2 font-serif">
              Enter Pair Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 rounded-lg border border-soft-gray focus:border-rose focus:outline-none text-lg text-center font-mono tracking-wider"
              placeholder="ABC123"
              maxLength={6}
            />
          </div>
          <motion.button
            onClick={handleJoin}
            disabled={!joinCode.trim()}
            className="w-full px-8 py-4 bg-rose text-white rounded-full text-lg font-serif hover:bg-muted-rose transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: joinCode.trim() ? 1.02 : 1 }}
            whileTap={{ scale: joinCode.trim() ? 0.98 : 1 }}
          >
            Join Pair
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

