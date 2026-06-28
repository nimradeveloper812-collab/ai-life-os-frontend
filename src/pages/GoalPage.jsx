import { useState, useEffect } from 'react'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/expenseService'
import toast from 'react-hot-toast'
function GoalPage() {
  const [goals, setGoals] = useState([])
  const [form, setForm] = useState({ title: '', targetValue: '', currentValue: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchGoals() }, [])

  const fetchGoals = async () => {
    const res = await getGoals()
    setGoals(res.data)
  }

  const handleAdd = async () => {
    if (!form.title || !form.targetValue) return alert('Title aur Target Value likho!')
    setLoading(true)
    await createGoal(form)
    setForm({ title: '', targetValue: '', currentValue: 0 })
    await fetchGoals()
    setLoading(false)
   toast.success('Goal created! 🎯')
  }

  const handleProgress = async (goal, value) => {
    await updateGoal(goal.id, { ...goal, currentValue: Number(value) })
    await fetchGoals()
    toast.success('Progress updated! 📈')
  }

  const handleDelete = async (id) => {
    await deleteGoal(id)
    await fetchGoals()
    toast.success('Goal deleted! 🗑️')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🎯 Goal Tracking</h2>

      {/* Add */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">➕ New Goal</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Goal title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Target Value"
            type="number"
            value={form.targetValue}
            onChange={e => setForm({ ...form, targetValue: e.target.value })}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : '🎯 Add Goal'}
        </button>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 gap-4">
        {goals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400 text-sm">No goals yet</div>
        ) : (
          goals.map(goal => {
            const percent = goal.targetValue > 0
              ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
              : 0
            return (
              <div key={goal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {goal.currentValue?.toLocaleString()} / {goal.targetValue?.toLocaleString()} • {percent}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      percent === 100 ? 'bg-green-100 text-green-600' :
                      percent >= 50 ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {percent === 100 ? '✓ Done' : percent >= 50 ? 'Halfway' : 'In Progress'}
                    </span>
                    <button onClick={() => handleDelete(goal.id)} className="text-gray-300 hover:text-red-500 transition">🗑️</button>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      percent === 100 ? 'bg-green-500' : percent >= 50 ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    className="border rounded-xl px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Update progress"
                    defaultValue={goal.currentValue}
                    onBlur={e => handleProgress(goal, e.target.value)}
                  />
                  <span className="text-xs text-gray-400">Tab to save</span>
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