import { useEffect, useState } from 'react'
import Header from './components/Header'
import GameGrid from './components/GameGrid'
import TopupFlow from './components/TopupFlow'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    // attempt to seed backend with default games/options (idempotent)
    const seed = async () => {
      try {
        await fetch(`${API_BASE}/api/seed`, { method: 'POST' })
        setSeeded(true)
      } catch (e) {
        console.error('Seed failed', e)
      }
    }
    seed()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Top up your favorite games in seconds</h1>
          <p className="text-slate-600 mt-2">Instant delivery. Secure checkout. Global coverage.</p>
        </div>

        {!selectedGame ? (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Popular Games</h2>
            <GameGrid onSelect={setSelectedGame} />
          </>
        ) : (
          <div className="space-y-6">
            <button onClick={()=>setSelectedGame(null)} className="text-sm text-blue-600 hover:underline">← Back to games</button>

            <div className="flex items-center gap-4">
              <img src={selectedGame.image || 'https://i.imgur.com/8Km9tLL.png'} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <div className="text-2xl font-semibold text-slate-900">{selectedGame.name}</div>
                <div className="text-slate-500 text-sm">{selectedGame.publisher || '—'}</div>
              </div>
            </div>

            <TopupFlow game={selectedGame} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} GameTopup. All rights reserved.</div>
          <div className="opacity-75">Built for demo purposes.</div>
        </div>
      </footer>
    </div>
  )
}

export default App
