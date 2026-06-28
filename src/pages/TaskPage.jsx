import { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask } from '../services/expenseService'
import toast from 'react-hot-toast'
function TaskPage() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    const res = await getTasks()
    setTasks(res.data)
  }

  const handleAdd = async () => {
    if (!title) return
    setLoading(true)
    await createTask({ title, isCompleted: false })
    setTitle('')
    await fetchTasks()
    setLoading(false)
    toast.success('Task added! ✅')
  }

  const handleToggle = async (task) => {
    await updateTask(task.id, { ...task, isCompleted: !task.isCompleted })
    await fetchTasks()
    toast.success(task.isCompleted ? 'Task uncompleted!' : 'Task completed! 🎉')
  }

  const handleDelete = async (id) => {
    await deleteTask(id)
    await fetchTasks()
    toast.success('Task deleted! 🗑️')
  }

  const completed = tasks.filter(t => t.isCompleted).length
  const filtered = filter === 'All' ? tasks : filter === 'Done' ? tasks.filter(t => t.isCompleted) : tasks.filter(t => !t.isCompleted)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">✅ Task Management</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{tasks.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Done</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{completed}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{tasks.length - completed}</p>
        </div>
      </div>

      {/* Add */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">➕ New Task</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Task title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? '...' : 'Add'}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['All', 'Pending', 'Done'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Tasks ({filtered.length})</h3>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Koi task nahi</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(task => (
              <div key={task.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(task)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition
                      ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-400'}`}
                  >
                    {task.isCompleted && <span className="text-xs">✓</span>}
                  </button>
                  <span className={`text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                </div>
                <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500 transition text-sm">🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskPage