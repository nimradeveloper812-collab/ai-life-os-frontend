import { useState, useEffect } from 'react'
import { getExpenses, createExpense, deleteExpense } from '../services/expenseService'

function ExpensePage() {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ userId: 1, title: '', amount: '', type: 'Expense', category: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchExpenses() }, [])

  const fetchExpenses = async () => {
    const res = await getExpenses()
    setExpenses(res.data)
  }

  const handleSubmit = async () => {
    if (!form.title || !form.amount) return alert('Title aur Amount zaroor bharo!')
    setLoading(true)
    await createExpense(form)
    setForm({ userId: 1, title: '', amount: '', type: 'Expense', category: '' })
    await fetchExpenses()
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete karna chahte ho?')) return
    await deleteExpense(id)
    await fetchExpenses()
  }

  const totalIncome = expenses.filter(e => e.type === 'Income').reduce((s, e) => s + e.amount, 0)
  const totalExpense = expenses.filter(e => e.type === 'Expense').reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpense

  return (
    <div>
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Expense Management</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-xl font-bold text-green-600">Rs. {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Total Expense</p>
          <p className="text-xl font-bold text-red-500">Rs. {totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-500">Balance</p>
          <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            Rs. {balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">➕ Naya Entry Add karo</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Title (e.g. Grocery)"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Amount (e.g. 500)"
            type="number"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
          <select
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="Expense">💸 Expense</option>
            <option value="Income">💵 Income</option>
          </select>
          <input
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Category (e.g. Food)"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : '✅ Add Entry'}
        </button>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold text-gray-700">📋 All Entries ({expenses.length})</h3>
        </div>
        {expenses.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Koi entry nahi hai abhi</p>
        ) : (
          <div className="divide-y">
            {expenses.map(e => (
              <div key={e.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-gray-800">{e.title}</p>
                  <p className="text-xs text-gray-400">{e.category} • {new Date(e.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${e.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                    {e.type === 'Income' ? '+' : '-'} Rs. {e.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    🗑️
                  </button>
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