import { useState, useEffect, useRef } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'

const STORAGE_KEY = 'deploypulse_coach_key'
const API_URL = 'https://api.anthropic.com/v1/messages'

const SYSTEM_PROMPT = `You are a supportive fitness coach for a 60-year-old web developer who does short "exercise snacks" at their desk during software deployment breaks. They use dumbbells and kettlebells. Be encouraging, specific to their data, and practical. Keep your response under 300 words.

Respond in exactly three short sections with these markdown headers:
## Progress
## Tips
## Keep Going`

function buildUserMessage(logs, weeklyHabits) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const todayLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // Exercise logs — group by date, then by (name, reps, weight), sum sets
  const exerciseLogs = logs.filter((l) => l.type === 'exercise' && l.date.startsWith(monthPrefix))
  const byDay = {}
  for (const log of exerciseLogs) {
    if (!byDay[log.date]) byDay[log.date] = {}
    const key = `${log.exerciseName}|${log.reps}|${log.weight}`
    if (!byDay[log.date][key]) {
      byDay[log.date][key] = { name: log.exerciseName, reps: log.reps, weight: log.weight, sets: 0 }
    }
    byDay[log.date][key].sets += log.sets
  }

  const exerciseDates = Object.keys(byDay).sort()
  let exerciseSection = 'Exercise logs:\n'
  if (exerciseDates.length === 0) {
    exerciseSection += '(no exercises logged yet this month)\n'
  } else {
    for (const date of exerciseDates) {
      const [y, m, d] = date.split('-').map(Number)
      const label = new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const entries = Object.values(byDay[date]).map((e) => {
        const w = e.weight > 0 ? ` @ ${e.weight} lbs` : ''
        return `${e.name} — ${e.sets} ${e.sets === 1 ? 'set' : 'sets'} × ${e.reps} reps${w}`
      })
      exerciseSection += `- ${label}: ${entries.join(', ')}\n`
    }
  }

  // Cardio habits
  const cardioKeys = ['peloton', 'walk', 'yoga', 'outdoorBike']
  const cardioNames = { peloton: 'Peloton Ride', walk: 'Walk', yoga: 'Yoga', outdoorBike: 'Outdoor Bike' }
  const cardioDates = Object.keys(weeklyHabits).filter((d) => d.startsWith(monthPrefix)).sort()
  const cardioLines = []
  for (const date of cardioDates) {
    const activities = cardioKeys.filter((k) => weeklyHabits[date]?.[k]).map((k) => cardioNames[k])
    if (activities.length > 0) {
      const [y, m, d] = date.split('-').map(Number)
      const label = new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      cardioLines.push(`- ${label}: ${activities.join(', ')}`)
    }
  }
  const cardioSection =
    '\nCardio habits:\n' +
    (cardioLines.length > 0 ? cardioLines.join('\n') + '\n' : '(no cardio logged yet this month)\n')

  return `Here is my workout data for ${monthName}:\n\n${exerciseSection}${cardioSection}\nToday is ${todayLabel}. Please analyze my month so far.`
}

function renderMarkdown(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <h3 key={i} className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mt-5 mb-1.5 first:mt-0">
          {line.slice(3)}
        </h3>
      )
    }
    if (line.trim()) {
      return (
        <p key={i} className="text-[17px] text-slate-700 leading-relaxed">
          {line}
        </p>
      )
    }
    return null
  })
}

export function CoachView({ logs, weeklyHabits }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [keyInput, setKeyInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // null | 'invalid_key' | 'network'
  const abortRef = useRef(null)

  useEffect(() => {
    if (apiKey) fetchCoaching()
    return () => abortRef.current?.abort()
  }, [apiKey]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchCoaching() {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setResponse('')
    setError(null)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          stream: true,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildUserMessage(logs, weeklyHabits) }],
        }),
        signal: abortRef.current.signal,
      })

      if (res.status === 401) { setError('invalid_key'); setLoading(false); return }
      if (!res.ok) {
        let detail = `HTTP ${res.status}`
        try { const body = await res.json(); if (body?.error?.message) detail = body.error.message } catch { /* ignore */ }
        setError(`err:${detail}`)
        setLoading(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              setResponse((prev) => prev + parsed.delta.text)
            }
          } catch { /* ignore malformed SSE lines */ }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError(`err:${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function saveKey() {
    const trimmed = keyInput.trim()
    if (!trimmed) return
    localStorage.setItem(STORAGE_KEY, trimmed)
    setApiKey(trimmed)
    setKeyInput('')
  }

  function clearKey() {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey('')
    setResponse('')
    setError(null)
  }

  if (!apiKey) {
    return (
      <div className="max-w-sm mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
          <h2 className="text-[19px] font-semibold text-slate-800 mb-1">AI Coaching</h2>
          <p className="text-[15px] text-slate-400 mb-4">
            Enter your Anthropic API key to get personalized coaching based on your workout data.
          </p>
          <label className="block mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">API Key</span>
            <input
              type="password"
              name="apiKey"
              id="apiKey"
              autoComplete="current-password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveKey()}
              placeholder="sk-ant-..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-[15px] text-slate-700 outline-none focus:border-slate-400"
            />
          </label>
          <button
            onClick={saveKey}
            disabled={!keyInput.trim()}
            className="w-full bg-slate-800 text-white text-[15px] font-semibold py-2.5 rounded-xl hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            Save Key
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 min-h-[120px]">
        {loading && !response && (
          <div className="flex items-center gap-2 text-slate-400 text-[15px]">
            <Loader2 size={15} className="animate-spin shrink-0" />
            Thinking…
          </div>
        )}
        {error === 'invalid_key' && (
          <p className="text-[15px] text-red-500">
            Invalid API key. Please check your key and try again.{' '}
            <button onClick={clearKey} className="underline">Change key</button>
          </p>
        )}
        {error && error !== 'invalid_key' && (
          <div className="space-y-1.5">
            <p className="text-[15px] text-red-500 font-medium">Something went wrong.</p>
            <p className="text-[13px] text-red-400 font-mono break-all">{error.replace(/^err:/, '')}</p>
            <button onClick={fetchCoaching} className="text-[15px] text-red-500 underline block">Retry</button>
          </div>
        )}
        {response && <div>{renderMarkdown(response)}</div>}
      </div>

      <div className="flex flex-col items-center gap-1 mt-3">
        {!loading && response && (
          <button
            onClick={fetchCoaching}
            className="flex items-center gap-1 text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RefreshCw size={12} />
            Refresh analysis
          </button>
        )}
        <button onClick={clearKey} className="text-[12px] text-slate-300 hover:text-slate-500 transition-colors">
          Change API key
        </button>
      </div>
    </div>
  )
}
