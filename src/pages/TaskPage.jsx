import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = 'https://ai-life-os-backend-cuc9.onrender.com/api/Task'

function TaskPage() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    const res = await axios.get(BASE_URL)
    setTasks(res.data)
  }

  const handleAdd = async () => {
    if (!title) return alert('Title likho!')
    setLoading(true)
    await axios.post(BASE_URL, { userId: 1, title, isCompleted: false })
    setTitle('')
    await fetchTasks()
    setLoading(false)
  }

  const handleToggle = async (task) => {
    await axios.put(`${BASE_URL}/${task.id}`, { ...task, isCompleted: !task.isCompleted })
    await fetchTasks()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/${id}`)
    await fetchTasks()
  }

  const completed = tasks.filter(t => t.isCompleted).length

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">✅ Task Management</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-xl font-bold text-blue-600">{tasks.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-xl font-bold text-green-600">{completed}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="text-xl font-bold text-orange-500">{tasks.length - completed}</p>
        </div>
      </div>

      {/* Add Task */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">➕ Naya Task</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Task title likho..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : '➕ Add'}
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-700">📋 Tasks ({tasks.length})</h3>
        </div>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Koi task nahi hai abhi</p>
        ) : (
          <div className="divide-y">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggle(task)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span className={`text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-red-400 hover:text-red-600">🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskPage