import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Option({ opt, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border text-left transition-all ${
        selected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="font-semibold text-slate-900">{opt.title}</div>
      <div className="text-sm text-slate-500">{opt.credits} credits</div>
      <div className="text-blue-600 font-semibold">${opt.amount.toFixed(2)}</div>
    </button>
  )
}

function OrderSummary({ game, option, playerId, region, onConfirm, loading, order }) {
  return (
    <div className="bg-white/80 border border-slate-200 rounded-2xl p-4">
      <div className="font-semibold text-slate-900 mb-2">Order Summary</div>
      <ul className="text-sm text-slate-600 space-y-1">
        <li><span className="text-slate-500">Game:</span> {game?.name}</li>
        <li><span className="text-slate-500">Option:</span> {option?.title}</li>
        <li><span className="text-slate-500">Player ID:</span> {playerId || '—'}</li>
        {region && <li><span className="text-slate-500">Region:</span> {region}</li>}
        <li><span className="text-slate-500">Amount:</span> ${option?.amount?.toFixed(2)}</li>
      </ul>
      <button
        onClick={onConfirm}
        disabled={!game || !option || !playerId || loading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg"
      >
        {loading ? 'Creating Order...' : 'Confirm & Create Order'}
      </button>
      {order && (
        <div className="mt-3 text-xs text-slate-600">
          Order created. ID: <span className="font-mono">{order.id}</span>
        </div>
      )}
    </div>
  )
}

function TopupFlow({ game }) {
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)
  const [playerId, setPlayerId] = useState('')
  const [region, setRegion] = useState('')
  const [creating, setCreating] = useState(false)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (!game) return
    const load = async () => {
      const res = await fetch(`${API_BASE}/api/games/${game.id}/options`)
      const data = await res.json()
      setOptions(data)
    }
    load()
  }, [game])

  const createOrder = async () => {
    try {
      setCreating(true)
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: game.id,
          option_id: selected.id,
          player_id: playerId,
          region: region || null,
          payment_method: 'mock-pay'
        })
      })
      const data = await res.json()
      setOrder(data)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="bg-white/80 border border-slate-200 rounded-2xl p-4">
          <div className="font-semibold text-slate-900 mb-2">Player Details</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={playerId} onChange={e=>setPlayerId(e.target.value)} placeholder="Player ID" className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input value={region} onChange={e=>setRegion(e.target.value)} placeholder="Region (optional)" className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200 rounded-2xl p-4">
          <div className="font-semibold text-slate-900 mb-3">Select Top-up</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {options.map(o => (
              <Option key={o.id} opt={o} selected={selected?.id===o.id} onClick={()=>setSelected(o)} />
            ))}
          </div>
        </div>
      </div>

      <OrderSummary
        game={game}
        option={selected}
        playerId={playerId}
        region={region}
        onConfirm={createOrder}
        loading={creating}
        order={order}
      />
    </div>
  )
}

export default TopupFlow
