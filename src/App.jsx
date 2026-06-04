import { useState } from 'react'
import { Calendar, CalendarDays, Check, Dumbbell } from 'lucide-react'
import { useAppState } from './hooks/useAppState'
import { Header } from './components/Header'
import { ExerciseCard } from './components/ExerciseCard'
import { ActivityCard } from './components/ActivityCard'
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

  const {
    bucketExercises,
    bucketLabel,
    bucketData,
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

  // Sum of sets logged today per exercise (activity logs excluded)
  const setsPerExercise = todayLogs
    .filter((l) => l.type !== 'activity')
    .reduce((acc, l) => {
      acc[l.exerciseId] = (acc[l.exerciseId] || 0) + l.sets
      return acc
    }, {})

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
        totalExercises={bucketExercises.length}
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
              <ExerciseSection
                dot={bucketData?.dot ?? 'bg-slate-400'}
                label={`Today's Focus: ${bucketLabel}`}
                subtitle={bucketData?.subtitle ?? ''}
                exercises={bucketExercises}
                setsPerExercise={setsPerExercise}
                onLog={logExercise}
                onUpdate={updateExercise}
              />

              {/* Cardio & Mobility section */}
              <section>
                <SectionHeader
                  dot="bg-sky-400"
                  label="Cardio & Mobility"
                  subtitle="Log rides and yoga — pick a date to backfill"
                />
                <div className="grid grid-cols-2 gap-3">
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

    </div>
  )
}

function ExerciseSection({ dot, label, subtitle, exercises, setsPerExercise, onLog, onUpdate }) {
  const active = exercises.filter((ex) => (setsPerExercise[ex.id] || 0) < (ex.totalSets || 3))
  const done = exercises.filter((ex) => (setsPerExercise[ex.id] || 0) >= (ex.totalSets || 3))

  return (
    <section>
      <SectionHeader dot={dot} label={label} subtitle={subtitle} />
      {active.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {active.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              setsLoggedToday={setsPerExercise[ex.id] || 0}
              onLog={onLog}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
      {done.length > 0 && (
        <div className={`flex flex-wrap gap-2${active.length > 0 ? ' mt-2' : ''}`}>
          {done.map((ex) => (
            <DonePill key={ex.id} name={ex.name} />
          ))}
        </div>
      )}
    </section>
  )
}

function DonePill({ name }) {
  return (
    <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-medium rounded-full px-3 py-1.5">
      <Check size={12} strokeWidth={2.5} />
      {name}
    </span>
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