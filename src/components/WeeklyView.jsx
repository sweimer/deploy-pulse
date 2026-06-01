import { Bike, Sparkles, Dumbbell, Mountain, PersonStanding } from 'lucide-react'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Returns the 7 Date objects for Mon–Sun of the current week
function currentWeekDays() {
  const today = new Date()
  const dow = today.getDay() // 0 = Sun
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function iso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function WeeklyView({ weeklyHabits, logs, onToggle }) {
  const days = currentWeekDays()
  const todayIso = iso(new Date())

  // Weekly summary counts
  const weekDayStrings = days.map(iso)
  const totalLifts = weekDayStrings.reduce((acc, ds) => {
    return acc + new Set(logs.filter((l) => l.date === ds && l.type !== 'activity').map((l) => l.exerciseId)).size
  }, 0)
  const totalYoga = weekDayStrings.filter((ds) => weeklyHabits[ds]?.yoga).length
  const totalWalks = weekDayStrings.filter((ds) => weeklyHabits[ds]?.walk).length
  const totalPeloton = weekDayStrings.filter((ds) => weeklyHabits[ds]?.peloton).length
  const totalOutdoorBike = weekDayStrings.filter((ds) => weeklyHabits[ds]?.outdoorBike).length

  const summaryCards = [
    { label: 'Lifts This Week',  value: totalLifts,      icon: <Dumbbell size={18} className="text-emerald-500" />,      bg: 'bg-emerald-50' },
    { label: 'Yoga Sessions',    value: totalYoga,        icon: <Sparkles size={18} className="text-violet-500" />,       bg: 'bg-violet-50'  },
    { label: 'Walks',            value: totalWalks,       icon: <PersonStanding size={18} className="text-teal-500" />,   bg: 'bg-teal-50'    },
    { label: 'Peloton Sessions', value: totalPeloton,     icon: <Bike size={18} className="text-blue-500" />,             bg: 'bg-blue-50'    },
    { label: 'Outdoor Rides',    value: totalOutdoorBike, icon: <Mountain size={18} className="text-orange-500" />,       bg: 'bg-orange-50'  },
  ]

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {summaryCards.map(({ label, value, icon, bg }) => (
          <div key={label} className={`${bg} rounded-2xl px-4 py-3.5 flex items-center gap-3`}>
            {icon}
            <div>
              <p className="text-2xl font-bold text-slate-700">{value}</p>
              <p className="text-xs text-slate-500 leading-snug mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">Weekly Habits</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap to mark a session done for the day
          </p>
        </div>

        <div className="divide-y divide-slate-50">
          {days.map((day, i) => {
            const ds = iso(day)
            const isToday = ds === todayIso
            const isPast = ds < todayIso
            const habits = weeklyHabits[ds] || {}
            const uniqueExercises = new Set(
              logs.filter((l) => l.date === ds && l.type !== 'activity').map((l) => l.exerciseId),
            ).size

            return (
              <div
                key={ds}
                className={`flex flex-wrap items-center gap-2 px-5 py-3.5 ${isToday ? 'bg-emerald-50/40' : ''}`}
              >
                {/* Day label */}
                <div className="w-9 shrink-0">
                  <p
                    className={`text-sm font-bold leading-none ${
                      isToday
                        ? 'text-emerald-600'
                        : isPast
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {DAY_NAMES[i]}
                  </p>
                  <p className="text-[17px] text-slate-400 mt-0.5">{day.getDate()}</p>
                </div>

                {/* Lift badge */}
                <div className="flex-1 flex items-center gap-1.5 min-w-[80px]">
                  <Dumbbell
                    size={14}
                    className={uniqueExercises > 0 ? 'text-emerald-500' : 'text-slate-200'}
                  />
                  {uniqueExercises > 0 ? (
                    <span className="text-xs font-semibold text-emerald-600">
                      {uniqueExercises} exercise{uniqueExercises > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">No lifts</span>
                  )}
                </div>

                {/* Habit toggles */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onToggle(ds, 'yoga')}
                    className={[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                      'transition-all duration-150',
                      habits.yoga
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-slate-50 text-slate-400 hover:bg-violet-50 hover:text-violet-500',
                    ].join(' ')}
                  >
                    <Sparkles size={13} />
                    Yoga
                  </button>

                  <button
                    onClick={() => onToggle(ds, 'walk')}
                    className={[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                      'transition-all duration-150',
                      habits.walk
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-teal-500',
                    ].join(' ')}
                  >
                    <PersonStanding size={13} />
                    Walk
                  </button>

                  <button
                    onClick={() => onToggle(ds, 'peloton')}
                    className={[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                      'transition-all duration-150',
                      habits.peloton
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500',
                    ].join(' ')}
                  >
                    <Bike size={13} />
                    Peloton
                  </button>

                  <button
                    onClick={() => onToggle(ds, 'outdoorBike')}
                    className={[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold',
                      'transition-all duration-150',
                      habits.outdoorBike
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-500',
                    ].join(' ')}
                  >
                    <Mountain size={13} />
                    Outdoor Bike
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
