import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import DashboardPage from './pages/DashboardPage'
import ExpensePage from './pages/ExpensePage'
import TaskPage from './pages/TaskPage'
import GoalPage from './pages/GoalPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Navbar from './components/Navbar'
import HealthPage from './pages/HealthPage'
import TimePage from './pages/TimePage'
import BrainPage from './pages/BrainPage'
import AiBrainPage from './pages/AiBrainPage'

import AiBrainPage from './pages/AiBrainPage'

function ProtectedRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const seen = sessionStorage.getItem('splashSeen')
    if (seen) setShowSplash(false)
  }, [])

  const handleSplashDone = () => {
    sessionStorage.setItem('splashSeen', 'true')
    setShowSplash(false)
  }

  if (showSplash) return <SplashScreen onDone={handleSplashDone} />

  return (
    <BrowserRouter>
      <Routes>
        // Routes mein add karo:
       
<Route path="/health" element={<HealthPage />} />
<Route path="/time" element={<TimePage />} />
<Route path="/ai" element={<AiBrainPage />} />
<Route path="/brain" element={<BrainPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
              <Navbar />
              <div className="max-w-5xl mx-auto px-4 py-6">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/expenses" element={<ExpensePage />} />
                  <Route path="/tasks" element={<TaskPage />} />
                  <Route path="/goals" element={<GoalPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/health" element={<div className="text-gray-400 text-center py-20">Coming soon...</div>} />
                  <Route path="/brain" element={<div className="text-gray-400 text-center py-20">Coming soon...</div>} />
                  <Route path="/time" element={<div className="text-gray-400 text-center py-20">Coming soon...</div>} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App