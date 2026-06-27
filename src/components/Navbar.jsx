import { Link, useLocation, useNavigate } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠', full: 'Dashboard' },
  { to: '/expenses', label: '💰', full: 'Money' },
  { to: '/tasks', label: '✅', full: 'Tasks' },
  { to: '/goals', label: '🎯', full: 'Goals' },
  { to: '/health', label: '💪', full: 'Health' },
  { to: '/time', label: '⏰', full: 'Habits' },
  { to: '/brain', label: '🧠', full: 'Brain' },
 
  { to: '/profile', label: '👤', full: 'Profile' },


  { to: '/ai', label: '🤖', full: 'AI' },
]
function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'User'

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">⚡</span>
          </div>
          <span className="font-bold text-gray-800 hidden sm:block">AI Life OS</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5
                ${location.pathname === link.to
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {link.label} {link.full}
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {name[0]?.toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-red-500 transition hidden sm:block"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-around z-50">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition
              ${location.pathname === link.to ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <span className="text-lg">{link.label}</span>
            <span className="text-xs">{link.full}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navbar