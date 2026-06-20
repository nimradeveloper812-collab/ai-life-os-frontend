import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = 'https://ai-life-os-backend-cuc9.onrender.com/api/Goal'

function GoalPage() {
  const [goals, setGoals] = useState([])
  const [form, setForm] = useState({ userId: 1, title: '', targetValue: '', currentValue: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchGoals() }, [])

  const fetchGoals = async () => {
    const res = await axios.get(BASE_URL)
    setGoals(res.data)
  }

  const handleAdd = async () => {
    if (!form.title || !form.targetValue) return alert('Title aur Target Value likho!')
    setLoading(true)
    await axios.post(BASE_URL, form)
    setForm({ userId: 1, title: '', targetValue: '', currentValue: 0 })
    await fetchGoals()
    setLoading(false)
  }

  const handleProgress = async (goal, value) => {
    await axios.put(`${BASE_URL}/${goal.id}`, { ...goal, currentValue: Number(value) })
    await fetchGoals()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`)
    await fetchGoals()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Goal Tracking</h2>

      {/* Add Goal */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">➕ Naya Goal</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Goal title (e.g. Save Rs. 50,000)"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Target Value (e.g. 50000)"
            type="number"
            value={form.targetValue}
            onChange={e => setForm({ ...form, targetValue: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : '🎯 Add Goal'}
        </button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            Koi goal nahi hai abhi
          </div>
        ) : (
          goals.map(goal => {
            const percent = goal.targetValue > 0
              ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
              : 0
            return (
              <div key={goal.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {goal.currentValue} / {goal.targetValue} • {percent}% complete
                    </p>
                  </div>
                  <button onClick={() => handleDelete(goal.id)} className="text-red-400 hover:text-red-600">🗑️</button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Update Progress */}
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="border rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Current value update karo"
                    defaultValue={goal.currentValue}
                    onBlur={e => handleProgress(goal, e.target.value)}
                  />
                  <span className="text-xs text-gray-400">Tab dabao to save</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default GoalPage