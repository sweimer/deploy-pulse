import { useCallback, useState } from 'react'
import { Calendar, CalendarDays, Dumbbell } from 'lucide-react'
import { useAppState } from './hooks/useAppState'
import { Header } from './components/Header'
import { ExerciseCard } from './components/ExerciseCard'
import { ActivityCard } from './components/ActivityCard'
import { ActiveBreakModal } from './components/ActiveBreakModal'
import { HistoryFeed } from './components/HistoryFeed'
import { WeeklyView } from './components/WeeklyView'
import { CalendarView } from './components/CalendarView'

const GIF_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'

const ACTIVITIES = [
  { activityKey: 'yoga',        name: 'Yoga',           label: '✨ Yoga',      color: 'violet', gifUrl: `${GIF_BASE}/spine/upward-facing-dog.gif`                  },
  { activityKey: 'walk',        name: 'Walk',           label: '🚶 Walk',      color: 'teal',   gifUrl: `${GIF_BASE}/cardio/walking-on-incline-treadmill.gif`      },
  { activityKey: 'peloton',     name: 'Peloton Ride',   label: '🚴 Peloton',  color: 'blue',   gifUrl: `${GIF_BASE}/cardio/stationary-bike-run-v-3.gif`           },
  { activityKey: 'outdoorBike', name: 'Outdoor Bike',   label: '⛰️ Outdoor',  color: 'orange', gifUrl: `${GIF_BASE}/cardio/cycle-cross-trainer.gif`              },
]

export default function App() {
  const [tab, setTab] = useState('today')
  const [activeExercise, setActiveExercise] = useState(null)

  const {
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
  } = useAppState()

  const completedIds = new Set(todayLogs.map((l) => l.exerciseId))
  const outOfSeat = exercises.filter((e) => e.category === 'out-of-seat')
  const seated = exercises.filter((e) => e.category === 'seated')
  const pressRaise = exercises.filter((e) => e.category === 'press-raise')
  const bodyweightExercises = exercises.filter((e) => e.category === 'bodyweight')

  const openBreak = useCallback((exercise) => setActiveExercise(exercise), [])
  const closeBreak = useCallback(() => setActiveExercise(null), [])

  const handleLog = useCallback(
    (exerciseId, exerciseName, sets, reps, weight) => {
      logExercise(exerciseId, exerciseName, sets, reps, weight)
    },
    [logExercise],
  )

  const tabs = [
    { id: 'today', label: 'Today', icon: <Dumbbell size={14} /> },
    { id: 'week', label: 'This Week', icon: <Calendar size={14} /> },
    { id: 'calendar', label: 'This Month', icon: <CalendarDays size={14} /> },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf8' }}>
      <Header
        daysExercisedThisWeek={daysExercisedThisWeek}
        exercisesCompletedToday={exercisesCompletedToday}
        totalExercises={exercises.length}
        totalActiveMinutes={totalActiveMinutes}
      />

      {/* Tab navigation */}
      <div className="max-w-5xl mx-auto px-6 pt-5 pb-3">
        <div className="flex gap-1 bg-white rounded-2xl p-1 w-fit shadow-card border border-slate-100">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold',
                'transition-all duration-150',
                tab === id
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
              ].join(' ')}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 pb-12">
        {tab === 'today' ? (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* ── History feed — top on mobile, right sidebar on desktop ── */}
            <div className="w-full lg:w-56 shrink-0 lg:sticky lg:top-[81px] lg:order-last">
              <HistoryFeed
                todayLogs={todayLogs}
                totalActiveMinutes={totalActiveMinutes}
              />
            </div>

            {/* ── Exercise cards ── */}
            <div className="flex-1 min-w-0 space-y-6 w-full">
              {/* Out-of-Seat section */}
              <section>
                <SectionHeader
                  dot="bg-emerald-400"
                  label="Out-of-Seat Compound Lifts"
                  subtitle="Priority — maximum muscle recruitment"
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {outOfSeat.map((ex) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      isCompletedToday={completedIds.has(ex.id)}
                      onStart={openBreak}
                      onUpdate={updateExercise}
                    />
                  ))}
                </div>
              </section>

              {/* Seated section */}
              <section>
                <SectionHeader
                  dot="bg-amber-400"
                  label="Seated at Desk Modifications"
                  subtitle="When you can't leave your chair"
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {seated.map((ex) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      isCompletedToday={completedIds.has(ex.id)}
                      onStart={openBreak}
                      onUpdate={updateExercise}
                    />
                  ))}
                </div>
              </section>

              {/* Press & Raise section */}
              <section>
                <SectionHeader
                  dot="bg-blue-400"
                  label="Press & Raise"
                  subtitle="Chest, full shoulder arc, posture correction"
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {pressRaise.map((ex) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      isCompletedToday={completedIds.has(ex.id)}
                      onStart={openBreak}
                      onUpdate={updateExercise}
                    />
                  ))}
                </div>
              </section>

              {/* Bodyweight section */}
              <section>
                <SectionHeader
                  dot="bg-slate-400"
                  label="Bodyweight"
                  subtitle="No equipment needed — anywhere, anytime"
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {bodyweightExercises.map((ex) => (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      isCompletedToday={completedIds.has(ex.id)}
                      onStart={openBreak}
                      onUpdate={updateExercise}
                    />
                  ))}
                </div>
              </section>

              {/* Cardio & Mobility section */}
              <section>
                <SectionHeader
                  dot="bg-sky-400"
                  label="Cardio & Mobility"
                  subtitle="Log rides and yoga — pick a date to backfill"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {ACTIVITIES.map((a) => (
                    <ActivityCard
                      key={a.activityKey}
                      {...a}
                      weeklyHabits={weeklyHabits}
                      onLog={logHabit}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : tab === 'week' ? (
          <WeeklyView
            weeklyHabits={weeklyHabits}
            logs={logs}
            onToggle={toggleWeeklyHabit}
          />
        ) : (
          <CalendarView
            logs={logs}
            weeklyHabits={weeklyHabits}
            onToggle={toggleWeeklyHabit}
          />
        )}
      </main>

      {/* Routine player modal */}
      {activeExercise && (
        <ActiveBreakModal
          exercise={activeExercise}
          onClose={closeBreak}
          onLog={handleLog}
        />
      )}
    </div>
  )
}

function SectionHeader({ dot, label, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none">
          {label}
        </p>
        {subtitle && (
          <p className="text-[17px] text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
