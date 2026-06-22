import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Auth'

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const handleReset = async () => {
    setLoading(true)
    try {
      await axios.post(`${API}/reset-password`, { token, newPassword: password })
      setMessage('Password reset successful!')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setMessage('Invalid or expired token.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">🔒 Reset Password</h1>
        <p className="text-gray-500 mb-6">Enter your new password</p>

        {message && <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">{message}</div>}

        <input
          className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="New Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </div>
  )
}

export default ResetPasswordPage