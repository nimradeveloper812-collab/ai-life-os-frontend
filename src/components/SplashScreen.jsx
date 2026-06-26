import { useEffect, useState } from 'react'

function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Initializing...')

  const statuses = [
    'Initializing Life Modules...',
    'Loading Health OS...',
    'Syncing Money OS...',
    'Activating Brain OS...',
    'Connecting Time OS...',
    'AI Engine Starting...',
    'System Ready ✓'
  ]

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += 1
      setProgress(current)
      const statusIndex = Math.floor((current / 100) * statuses.length)
      setStatus(statuses[Math.min(statusIndex, statuses.length - 1)])
      if (current >= 100) {
        clearInterval(interval)
        setTimeout(onDone, 500)
      }
    }, 25)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50">

      {/* Animated rings */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-full border-2 border-blue-500/20 animate-ping absolute inset-0"/>
        <div className="w-32 h-32 rounded-full border-2 border-purple-500/20 animate-ping absolute inset-0" style={{animationDelay:'0.5s'}}/>
        <div className="w-32 h-32 rounded-full border border-blue-500/40 absolute inset-0"/>
        <div className="w-32 h-32 flex items-center justify-center relative">
          <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <span className="text-4xl">⚡</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-white text-2xl font-bold tracking-tight text-center px-4">
        Artificial Intelligence
        <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
          Life Operating System
        </span>
      </h1>

      <p className="text-gray-400 text-sm mt-2 text-center px-4 italic">
        "Where Intelligence Meets the Art of Living"
      </p>

      {/* Progress */}
      <div className="w-64 mt-10">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>{status}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1">
          <div
            className="h-1 rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Developer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-600 text-xs">Developed by</p>
        <p className="text-gray-400 text-sm font-semibold tracking-widest mt-0.5">
          SPAM<span className="text-blue-400">VERSE</span> STUDIOS
        </p>
        <p className="text-gray-600 text-xs mt-0.5">v2.0.0 · 2024</p>
      </div>

    </div>
  )
}

export default SplashScreen