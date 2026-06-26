import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Health'
const userId = () => Number(localStorage.getItem('userId'))
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

function HealthPage() {
  const [log, setLog] = useState({
    userId: userId(), date: new Date().toISOString().split('T')[0],
    sleepHours: 0, waterGlasses: 0, exerciseMinutes: 0,
    moodScore: 5, energyLevel: 5, notes: ''
  })
  const [history, setHistory] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    axios.get(`${API}/user/${userId()}`, headers()).then(r => setHistory(r.data))
    axios.get(`${API}/user/${userId()}/today`, headers()).then(r => {
      if (r.data) setLog(prev => ({ ...prev, ...r.data }))
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    await axios.post(API, log, headers())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    axios.get(`${API}/user/${userId()}`, headers()).then(r => setHistory(r.data))
  }

  const moodEmojis = ['😞', '😔', '😐', '🙂', '😊', '😄', '🤩', '💪', '🔥', '⚡']

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💪 Health OS</h2>

      {/* Today's Log */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-gray-800">📅 Today's Health Log</h3>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Sleep */}
          <div className="bg-indigo-50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-indigo-700">😴 Sleep Hours</label>
              <span className="text-lg font-bold text-indigo-700">{log.sleepHours}h</span>
            </div>
            <input type="range" min="0" max="12" step="0.5"
              value={log.sleepHours}
              onChange={e => setLog({ ...log, sleepHours: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-indigo-400 mt-1"><span>0h</span><span>12h</span></div>
          </div>

          {/* Water */}
          <div className="bg-cyan-50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-cyan-700">💧 Water Glasses</label>
              <span className="text-lg font-bold text-cyan-700">{log.waterGlasses}</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[...Array(10)].map((_, i) => (
                <button key={i}
                  onClick={() => setLog({ ...log, waterGlasses: i + 1 })}
                  className={`w-8 h-8 rounded-lg text-sm transition ${
                    i < log.waterGlasses ? 'bg-cyan-500 text-white' : 'bg-white border border-cyan-200 text-cyan-300'
                  }`}>
                  💧
                </button>
              ))}
            </div>
          </div>

          {/* Exercise */}
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-green-700">🏃 Exercise</label>
              <span className="text-lg font-bold text-green-700">{log.exerciseMinutes} min</span>
            </div>
            <input type="range" min="0" max="120" step="5"
              value={log.exerciseMinutes}
              onChange={e => setLog({ ...log, exerciseMinutes: Number(e.target.value) })}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-green-400 mt-1"><span>0</span><span>120 min</span></div>
          </div>

          {/* Mood */}
          <div className="bg-amber-50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-amber-700">😊 Mood</label>
              <span className="text-2xl">{moodEmojis[log.moodScore - 1]}</span>
            </div>
            <input type="range" min="1" max="10"
              value={log.moodScore}
              onChange={e => setLog({ ...log, moodScore: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-amber-400 mt-1"><span>Bad</span><span>Amazing</span></div>
          </div>

          {/* Energy */}
          <div className="bg-orange-50 rounded-2xl p-4 md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-orange-700">⚡ Energy Level</label>
              <span className="text-lg font-bold text-orange-700">{log.energyLevel}/10</span>
            </div>
            <input type="range" min="1" max="10"
              value={log.energyLevel}
              onChange={e => setLog({ ...log, energyLevel: Number(e.target.value) })}
              className="w-full accent-orange-500"
            />
          </div>
        </div>

        {/* Notes */}
        <textarea
          className="w-full mt-4 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Any notes about your health today..."
          rows={2}
          value={log.notes || ''}
          onChange={e => setLog({ ...log, notes: e.target.value })}
        />

        <button
          onClick={handleSave}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
        >
          {saved ? '✅ Saved!' : '💾 Save Today\'s Log'}
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">📊 Health History</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {history.slice(0, 7).map(h => (
              <div key={h.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(h.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    😴 {h.sleepHours}h · 💧 {h.waterGlasses} · 🏃 {h.exerciseMinutes}min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{moodEmojis[(h.moodScore || 5) - 1]}</span>
                  <span className="text-xs text-gray-400">⚡{h.energyLevel}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthPage