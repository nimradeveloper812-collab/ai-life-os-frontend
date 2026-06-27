import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API = 'https://ai-life-os-backend-cuc9.onrender.com/api/Ai'
const userId = () => localStorage.getItem('userId')
const headers = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const QUICK_PROMPTS = [
  "Give me my life summary",
  "How can I save more money?",
  "Help me be more productive",
  "What should I focus on today?",
  "Analyze my spending habits",
  "Motivate me!",
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <div className="flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}/>
        ))}
      </div>
      <span className="text-xs text-gray-400 ml-1">AI is thinking...</span>
    </div>
  )
}

function Message({ msg, isNew }) {
  const [displayed, setDisplayed] = useState(msg.role === 'user' ? msg.content : '')
  const [done, setDone] = useState(msg.role === 'user')

  useEffect(() => {
    if (msg.role === 'ai' && isNew) {
      let i = 0
      const interval = setInterval(() => {
        setDisplayed(msg.content.slice(0, i))
        i += 3
        if (i > msg.content.length) {
          setDisplayed(msg.content)
          setDone(true)
          clearInterval(interval)
        }
      }, 20)
      return () => clearInterval(interval)
    } else {
      setDisplayed(msg.content)
      setDone(true)
    }
  }, [])

  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      {msg.role === 'ai' && (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
          ⚡
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 ${
        msg.role === 'user'
          ? 'bg-blue-600 text-white rounded-tr-sm'
          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
      }`}>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{displayed}
          {!done && <span className="animate-pulse">▌</span>}
        </p>
        <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
          {msg.time}
        </p>
      </div>
      {msg.role === 'user' && (
        <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1">
          {(localStorage.getItem('name') || 'U')[0].toUpperCase()}
        </div>
      )}
    </div>
  )
}

function AiBrainPage() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `👋 Hello! I'm your **AI Life OS Brain** — powered by Llama 3.\n\nI can analyze your:\n💰 Finances & spending\n✅ Tasks & productivity\n🎯 Goals & progress\n\nAsk me anything or tap a quick prompt below!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: 0
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [activeTab, setActiveTab] = useState('chat')
  const [newMsgId, setNewMsgId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsg = { role: 'user', content: msg, time, id: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${API}/analyze/${userId()}`,
        { message: msg }, headers())
      const aiMsg = {
        role: 'ai',
        content: res.data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: Date.now() + 1
      }
      setNewMsgId(aiMsg.id)
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: '⚠️ Sorry, something went wrong. Please try again!',
        time,
        id: Date.now() + 1
      }])
    }
    setLoading(false)
  }

  const generateReport = async () => {
    setReportLoading(true)
    setReport(null)
    try {
      const res = await axios.post(`${API}/daily-report/${userId()}`, {}, headers())
      setReport(res.data.report)
    } catch {
      setReport('⚠️ Could not generate report. Try again!')
    }
    setReportLoading(false)
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Brain</h2>
            <p className="text-blue-200 text-sm">Powered by Llama 3 · Your personal life AI</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
            <span className="text-xs text-blue-200">Online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['chat', 'report'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>
            {tab === 'chat' ? '💬 AI Chat' : '📊 Daily Report'}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4">
            {messages.map(msg => (
              <Message key={msg.id} msg={msg} isNew={msg.id === newMsgId} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-gray-100 bg-white">
            {QUICK_PROMPTS.map(p => (
              <button key={p}
                onClick={() => sendMessage(p)}
                disabled={loading}
                className="flex-shrink-0 text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ask your AI anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white w-10 h-10 rounded-xl flex items-center justify-center transition"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
              ) : '→'}
            </button>
          </div>
        </div>
      )}

      {/* Report Tab */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="font-bold text-gray-800 text-lg">Daily Life Report</h3>
              <p className="text-gray-500 text-sm mt-1">AI analyzes your entire life data and generates insights</p>
            </div>

            <button
              onClick={generateReport}
              disabled={reportLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {reportLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Generating your report...
                </>
              ) : (
                <>🤖 Generate My Daily Report</>
              )}
            </button>
          </div>

          {report && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-sm">⚡</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">AI Life OS Report</p>
                  <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{report}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AiBrainPage