import { Link, useLocation, useNavigate } from 'react-router-dom'

const links = [
  { to: '/', label: '🏠 Dashboard' },
  { to: '/expenses', label: '💰 Expenses' },
  { to: '/tasks', label: '✅ Tasks' },
  { to: '/goals', label: '🎯 Goals' },
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">⚡ AI Life OS</h1>
        <div className="flex gap-4 items-center">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1 rounded-md text-sm font-medium transition
                ${location.pathname === link.to
                  ? 'bg-white text-blue-700'
                  : 'hover:bg-blue-600'}`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar