import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Bike, Sparkles, Dumbbell, Mountain, PersonStanding } from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────────────────────

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// Offset so Monday is column 0 (JS getDay() is 0=Sun)
function mondayOffset(date) {
  return (date.getDay() + 6) % 7
}

// All calendar cells for a given month: leading nulls + day numbers
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = mondayOffset(firstDay)
  const cells = [] // null = empty leading cell
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}

// Intensity tier → Tailwind classes based on total sets logged
function intensityClasses(totalSets) {
  if (totalSets === 0) return { bg: 'bg-slate-100', text: 'text-slate-400', ring: '' }
  if (totalSets <= 3)  return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-1 ring-emerald-200' }
  if (totalSets <= 7)  return { bg: 'bg-emerald-200', text: 'text-emerald-800', ring: 'ring-1 ring-emerald-300' }
  if (totalSets <= 11) return { bg: 'bg-emerald-300', text: 'text-emerald-900', ring: 'ring-1 ring-emerald-400' }
  return { bg: 'bg-emerald-500', text: 'text-white', ring: '' }
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_HEADERS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const HABITS = [
  { key: 'yoga',        label: 'Yoga',         dot: 'bg-violet-400', badge: 'bg-violet-100 text-violet-700', hover: 'hover:bg-violet-50 hover:text-violet-500', active: 'bg-violet-100 text-violet-700', icon: (s) => <Sparkles size={s} /> },
  { key: 'walk',        label: 'Walk',         dot: 'bg-teal-400',   badge: 'bg-teal-100 text-teal-700',     hover: 'hover:bg-teal-50 hover:text-teal-500',     active: 'bg-teal-100 text-teal-700',     icon: (s) => <PersonStanding size={s} /> },
  { key: 'peloton',     label: 'Peloton',      dot: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700',     hover: 'hover:bg-blue-50 hover:text-blue-500',     active: 'bg-blue-100 text-blue-700',     icon: (s) => <Bike size={s} /> },
  { key: 'outdoorBike', label: 'Outdoor Bike', dot: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700', hover: 'hover:bg-orange-50 hover:text-orange-500', active: 'bg-orange-100 text-orange-700', icon: (s) => <Mountain size={s} /> },
]

// ── CalendarView ─────────────────────────────────────────────────────────────

export function CalendarView({ logs, weeklyHabits, onToggle }) {
  const today = new Date()
  const todayIso = isoDate(today)

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedIso, setSelectedIso] = useState(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const canGoForward = new Date(year, month + 1, 1) <= new Date(today.getFullYear(), today.getMonth() + 1, 1)

  // Build per-day stats map for all logs
  const dayStats = useMemo(() => {
    const map = {}
    for (const log of logs) {
      if (log.type === 'activity') continue
      if (!map[log.date]) map[log.date] = { totalSets: 0, exercises: [] }
      map[log.date].totalSets += log.sets
      map[log.date].exercises.push(log)
    }
    return map
  }, [logs])

  const cells = buildCalendarGrid(year, month)

  // Month-level totals (for the summary strip)
  const monthTotals = useMemo(() => {
    let sets = 0, activeDays = 0
    const habitCounts = Object.fromEntries(HABITS.map((h) => [h.key, 0]))
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = isoDate(new Date(year, month, d))
      const stats = dayStats[ds]
      if (stats?.totalSets > 0) { sets += stats.totalSets; activeDays++ }
      for (const h of HABITS) {
        if (weeklyHabits[ds]?.[h.key]) habitCounts[h.key]++
      }
    }
    return { sets, activeDays, ...habitCounts }
  }, [dayStats, weeklyHabits, year, month])

  const selectedStats = selectedIso ? dayStats[selectedIso] : null
  const selectedHabits = selectedIso ? (weeklyHabits[selectedIso] || {}) : null

  return (
    <div className="max-w-2xl space-y-4">
      {/* ── Calendar card ── */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">

        {/* Month navigation header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-700">
              {MONTH_NAMES[month]} {year}
            </h2>
            <p className="text-[17px] text-slate-400 mt-0.5">
              {monthTotals.activeDays} active day{monthTotals.activeDays !== 1 ? 's' : ''} · {monthTotals.sets} total sets
            </p>
          </div>

          <button
            onClick={nextMonth}
            disabled={!canGoForward}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day-of-week header row */}
        <div className="grid grid-cols-7 border-b border-slate-50">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="py-2 text-center text-[17px] font-semibold text-slate-400 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-px bg-slate-50 p-3 gap-2">
          {cells.map((date, i) => {
            if (!date) {
              return <div key={`empty-${i}`} />
            }

            const ds = isoDate(date)
            const stats = dayStats[ds]
            const totalSets = stats?.totalSets ?? 0
            const { bg, text, ring } = intensityClasses(totalSets)
            const isToday = ds === todayIso
            const isSelected = ds === selectedIso
            const habits = weeklyHabits[ds] || {}
            const isFuture = ds > todayIso
            const activeHabits = HABITS.filter((h) => habits[h.key])

            return (
              <button
                key={ds}
                onClick={() => setSelectedIso(isSelected ? null : ds)}
                disabled={isFuture}
                className={[
                  'relative flex flex-col items-center justify-center rounded-xl p-2 min-h-[60px]',
                  'transition-all duration-150 group',
                  isFuture
                    ? 'opacity-30 cursor-default'
                    : 'cursor-pointer hover:scale-[1.04] hover:shadow-md active:scale-100',
                  bg,
                  ring,
                  isSelected && !isFuture ? 'ring-2 ring-offset-1 ring-slate-700 scale-[1.04]' : '',
                  isToday && !isSelected ? 'ring-2 ring-offset-1 ring-emerald-500' : '',
                ].join(' ')}
              >
                {/* Day number */}
                <span
                  className={[
                    'text-[17px] font-bold leading-none',
                    isToday ? 'text-emerald-600' : totalSets > 0 ? text : 'text-slate-400',
                  ].join(' ')}
                >
                  {date.getDate()}
                </span>

                {/* Sets count badge */}
                {totalSets > 0 && (
                  <span className={['mt-1 text-[18px] font-bold leading-none', text].join(' ')}>
                    {totalSets}
                  </span>
                )}

                {/* Habit micro-dots */}
                {activeHabits.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {activeHabits.map((h) => (
                      <span key={h.key} className={`w-1.5 h-1.5 rounded-full ${h.dot}`} title={h.label} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Intensity legend */}
        <div className="flex flex-wrap items-center justify-end gap-2 px-5 py-3 border-t border-slate-50">
          <span className="text-[17px] text-slate-400 mr-1">Sets:</span>
          {[
            { label: '0', bg: 'bg-slate-100' },
            { label: '1–3', bg: 'bg-emerald-100' },
            { label: '4–7', bg: 'bg-emerald-200' },
            { label: '8–11', bg: 'bg-emerald-300' },
            { label: '12+', bg: 'bg-emerald-500' },
          ].map(({ label, bg }) => (
            <div key={label} className="flex items-center gap-1">
              <span className={`w-4 h-4 rounded ${bg} inline-block`} />
              <span className="text-[16px] text-slate-400">{label}</span>
            </div>
          ))}
          {HABITS.map((h) => (
            <span key={h.key} className="ml-1 flex items-center gap-1 text-[16px] text-slate-400">
              <span className={`w-2 h-2 rounded-full ${h.dot} inline-block`} /> {h.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Month summary strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Sets',   value: monthTotals.sets,        icon: <Dumbbell size={15} className="text-emerald-500" />,       bg: 'bg-emerald-50' },
          { label: 'Active Days',  value: monthTotals.activeDays,  icon: <span className="text-base leading-none">🔥</span>,         bg: 'bg-amber-50'   },
          { label: 'Yoga',         value: monthTotals.yoga,        icon: <Sparkles size={15} className="text-violet-500" />,         bg: 'bg-violet-50'  },
          { label: 'Walks',        value: monthTotals.walk,        icon: <PersonStanding size={15} className="text-teal-500" />,     bg: 'bg-teal-50'    },
          { label: 'Peloton',      value: monthTotals.peloton,     icon: <Bike size={15} className="text-blue-500" />,               bg: 'bg-blue-50'    },
          { label: 'Outdoor Bike', value: monthTotals.outdoorBike, icon: <Mountain size={15} className="text-orange-500" />,         bg: 'bg-orange-50'  },
        ].map(({ label, value, icon, bg }) => (
          <div key={label} className={`${bg} rounded-2xl px-4 py-3 flex items-center gap-2.5`}>
            {icon}
            <div>
              <p className="text-xl font-bold text-slate-700 leading-none">{value}</p>
              <p className="text-[17px] text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Day detail panel ── */}
      {selectedIso && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-slide-up">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-700">
                {new Date(selectedIso + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric',
                })}
              </h3>
              {selectedStats ? (
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedStats.totalSets} sets · {new Set(selectedStats.exercises.map(e => e.exerciseId)).size} exercises · ~{selectedStats.totalSets * 2} min active
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-0.5">Rest day</p>
              )}
            </div>
            <button
              onClick={() => setSelectedIso(null)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              dismiss
            </button>
          </div>

          {/* Habit toggles */}
          {onToggle && selectedHabits !== null && (
            <div className="flex flex-wrap gap-2 px-5 pt-3">
              {HABITS.map((h) => {
                const isOn = selectedHabits[h.key]
                return (
                  <button
                    key={h.key}
                    onClick={() => onToggle(selectedIso, h.key)}
                    className={[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                      'transition-all duration-150',
                      isOn ? h.active : `bg-slate-50 text-slate-400 ${h.hover}`,
                    ].join(' ')}
                  >
                    {h.icon(12)}
                    {h.label}
                    {typeof isOn === 'number' && isOn > 0 && (
                      <span className="ml-0.5 opacity-70">{isOn} min</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Exercise log entries */}
          <div className="px-5 pb-4 pt-3 space-y-2">
            {!selectedStats?.exercises?.length ? (
              <p className="text-sm text-slate-400 py-4 text-center">No exercises logged this day.</p>
            ) : (
              Object.values(
                selectedStats.exercises.reduce((acc, log) => {
                  if (!acc[log.exerciseId]) acc[log.exerciseId] = { name: log.exerciseName, entries: [] }
                  acc[log.exerciseId].entries.push(log)
                  return acc
                }, {}),
              ).map(({ name, entries }) => (
                <div key={name} className="flex items-center gap-3 bg-slate-50/70 rounded-xl px-3.5 py-2.5">
                  <div className="w-[3px] self-stretch rounded-full bg-emerald-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[19px] font-semibold text-slate-700 leading-snug">{name}</p>
                    <div className="flex flex-wrap gap-x-3 mt-0.5">
                      {entries.map((e) => (
                        <span key={e.id} className="text-xs text-slate-500">
                          {e.sets}×{e.reps} @ {e.weight} lbs
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
