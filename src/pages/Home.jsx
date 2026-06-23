import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const COMING_SOON_MODES = ['Full League Draft', 'Six Nations', 'World Cup']

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ExplainerModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">What is Prem 20-0?</h2>
        <p className="text-gray-300 leading-relaxed mb-2">
          Draft 15 players from across the Premiership clubs, building a squad balanced across every position.
        </p>
        <p className="text-gray-300 leading-relaxed mb-2">
          Then simulate an 18-game league season plus playoffs — your goal is to win every match for a perfect 20-0 record.
        </p>
        <p className="text-gray-300 leading-relaxed mb-6">
          The difficulty you pick before the draft controls how many redrafts you get if a pick goes wrong.
        </p>
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold tracking-tight mb-3">The Rugby Draft</h1>
        <p className="text-xl text-gray-400">Draft a Rugby XV. Go Unbeaten.</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-16">
        {/* Live mode card */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold">Prem 20-0</h2>
            <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide">
              LIVE
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Draft your Premiership XV and go unbeaten all season.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/settings')}
              className="bg-green-500 hover:bg-green-400 text-white font-semibold px-7 py-3 rounded-lg transition-colors"
            >
              Play
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="text-gray-400 hover:text-white text-sm underline underline-offset-2 transition-colors"
            >
              What is this mode?
            </button>
          </div>
        </div>

        {/* Coming soon */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
          More modes (coming soon)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COMING_SOON_MODES.map((mode) => (
            <div
              key={mode}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 opacity-50 cursor-not-allowed select-none"
            >
              <div className="text-gray-500 mb-3">
                <LockIcon />
              </div>
              <h3 className="font-semibold text-gray-300">{mode}</h3>
            </div>
          ))}
        </div>
      </main>

      {modalOpen && <ExplainerModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
