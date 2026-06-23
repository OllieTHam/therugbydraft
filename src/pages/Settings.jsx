import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 */

/** @type {{ id: Difficulty, label: string, redrafts: number, description: string }[]} */
const DIFFICULTIES = [
  { id: 'easy',   label: 'Easy',   redrafts: 3, description: '3 redrafts — change your mind up to three times' },
  { id: 'medium', label: 'Medium', redrafts: 1, description: '1 redraft — one chance to swap a pick' },
  { id: 'hard',   label: 'Hard',   redrafts: 0, description: 'No redrafts — every pick is final' },
]

export default function Settings() {
  const [difficulty, setDifficulty] = useState('medium')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-16">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-300 text-sm mb-10 flex items-center gap-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">Difficulty</h1>

        <div className="flex flex-col gap-4 mb-10">
          {DIFFICULTIES.map(({ id, label, redrafts, description }) => (
            <button
              key={id}
              onClick={() => setDifficulty(id)}
              className={`text-left rounded-xl p-6 border-2 transition-colors ${
                difficulty === id
                  ? 'border-green-500 bg-gray-800'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-lg font-semibold">{label}</span>
                <span className="text-sm font-semibold text-gray-400">
                  {redrafts === 0 ? '0 redrafts' : `${redrafts} redraft${redrafts > 1 ? 's' : ''}`}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{description}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/draft', { state: { difficulty } })}
          className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
        >
          Start Draft
        </button>
      </div>
    </div>
  )
}
