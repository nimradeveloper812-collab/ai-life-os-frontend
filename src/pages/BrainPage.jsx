import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Brain'
const userId = () => Number(localStorage.getItem('userId'))
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const TYPES = [
  { value: 'Note', icon: '📝', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { value: 'Book', icon: '📚', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { value: 'Course', icon: '🎓', color: 'bg-green-50 text-green-600 border-green-200' },
  { value: 'Idea', icon: '💡', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  { value: 'Quote', icon: '💬', color: 'bg-pink-50 text-pink-600 border-pink-200' },
]

function BrainPage() {
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState({ title: '', type: 'Note', content: '', tags: '' })
  const [filter, setFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchLogs() }, [])

  const fetchLogs = async () => {
    const res = await axios.get(`${API}/user/${userId()}`, headers())
    setLogs(res.data)
  }

  const handleAdd = async () => {
    if (!form.title) return
    await axios.post(API, { ...form, userId: userId() }, headers())
    setForm({ title: '', type: 'Note', content: '', tags: '' })
    setShowAdd(false)
    fetchLogs()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`, headers())
    fetchLogs()
  }

  const filtered = logs.filter(l => {
    const matchType = filter === 'All' || l.type === filter
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      (l.content || '').toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🧠 Brain OS</h2>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2">
        {TYPES.map(t => (
          <div key={t.value} className={`rounded-xl border p-3 text-center ${t.color}`}>
            <div className="text-xl">{t.icon}</div>
            <div className="text-lg font-bold">{logs.filter(l => l.type === t.value).length}</div>
            <div className="text-xs">{t.value}s</div>
          </div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex gap-3">
        <input
          className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Search your brain..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
        >
          ➕ Add
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex gap-2 mb-3 flex-wrap">
            {TYPES.map(t => (
              <button key={t.value}
                onClick={() => setForm({ ...form, type: t.value })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  form.type === t.value ? t.color : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}>
                {t.icon} {t.value}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <input
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Content, notes, summary..."
              rows={3}
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
            />
            <input
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tags (e.g. finance, health, coding)"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Save to Brain
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...TYPES.map(t => t.value)].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>
            {TYPES.find(t => t.value === f)?.icon || '🗂️'} {f}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-8 text-center text-gray-400 text-sm">
            Nothing in your brain yet!
          </div>
        ) : (
          filtered.map(log => {
            const type = TYPES.find(t => t.value === log.type) || TYPES[0]
            return (
              <div key={log.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${type.color}`}>
                    {type.icon} {log.type}
                  </span>
                  <button onClick={() => handleDelete(log.id)}
                    className="text-gray-200 hover:text-red-400 transition text-sm">🗑️</button>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mt-2">{log.title}</h4>
                {log.content && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{log.content}</p>}
                {log.tags && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {log.tags.split(',').map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-300 mt-2">
                  {new Date(log.createdAt).toLocaleDateString()}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default BrainPage