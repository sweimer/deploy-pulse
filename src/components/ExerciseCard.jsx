import { Check } from 'lucide-react'

const CATEGORY = {
  'out-of-seat': {
    badge: 'bg-emerald-100 text-emerald-700',
    label: '⚡ Out-of-Seat',
  },
  seated: {
    badge: 'bg-amber-100 text-amber-700',
    label: '🪑 Seated',
  },
  'press-raise': {
    badge: 'bg-blue-100 text-blue-700',
    label: '💪 Press & Raise',
  },
  bodyweight: {
    badge: 'bg-slate-100 text-slate-600',
    label: '🏃 Bodyweight',
  },
}

const WEIGHT_OPTIONS = [0, 5, 10, 20, 25, 30, 35, 40, 45, 50]

export function ExerciseCard({ exercise, setsLoggedToday, onLog, onUpdate }) {
  const cat = CATEGORY[exercise.category]
  const totalSets = exercise.totalSets || 3
  const allDone = setsLoggedToday >= totalSets
  const isHold = exercise.unit === 'sec'

  return (
    <div
      className={[
        'bg-white rounded-2xl shadow-card border-2 transition-all duration-200 overflow-hidden flex flex-col',
        allDone
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-transparent hover:shadow-card-hover',
      ].join(' ')}
    >
      {/* Animated exercise GIF */}
      {exercise.gifUrl && (
        <div
          className="w-full bg-slate-100 flex items-center justify-center"
          style={{ height: 160 }}
        >
          <img
            src={exercise.gifUrl}
            alt={`${exercise.name} demonstration`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Top row: category badge + done indicator */}
        <div className="flex flex-col gap-1.5 mb-2.5">
          <span className={`text-[17px] font-semibold px-2 py-0.5 rounded-full ${cat.badge}`}>
            {cat.label}
          </span>
          {allDone && (
            <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
              <Check size={13} strokeWidth={2.5} />
              Done today
            </span>
          )}
        </div>

        {/* Name + muscles */}
        <h3 className="text-[21px] font-semibold text-slate-800 leading-snug">{exercise.name}</h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-3">{exercise.muscles.join(' · ')}</p>

        {/* Weight + Reps controls */}
        <div className="flex flex-col gap-2 mb-3">
          {/* LBS — hidden for bodyweight exercises */}
          {!exercise.bodyweight && (
            <label className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 flex-1 transition-colors cursor-pointer">
              <span className="text-[17px] font-semibold text-slate-400 shrink-0">LBS</span>
              <select
                value={exercise.weight}
                onChange={(e) => onUpdate(exercise.id, { weight: parseInt(e.target.value) })}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none text-right cursor-pointer"
              >
                {WEIGHT_OPTIONS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </label>
          )}

          {/* REPS / SEC — adjustable per-exercise unit */}
          <label className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 flex-1 transition-colors cursor-text">
            <span className="text-[17px] font-semibold text-slate-400 shrink-0">{isHold ? 'SEC' : 'REPS'}</span>
            <input
              type="number"
              min={isHold ? 5 : 1}
              max={isHold ? 120 : 50}
              step={isHold ? 5 : 1}
              value={exercise.targetReps}
              onChange={(e) => {
                const [lo, hi] = isHold ? [5, 120] : [1, 50]
                onUpdate(exercise.id, { targetReps: Math.min(hi, Math.max(lo, parseInt(e.target.value) || lo)) })
              }}
              onFocus={(e) => e.target.select()}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none text-right"
            />
          </label>
        </div>

        {/* Set buttons — one per set, log directly on click */}
        <div className="mt-auto flex flex-col gap-1.5">
          {Array.from({ length: totalSets }, (_, i) => i + 1).map((setNum) => {
            const done = setsLoggedToday >= setNum
            return (
              <button
                key={setNum}
                onClick={() => onLog(exercise.id, exercise.name, 1, exercise.targetReps, exercise.weight)}
                className={[
                  'flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold',
                  'transition-all duration-150 active:scale-[0.98]',
                  done
                    ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    : 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm',
                ].join(' ')}
              >
                {done && <Check size={12} strokeWidth={2.5} />}
                Set {setNum}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
