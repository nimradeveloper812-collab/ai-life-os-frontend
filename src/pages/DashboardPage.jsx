import { useState, useEffect } from 'react'
import { getExpenses, getTasks, getGoals } from '../services/expenseService'

function DashboardPage() {
  const [expenses, setExpenses] = useState([])
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const name = localStorage.getItem('name') || 'User'

  useEffect(() => {
    getExpenses().then(r => setExpenses(r.data)).catch(() => {})
    getTasks().then(r => setTasks(r.data)).catch(() => {})
    getGoals().then(r => setGoals(r.data)).catch(() => {})
  }, [])

  const totalIncome = expenses.filter(e => e.type === 'Income').reduce((s, e) => s + e.amount, 0)
  const totalExpense = expenses.filter(e => e.type === 'Expense').reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpense
  const completedTasks = tasks.filter(t => t.isCompleted).length
  const taskPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const categories = expenses.filter(e => e.type === 'Expense').reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount
    return acc
  }, {})

  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-green-500']

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">👋 Welcome back, {name}!</h2>
        <p className="text-blue-100 mt-1 text-sm">Here's your life overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
          <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            Rs. {balance.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Income</p>
          <p className="text-2xl font-bold mt-1 text-green-600">Rs. {totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Expenses</p>
          <p className="text-2xl font-bold mt-1 text-red-500">Rs. {totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Goals</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">{goals.length}</p>
        </div>
      </div>

      {/* Task Progress + Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Task Progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">✅ Task Progress</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2563eb" strokeWidth="3"
                  strokeDasharray={`${taskPercent} 100`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-800">{taskPercent}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{completedTasks}<span className="text-gray-400 text-lg">/{tasks.length}</span></p>
              <p className="text-sm text-gray-500">Tasks completed</p>
              <p className="text-xs text-gray-400 mt-1">{tasks.length - completedTasks} remaining</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">💸 Spending by Category</h3>
          {Object.keys(categories).length === 0 ? (
            <p className="text-gray-400 text-sm">No expenses yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categories).slice(0, 4).map(([cat, amount], i) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{cat}</span>
                    <span className="font-medium">Rs. {amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${colors[i % colors.length]} h-2 rounded-full`}
                      style={{ width: `${Math.min(100, (amount / totalExpense) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">📋 Recent Transactions</h3>
          <a href="/expenses" className="text-xs text-blue-600 hover:underline">View all →</a>
        </div>
        {expenses.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No transactions yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {expenses.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                    ${e.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {e.type === 'Income' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.title}</p>
                    <p className="text-xs text-gray-400">{e.category}</p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${e.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                  {e.type === 'Income' ? '+' : '-'} Rs. {e.amount?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage