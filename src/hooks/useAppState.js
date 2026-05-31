import { useState, useEffect, useCallback } from 'react'
import { INITIAL_EXERCISES } from '../data/exercises'

const STORAGE_KEY = 'deploypulse_v4'
const LEGACY_KEYS = ['deploypulse_v3', 'deploypulse_v2', 'deploypulse_v1']

const todayStr = () => new Date().toISOString().split('T')[0]

// Runs at module load — migrates logs/streak/habits from any prior version.
// Writes a complete state (including fresh INITIAL_EXERCISES) so exercise
// defaults are always correct after a full page reload.
const migrateIfNeeded = () => {
  if (localStorage.getItem(STORAGE_KEY)) return
  let logs = [], streak = { count: 0, lastLogDate: null }, weeklyHabits = {}
  for (const key of LEGACY_KEYS) {
    const raw = localStorage.getItem(key)
    if (!raw) continue
    try {
      const parsed = JSON.parse(raw)
      logs = parsed.logs || []
      streak = parsed.streak || streak
      weeklyHabits = parsed.weeklyHabits || {}
    } catch { /* ignore corrupt data */ }
    break
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ exercises: INITIAL_EXERCISES, logs, streak, weeklyHabits }),
  )
}

migrateIfNeeded()

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const DEFAULT_STATE = {
  exercises: INITIAL_EXERCISES,
  logs: [],
  streak: { count: 0, lastLogDate: null },
  weeklyHabits: {},
}

export function useAppState() {
  const [state, setState] = useState(() => {
    const saved = load()
    if (!saved) return DEFAULT_STATE

    // Always start from INITIAL_EXERCISES (preserves gifUrl, formTip, etc.)
    // and overlay only the user-adjustable fields from localStorage.
    const USER_FIELDS = ['weight', 'targetReps']
    const savedMap = new Map((saved.exercises || []).map((e) => [e.id, e]))
    const exercises = INITIAL_EXERCISES.map((canonical) => {
      const saved = savedMap.get(canonical.id)
      if (!saved) return canonical
      const overrides = Object.fromEntries(USER_FIELDS.map((k) => [k, saved[k] ?? canonical[k]]))
      return { ...canonical, ...overrides }
    })

    return { ...DEFAULT_STATE, ...saved, exercises }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const updateExercise = useCallback((id, updates) => {
    setState((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }))
  }, [])

  const logExercise = useCallback((exerciseId, exerciseName, sets, reps, weight) => {
    const now = new Date()
    const today = todayStr()

    setState((prev) => {
      let { count, lastLogDate } = prev.streak

      // Streak update: increment if logging for the first time today
      if (lastLogDate !== today) {
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        const yStr = yesterday.toISOString().split('T')[0]
        count = lastLogDate === yStr ? count + 1 : 1
        lastLogDate = today
      }

      return {
        ...prev,
        logs: [
          ...prev.logs,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            exerciseId,
            exerciseName,
            sets,
            reps,
            weight,
            timestamp: now.toISOString(),
            date: today,
          },
        ],
        streak: { count, lastLogDate },
      }
    })
  }, [])

  const toggleWeeklyHabit = useCallback((date, habit) => {
    setState((prev) => ({
      ...prev,
      weeklyHabits: {
        ...prev.weeklyHabits,
        [date]: {
          ...(prev.weeklyHabits[date] || {}),
          [habit]: !(prev.weeklyHabits[date]?.[habit] ?? false),
        },
      },
    }))
  }, [])

  const today = todayStr()
  const todayLogs = state.logs.filter((l) => l.date === today)

  // Count unique exercises logged today for progress ring
  const exercisesCompletedToday = new Set(todayLogs.map((l) => l.exerciseId)).size

  // Estimate ~2 active minutes per set completed
  const totalActiveMinutes = todayLogs.reduce((acc, l) => acc + l.sets * 2, 0)

  // Unique days with at least one log entry in the current Mon–Sun week
  const dow = new Date().getDay() // 0 = Sun
  const daysFromMonday = (dow + 6) % 7
  const thisMonday = new Date()
  thisMonday.setDate(thisMonday.getDate() - daysFromMonday)
  const weekStartStr = thisMonday.toISOString().split('T')[0]
  const daysExercisedThisWeek = new Set(
    state.logs.filter((l) => l.date >= weekStartStr && l.date <= today).map((l) => l.date),
  ).size

  return {
    ...state,
    updateExercise,
    logExercise,
    toggleWeeklyHabit,
    todayLogs,
    exercisesCompletedToday,
    totalActiveMinutes,
    daysExercisedThisWeek,
    today,
  }
}
