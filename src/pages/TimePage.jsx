import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Habit'
const userId = () => Number(localStorage.getItem('userId'))
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const ICONS = ['🌅', '💪', '📚', '🧘', '💧', '🏃', '🍎', '😴', '✍️', '🙏', '🎯', '💊']

function TimePage() {
  const [habits, setHabits] = useState([])
  const [form, setForm] = useState({ title: '', icon: '⭐' })
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { fetchHabits() }, [])

  const fetchHabits = async () => {
    const res = await axios.get(`${API}/user/${userId()}`, headers())
    setHabits(res.data)
  }

  const handleAdd = async () => {
    if (!form.title) return
    await axios.post(API, { ...form, userId: userId() }, headers())
    setForm({ title: '', icon: '⭐' })
    setShowAdd(false)
    fetchHabits()
  }

  const handleToggle = async (habitId) => {
    await axios.post(`${API}/log`, { habitId, userId: userId() }, headers())
    fetchHabits()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`, headers())
    fetchHabits()
  }

  const completedToday = habits.filter(h => h.logs?.length > 0 && h.logs[0]?.completed).length
  const percent = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">⏰ Time OS — Daily Habits</h2>

      {/* Progress */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-purple-200 text-sm">Today's Progress</p>
            <p className="text-3xl font-bold mt-1">{completedToday}/{habits.length}</p>
            <p className="text-purple-200 text-sm">habits completed</p>
          </div>
          <div className="text-5xl font-bold text-white/20">{percent}%</div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Add Habit */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full bg-white border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl py-3 text-gray-400 hover:text-blue-500 transition text-sm font-medium"
      >
        ➕ Add New Habit
      </button>

      {showAdd && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">New Habit</h3>
          <div className="flex gap-3 mb-3">
            <input
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Habit name (e.g. Morning Walk)"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {ICONS.map(icon => (
              <button key={icon}
                onClick={() => setForm({ ...form, icon })}
                className={`w-10 h-10 rounded-xl text-xl transition ${
                  form.icon === icon ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                {icon}
              </button>
            ))}
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Add Habit
          </button>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm">
            No habits yet — add your first habit!
          </div>
        ) : (
          habits.map(habit => {
            const done = habit.logs?.length > 0 && habit.logs[0]?.completed
            return (
              <div key={habit.id}
                className={`bg-white rounded-2xl border transition ${done ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4 px-5 py-4">
                  <button
                    onClick={() => handleToggle(habit.id)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${
                      done ? 'bg-green-500 shadow-lg shadow-green-200' : 'bg-gray-100 hover:bg-gray-200'
                    }`}>
                    {done ? '✅' : habit.icon}
                  </button>
                  <div className="flex-1">
                    <p className={`font-medium ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {habit.title}
                    </p>
                    <p className="text-xs text-gray-400">{done ? '✓ Completed today' : 'Tap to complete'}</p>
                  </div>
                  <button onClick={() => handleDelete(habit.id)}
                    className="text-gray-200 hover:text-red-400 transition">🗑️</button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default TimePage