import { useCallback } from 'react'
import { usePGlite, useLiveQuery } from '@electric-sql/pglite-react'
import { INITIAL_EXERCISES } from '../data/exercises'

const todayStr = () => new Date().toISOString().split('T')[0]

// Stored as TEXT in DB: 'true', 'false', or a numeric string like '30'
const parseHabitValue = (v) => {
  if (v === 'true') return true
  if (v === 'false') return false
  const n = Number(v)
  return isNaN(n) ? false : n
}

export function useAppState() {
  const db = usePGlite()

  const logsResult = useLiveQuery('SELECT * FROM logs ORDER BY timestamp ASC')
  const prefsResult = useLiveQuery('SELECT * FROM exercise_prefs')
  const habitsResult = useLiveQuery('SELECT * FROM habits')

  // Merge user prefs onto canonical exercise definitions
  const prefsMap = new Map((prefsResult?.rows ?? []).map((r) => [r.id, r]))
  const exercises = INITIAL_EXERCISES.map((ex) => {
    const pref = prefsMap.get(ex.id)
    return pref ? { ...ex, weight: pref.weight, targetReps: pref.target_reps } : ex
  })

  // Reconstruct weeklyHabits shape { [date]: { [habitKey]: boolean | number } }
  const weeklyHabits = {}
  for (const row of habitsResult?.rows ?? []) {
    if (!weeklyHabits[row.date]) weeklyHabits[row.date] = {}
    weeklyHabits[row.date][row.habit_key] = parseHabitValue(row.value)
  }

  // Normalize DB column names to the shape the UI expects
  const logs = (logsResult?.rows ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    exerciseId: row.exercise_id,
    exerciseName: row.exercise_name,
    sets: row.sets,
    reps: row.reps,
    weight: row.weight,
    activityKey: row.activity_key,
    durationMinutes: row.duration_minutes,
    timestamp: row.timestamp,
    date: row.date,
  }))

  const today = todayStr()
  const todayLogs = logs.filter((l) => l.date === today)

  const exercisesCompletedToday = new Set(
    todayLogs.filter((l) => l.type !== 'activity').map((l) => l.exerciseId),
  ).size

  const totalActiveMinutes = todayLogs.reduce(
    (acc, l) => acc + (l.type === 'activity' ? (l.durationMinutes || 0) : (l.sets || 0) * 2),
    0,
  )

  const dow = new Date().getDay()
  const daysFromMonday = (dow + 6) % 7
  const thisMonday = new Date()
  thisMonday.setDate(thisMonday.getDate() - daysFromMonday)
  const weekStartStr = thisMonday.toISOString().split('T')[0]
  const daysExercisedThisWeek = new Set(
    logs.filter((l) => l.date >= weekStartStr && l.date <= today).map((l) => l.date),
  ).size

  const updateExercise = useCallback(
    async (id, updates) => {
      if ('weight' in updates) {
        await db.query('UPDATE exercise_prefs SET weight = $1 WHERE id = $2', [updates.weight, id])
      }
      if ('targetReps' in updates) {
        await db.query('UPDATE exercise_prefs SET target_reps = $1 WHERE id = $2', [updates.targetReps, id])
      }
    },
    [db],
  )

  const logExercise = useCallback(
    async (exerciseId, exerciseName, sets, reps, weight) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      await db.query(
        `INSERT INTO logs (id, type, exercise_id, exercise_name, sets, reps, weight, timestamp, date)
         VALUES ($1, 'exercise', $2, $3, $4, $5, $6, $7, $8)`,
        [id, exerciseId, exerciseName, sets, reps, weight, new Date().toISOString(), todayStr()],
      )
    },
    [db],
  )

  const toggleWeeklyHabit = useCallback(
    async (date, habitKey) => {
      const { rows } = await db.query(
        'SELECT value FROM habits WHERE date = $1 AND habit_key = $2',
        [date, habitKey],
      )
      const current = rows[0]?.value
      const newValue = current && current !== 'false' ? 'false' : 'true'
      await db.query(
        `INSERT INTO habits (date, habit_key, value) VALUES ($1, $2, $3)
         ON CONFLICT (date, habit_key) DO UPDATE SET value = EXCLUDED.value`,
        [date, habitKey, newValue],
      )
    },
    [db],
  )

  const logHabit = useCallback(
    async (date, habitKey, minutes, activityName) => {
      await db.query(
        `INSERT INTO habits (date, habit_key, value) VALUES ($1, $2, $3)
         ON CONFLICT (date, habit_key) DO UPDATE SET value = EXCLUDED.value`,
        [date, habitKey, String(minutes)],
      )
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      await db.query(
        `INSERT INTO logs (id, type, activity_key, exercise_name, duration_minutes, timestamp, date)
         VALUES ($1, 'activity', $2, $3, $4, $5, $6)`,
        [id, habitKey, activityName, minutes, new Date().toISOString(), date],
      )
    },
    [db],
  )

  return {
    exercises,
    logs,
    weeklyHabits,
    updateExercise,
    logExercise,
    toggleWeeklyHabit,
    logHabit,
    todayLogs,
    exercisesCompletedToday,
    totalActiveMinutes,
    daysExercisedThisWeek,
    today,
  }
}
