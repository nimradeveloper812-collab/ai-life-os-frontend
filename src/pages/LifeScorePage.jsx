import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/LifeScore'
const userId = () => localStorage.getItem('userId')
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

function ScoreRing({ score, size = 160 }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8"/>
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 1.5s ease' }}
      />
      <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="bold" fill={color}>{score}</text>
      <text x="60" y="72" textAnchor="middle" fontSize="10" fill="#94a3b8">/100</text>
    </svg>
  )
}

function BreakdownBar({ label, score, max, color, icon }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { setTimeout(() => setWidth((score / max) * 100), 300) }, [score])

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-600 flex items-center gap-1.5">
          <span>{icon}</span> {label}
        </span>
        <span className="text-sm font-bold text-gray-800">{score}/{max}</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${width}%` }}/>
      </div>
    </div>
  )
}

export default function LifeScorePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    axios.get(`${API}/${userId()}`, headers())
      .then(r => {
        setData(r.data)
        setLoading(false)
        setTimeout(() => setAnimated(true), 100)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!data) return <p className="text-center text-gray-400">Could not load score</p>

  const gradeColors = {
    S: 'from-yellow-400 to-orange-500',
    A: 'from-green-400 to-emerald-500',
    B: 'from-blue-400 to-blue-600',
    C: 'from-purple-400 to-purple-600',
    D: 'from-orange-400 to-red-500',
    F: 'from-red-400 to-red-600'
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">⭐ Life Score</h2>

      {/* Main Score Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div className="flex justify-center mb-4">
          <ScoreRing score={animated ? data.totalScore : 0} />
        </div>

        {/* Grade Badge */}
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradeColors[data.grade]} text-white text-2xl font-black mb-3 shadow-lg`}>
          {data.grade}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{data.message}</p>

        {/* Score Level */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {['F','D','C','B','A','S'].map(g => (
            <div key={g} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition ${
              g === data.grade
                ? `bg-gradient-to-br ${gradeColors[g]} text-white shadow-md scale-110`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              {g}
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-800 dark:text-white mb-5">📊 Score Breakdown</h3>
        <BreakdownBar label="Money Management" score={data.breakdown.moneyScore} max={25} color="bg-green-500" icon="💰"/>
        <BreakdownBar label="Task Productivity" score={data.breakdown.taskScore} max={25} color="bg-blue-500" icon="✅"/>
        <BreakdownBar label="Goal Progress" score={data.breakdown.goalScore} max={25} color="bg-purple-500" icon="🎯"/>
        <BreakdownBar label="Daily Activity" score={data.breakdown.activityScore} max={25} color="bg-orange-500" icon="⚡"/>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-blue-100 dark:border-blue-800">
        <h3 className="font-bold text-gray-800 dark:text-white mb-3">💡 How to improve</h3>
        <div className="space-y-2">
          {data.breakdown.moneyScore < 20 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">💰 Save more — try to keep expenses below 70% of income</p>
          )}
          {data.breakdown.taskScore < 20 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">✅ Complete more tasks — aim for 80%+ completion rate</p>
          )}
          {data.breakdown.goalScore < 20 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">🎯 Update your goal progress regularly</p>
          )}
          {data.breakdown.activityScore < 20 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">⚡ Be more active — log expenses and tasks daily</p>
          )}
          {data.totalScore >= 80 && (
            <p className="text-sm text-green-600 dark:text-green-400">🔥 You're doing amazing! Keep it up!</p>
          )}
        </div>
      </div>
    </div>
  )
}