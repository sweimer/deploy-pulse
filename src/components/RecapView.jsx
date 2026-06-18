function todayLocalStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getAllDaysInMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return days
}

function formatDayHeader(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

export function RecapView({ logs }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = todayLocalStr()
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`

  const monthLogs = logs.filter((l) => l.type === 'exercise' && l.date.startsWith(monthPrefix))

  const byDay = {}
  for (const log of monthLogs) {
    if (!byDay[log.date]) byDay[log.date] = {}
    const key = `${log.exerciseName}|${log.reps}|${log.weight}`
    if (!byDay[log.date][key]) {
      byDay[log.date][key] = { name: log.exerciseName, reps: log.reps, weight: log.weight, sets: 0 }
    }
    byDay[log.date][key].sets += log.sets
  }

  const days = getAllDaysInMonth(year, month).reverse()

  return (
    <div className="space-y-5">
      {days.map((dateStr) => {
        const entries = byDay[dateStr] ? Object.values(byDay[dateStr]) : []
        const isToday = dateStr === today

        return (
          <div key={dateStr}>
            <div className="flex items-center gap-2 mb-1.5">
              <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? 'text-slate-700' : 'text-slate-400'}`}>
                {formatDayHeader(dateStr)}
              </p>
              {isToday && (
                <span className="text-[10px] font-semibold bg-slate-800 text-white px-1.5 py-0.5 rounded-full leading-none">
                  today
                </span>
              )}
            </div>
            <div className="pl-3 border-l-2 border-slate-100 space-y-1">
              {entries.length > 0 ? (
                entries.map((entry, i) => (
                  <p key={i} className="text-sm text-slate-700">
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-slate-400">
                      {' '}— {entry.sets} {entry.sets === 1 ? 'set' : 'sets'} × {entry.reps} reps
                      {entry.weight > 0 ? ` @ ${entry.weight} lbs` : ''}
                    </span>
                  </p>
                ))
              ) : (
                <p className="text-sm text-slate-300">Rest day</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
