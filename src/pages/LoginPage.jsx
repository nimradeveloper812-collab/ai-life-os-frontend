import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Auth'

function LoginPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const registered = searchParams.get('registered')

  const handleNext = async () => {
    setError('')

    if (step === 0) {
      if (!form.email.includes('@')) {
        setError('Please enter a valid email')
        return
      }
      setStep(1)
      return
    }

    if (step === 1) {
      if (!form.password) {
        setError('Please enter your password')
        return
      }
      setLoading(true)
      try {
        const res = await axios.post(`${API}/login`, form)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('name', res.data.name)
        navigate('/')
      } catch {
        setError('Wrong email or password')
      }
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      const res = await axios.post(`${API}/google`, {
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.userId)
      localStorage.setItem('name', res.data.name)
      navigate('/')
    } catch {
      setError('Google sign in failed')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">⚡</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Sign in</h1>
        <p className="text-gray-500 text-sm mt-1">to continue to AI Life OS</p>
      </div>

      <div className="w-full max-w-sm">

        {/* Success message */}
        {registered && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            ✅ Account created! Please sign in.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Step 0 — Email */}
        {step === 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              autoFocus
              type="email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
            />
          </div>
        )}

        {/* Step 1 — Password */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-2 mb-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                {form.email[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-700">{form.email}</span>
              <button
                onClick={() => { setStep(0); setError('') }}
                className="ml-auto text-xs text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              autoFocus
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
            />
            <div className="text-right mt-1.5">
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        )}

        {/* Next / Sign in button */}
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Signing in...</>
          ) : step === 0 ? (
            <>Next <span>→</span></>
          ) : (
            'Sign in'
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"/>
          <span className="px-3 text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign in failed')}
            text="signin_with"
            shape="rectangular"
            size="large"
            width="320"
          />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">Create account</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage