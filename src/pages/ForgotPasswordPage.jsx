import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Auth'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.post(`${API}/forgot-password`, { email })
      setMessage('Reset link sent! Check your email.')
    } catch {
      setMessage('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">🔑 Forgot Password</h1>
        <p className="text-gray-500 mb-6">Enter your email to receive reset link</p>

        {message && <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg mb-4 text-sm">{message}</div>}

        <input
          className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage