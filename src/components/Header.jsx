import { CalendarCheck, Clock } from 'lucide-react'

// SVG ring: tracks exercises completed today out of total
function ProgressRing({ done, total }) {
  const size = 56
  const stroke = 4
  const r = (size - stroke * 2) / 2   // 24
  const cx = size / 2                  // 28
  const circ = 2 * Math.PI * r        // ≈ 150.8
  const progress = total > 0 ? done / total : 0
  const offset = circ * (1 - progress)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute -rotate-90"
      >
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="#6ee7b7"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
        />
      </svg>
      <span className="relative z-10 text-xs font-semibold text-slate-700">
        {done}/{total}
      </span>
    </div>
  )
}

export function Header({ daysExercisedThisWeek, exercisesCompletedToday, totalExercises, totalActiveMinutes }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Brand */}
        <div>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight leading-none">
            DeployPulse Exercise Log
          </h1>
          <p className="text-[17px] text-slate-400 mt-0.5 font-medium tracking-widest uppercase">
            {today}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Days exercised this week */}
          <div className="flex flex-col items-center bg-violet-50 rounded-2xl px-3.5 py-2 min-w-[60px]">
            <CalendarCheck size={18} className="text-violet-500 mb-1" strokeWidth={2} />
            <span className="text-lg font-bold text-violet-600 leading-none">{daysExercisedThisWeek}/7</span>
            <p className="text-[16px] text-violet-400 font-medium mt-0.5">days</p>
          </div>

          {/* Progress ring */}
          <div className="flex flex-col items-center gap-0.5">
            <ProgressRing done={exercisesCompletedToday} total={totalExercises} />
            <span className="text-[16px] text-slate-400 font-medium">exercises</span>
          </div>

          {/* Active minutes */}
          <div className="flex flex-col items-center bg-emerald-50 rounded-2xl px-3.5 py-2 min-w-[60px]">
            <Clock size={16} className="text-emerald-500 mb-1" strokeWidth={2} />
            <span className="text-lg font-bold text-emerald-600 leading-none">{totalActiveMinutes}</span>
            <p className="text-[16px] text-emerald-400 font-medium mt-0.5">mins</p>
          </div>
        </div>
      </div>
    </header>
  )
}
