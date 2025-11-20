import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function GameCard({ game, onSelect }) {
  return (
    <button
      onClick={() => onSelect(game)}
      className="group bg-white/70 hover:bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center text-center shadow-sm hover:shadow transition-all"
    >
      <img src={game.image || 'https://i.imgur.com/8Km9tLL.png'} alt={game.name} className="w-20 h-20 object-cover rounded-xl mb-3" />
      <div className="font-semibold text-slate-900">{game.name}</div>
      <div className="text-xs text-slate-500">{game.publisher || '—'}</div>
    </button>
  )
}

function GameGrid({ onSelect }) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/games`)
        const data = await res.json()
        setGames(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="text-slate-500 text-center py-10">Loading games...</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {games.map(g => (
        <GameCard key={g.id} game={g} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default GameGrid
