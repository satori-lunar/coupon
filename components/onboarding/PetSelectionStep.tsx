'use client'

import { motion } from 'framer-motion'

interface PetSelectionStepProps {
  onComplete: () => void
  petSpecies: 'cat' | 'dog' | 'rabbit' | 'bird' | 'hamster'
  setPetSpecies: (species: 'cat' | 'dog' | 'rabbit' | 'bird' | 'hamster') => void
  petName: string
  setPetName: (name: string) => void
}

const petEmojis = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bird: '🐦',
  hamster: '🐹',
}

export default function PetSelectionStep({
  onComplete,
  petSpecies,
  setPetSpecies,
  petName,
  setPetName,
}: PetSelectionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
    >
      <h2 className="text-3xl font-serif text-rose mb-6 text-center">
        Choose Your Pet
      </h2>

      <p className="text-warm-gray mb-6 text-center">
        Your pet will grow and thrive as you spend time together!
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-warm-gray mb-4 font-serif text-center">
            Select Species
          </label>
          <div className="grid grid-cols-5 gap-3">
            {(Object.keys(petEmojis) as Array<keyof typeof petEmojis>).map(species => (
              <button
                key={species}
                onClick={() => setPetSpecies(species)}
                className={`p-4 rounded-lg text-4xl transition-all ${
                  petSpecies === species
                    ? 'bg-rose scale-110'
                    : 'bg-cream hover:bg-blush'
                }`}
              >
                {petEmojis[species]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-warm-gray mb-2 font-serif">
            Pet Name
          </label>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-soft-gray focus:border-rose focus:outline-none text-lg"
            placeholder="Give your pet a name"
          />
        </div>

        <motion.button
          onClick={onComplete}
          disabled={!petName.trim()}
          className="w-full px-8 py-4 bg-rose text-white rounded-full text-lg font-serif hover:bg-muted-rose transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: petName.trim() ? 1.02 : 1 }}
          whileTap={{ scale: petName.trim() ? 0.98 : 1 }}
        >
          Complete Setup
        </motion.button>
      </div>
    </motion.div>
  )
}

