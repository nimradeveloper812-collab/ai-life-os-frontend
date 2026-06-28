import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Budget'
const userId = () => Number(localStorage.getItem('userId'))
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Education', 'Entertainment', 'Bills', 'Other']

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([])
  const [form, setForm] = useState({ category: 'Food', monthlyLimit: '' })
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { fetchBudgets() }, [])

  const fetchBudgets = async () => {
    const res = await axios.get(`${API}/user/${userId()}`, headers())
    setBudgets(res.data)
  }

  const handleAdd = async () => {
    if (!form.monthlyLimit) return toast.error('Enter a budget limit!')
    await axios.post(API, { ...form, userId: userId(), monthlyLimit: Number(form.monthlyLimit) }, headers())
    toast.success('Budget set! 💰')
    setForm({ category: 'Food', monthlyLimit: '' })
    setShowAdd(false)
    fetchBudgets()
  }

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`, headers())
    toast.success('Budget removed!')
    fetchBudgets()
  }

  const totalBudget = budgets.reduce((s, b) => s + Number(b.monthlyLimit), 0)
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent), 0)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">💳 Budget Limits</h2>

      {/* Summary */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Budget</p>
            <p className="text-xl font-bold text-blue-600 mt-1">Rs. {totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Spent</p>
            <p className="text-xl font-bold text-red-500 mt-1">Rs. {totalSpent.toLocaleString()}</p>
          </div>
          <div className={`${totalBudget - totalSpent >= 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 border-red-200'} border rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Remaining</p>
            <p className={`text-xl font-bold mt-1 ${totalBudget - totalSpent >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              Rs. {(totalBudget - totalSpent).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Add Budget */}
      <button onClick={() => setShowAdd(!showAdd)}
        className="w-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-400 rounded-2xl py-3 text-gray-400 hover:text-blue-500 transition text-sm font-medium">
        ➕ Set New Budget
      </button>

      {showAdd && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-700 dark:text-white mb-4">New Budget</h3>
          <div className="grid grid-cols-2 gap-3">
            <select
              className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              className="border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Monthly limit (Rs.)"
              value={form.monthlyLimit}
              onChange={e => setForm({ ...form, monthlyLimit: e.target.value })}
            />
          </div>
          <button onClick={handleAdd}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
            Set Budget
          </button>
        </div>
      )}

      {/* Budget List */}
      <div className="space-y-3">
        {budgets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-400 text-sm">
            No budgets set — add your first budget!
          </div>
        ) : (
          budgets.map(b => {
            const pct = Math.min(100, b.percent)
            const over = b.percent > 100
            const warning = b.percent > 80

            return (
              <div key={b.id} className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 transition ${
                over ? 'border-red-300 dark:border-red-800' :
                warning ? 'border-orange-300 dark:border-orange-800' :
                'border-gray-100 dark:border-gray-700'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{b.category}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Rs. {Number(b.spent).toLocaleString()} / Rs. {Number(b.monthlyLimit).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {over && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">⚠️ Over budget!</span>}
                    {warning && !over && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">⚡ Almost full</span>}
                    <span className={`text-sm font-bold ${over ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      {b.percent}%
                    </span>
                    <button onClick={() => handleDelete(b.id)}
                      className="text-gray-200 hover:text-red-400 transition">🗑️</button>
                  </div>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-700 ${
                      over ? 'bg-red-500' : warning ? 'bg-orange-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-1.5">
                  <span>Spent: Rs. {Number(b.spent).toLocaleString()}</span>
                  <span>Left: Rs. {Math.max(0, Number(b.monthlyLimit) - Number(b.spent)).toLocaleString()}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}