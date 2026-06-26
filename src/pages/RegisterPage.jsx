import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Auth'

const steps = ['name', 'email', 'password']

function RegisterPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleNext = async () => {
    setError('')

    if (step === 0 && !form.name.trim()) {
      setError('Please enter your name')
      return
    }
    if (step === 1 && !form.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    if (step === 2) {
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }
      setLoading(true)
      try {
        await axios.post(`${API}/register`, form)
        navigate('/login?registered=true')
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed')
      }
      setLoading(false)
      return
    }

    setStep(step + 1)
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
      setError('Google sign up failed')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">⚡</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Create your account</h1>
        <p className="text-gray-500 text-sm mt-1">to continue to AI Life OS</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        
        {/* Step indicator */}
        <div className="flex gap-1.5 mb-6 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-blue-600 w-8' : 'bg-gray-200 w-4'
              }`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Step 0 — Name */}
        {step === 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What's your name?
            </label>
            <input
              autoFocus
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="First and last name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
            />
          </div>
        )}

        {/* Step 1 — Email */}
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              What's your email?
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

        {/* Step 2 — Password */}
        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Create a password
            </label>
            <input
              autoFocus
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
            />
            {/* Password strength */}
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full ${
                      form.password.length >= i * 2
                        ? form.password.length >= 8 ? 'bg-green-500' : 'bg-yellow-400'
                        : 'bg-gray-200'
                    }`}/>
                  ))}
                </div>
                <p className={`text-xs ${form.password.length >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {form.password.length >= 8 ? '✓ Strong password' : 'Keep going...'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next / Create button */}
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Creating...</>
          ) : step === 2 ? (
            'Create Account'
          ) : (
            <>Next <span>→</span></>
          )}
        </button>

        {/* Back button */}
        {step > 0 && (
          <button
            onClick={() => { setStep(step - 1); setError('') }}
            className="w-full mt-2 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            ← Back
          </button>
        )}

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
            onError={() => setError('Google sign up failed')}
            text="signup_with"
            shape="rectangular"
            size="large"
            width="320"
          />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage