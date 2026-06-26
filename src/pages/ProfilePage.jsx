import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Auth'

function ProfilePage() {
  const name = localStorage.getItem('name') || ''
  const email = localStorage.getItem('userId') || ''
  const [newName, setNewName] = useState(name)
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handlePasswordChange = async () => {
    if (passwords.newPass !== passwords.confirm) {
      setError('Passwords do not match')
      return
    }
    if (passwords.newPass.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    try {
      await axios.post(`${API}/change-password`, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setMsg('Password changed successfully!')
      setError('')
      setPasswords({ current: '', newPass: '', confirm: '' })
    } catch {
      setError('Current password is incorrect')
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">👤 My Profile</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{name}</h3>
            <p className="text-gray-500 text-sm">AI Life OS Member</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1">Display Name</label>
            <input
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">🔒 Change Password</h3>

        {msg && <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl mb-3 text-sm">✅ {msg}</div>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl mb-3 text-sm">⚠️ {error}</div>}

        <div className="space-y-3">
          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Current password"
            value={passwords.current}
            onChange={e => setPasswords({ ...passwords, current: e.target.value })}
          />
          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="New password"
            value={passwords.newPass}
            onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
          />
          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirm new password"
            value={passwords.confirm}
            onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
          />
          <button
            onClick={handlePasswordChange}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-3">⚙️ Account</h3>
        <button
          onClick={handleLogout}
          className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition"
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  )
}

export default ProfilePage