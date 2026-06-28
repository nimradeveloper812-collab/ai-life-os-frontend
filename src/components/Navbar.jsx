import { Link, useLocation, useNavigate } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'

const links = [
  { to: '/', label: '🏠', full: 'Dashboard' },
  { to: '/expenses', label: '💰', full: 'Money' },
  { to: '/tasks', label: '✅', full: 'Tasks' },
  { to: '/goals', label: '🎯', full: 'Goals' },
  { to: '/health', label: '💪', full: 'Health' },
  { to: '/time', label: '⏰', full: 'Habits' },
  { to: '/brain', label: '🧠', full: 'Brain' },
  { to: '/ai', label: '🤖', full: 'AI' },
  { to: '/score', label: '⭐', full: 'Score' },
  { to: '/profile', label: '👤', full: 'Profile' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'User'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">⚡</span>
          </div>
          <span className="font-bold text-gray-800 dark:text-white hidden sm:block">AI Life OS</span>
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex gap-1 overflow-x-auto">
          {links.map(link => (
            <Link key={link.to} to={link.to}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1
                ${location.pathname === link.to
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {link.label} {link.full}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {name[0]?.toUpperCase()}
          </div>
          <button onClick={handleLogout}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 transition hidden sm:block">
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-1 py-1 flex justify-around z-50">
        {links.slice(0, 6).map(link => (
          <Link key={link.to} to={link.to}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition
              ${location.pathname === link.to ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
            <span className="text-base">{link.label}</span>
            <span className="text-xs">{link.full}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}