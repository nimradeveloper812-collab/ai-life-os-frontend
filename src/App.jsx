import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ExpensePage from './pages/ExpensePage'
import TaskPage from './pages/TaskPage'
import GoalPage from './pages/GoalPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Navbar from './components/Navbar'

const isLoggedIn = () => !!localStorage.getItem('token')

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="max-w-5xl mx-auto px-4 py-6">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/expenses" element={<ExpensePage />} />
                  <Route path="/tasks" element={<TaskPage />} />
                  <Route path="/goals" element={<GoalPage />} />
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