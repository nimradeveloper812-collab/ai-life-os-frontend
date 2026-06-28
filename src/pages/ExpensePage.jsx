import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { getExpenses, createExpense, deleteExpense } from '../services/expenseService'

function ExpensePage() {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ title: '', amount: '', type: 'Expense', category: '' })
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => { fetchExpenses() }, [])

  const fetchExpenses = async () => {
    const res = await getExpenses()
    setExpenses(res.data)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.amount) return alert('Title aur Amount zaroor bharo!')
    setLoading(true)
    await createExpense(form)
    setForm({ title: '', amount: '', type: 'Expense', category: '' })
    await fetchExpenses()
    setLoading(false)
    toast.success('Expense added! 💰')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete karna chahte ho?')) return
    await deleteExpense(id)
    await fetchExpenses()
    toast.success('Deleted! 🗑️')
  }

  const filtered = filter === 'All' ? expenses : expenses.filter(e => e.type === filter)
  const totalIncome = expenses.filter(e => e.type === 'Income').reduce((s, e) => s + e.amount, 0)
  const totalExpense = expenses.filter(e => e.type === 'Expense').reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">💰 Expense Management</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Income</p>
          <p className="text-xl font-bold text-green-600 mt-1">Rs. {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Expense</p>
          <p className="text-xl font-bold text-red-500 mt-1">Rs. {totalExpense.toLocaleString()}</p>
        </div>
        <div className={`${balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-2xl p-4`}>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
          <p className={`text-xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
            Rs. {balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">➕ Add Entry</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <select
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="Expense">💸 Expense</option>
            <option value="Income">💵 Income</option>
          </select>
          <input
            className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Category (e.g. Food)"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : '✅ Add Entry'}
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['All', 'Income', 'Expense'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">📋 Transactions ({filtered.length})</h3>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Koi entry nahi hai</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(e => (
              <div key={e.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center
                    ${e.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {e.type === 'Income' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{e.title}</p>
                    <p className="text-xs text-gray-400">{e.category} • {new Date(e.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold text-sm ${e.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                    {e.type === 'Income' ? '+' : '-'} Rs. {e.amount?.toLocaleString()}
                  </span>
                  <button onClick={() => handleDelete(e.id)} className="text-gray-300 hover:text-red-500 transition">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpensePage