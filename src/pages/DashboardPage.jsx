import { useState, useEffect } from 'react'
import { getExpenses } from '../services/expenseService'
import axios from 'axios'

function DashboardPage() {
  const [totalExpense, setTotalExpense] = useState(0)
  const [tasks, setTasks] = useState({ total: 0, completed: 0 })
  const [goalsCount, setGoalsCount] = useState(0)

  useEffect(() => {
    getExpenses().then(res => {
      const exp = res.data.filter(e => e.type === 'Expense').reduce((s, e) => s + e.amount, 0)
      setTotalExpense(exp)
    })
    axios.get('http://localhost:5020/api/Task').then(res => {
      setTasks({ total: res.data.length, completed: res.data.filter(t => t.isCompleted).length })
    })
    axios.get('http://localhost:5020/api/Goal').then(res => {
      setGoalsCount(res.data.length)
    })
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">👋 Welcome to AI Life OS</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">Rs. {totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Tasks Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{tasks.completed} / {tasks.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Goals Active</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{goalsCount}</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage