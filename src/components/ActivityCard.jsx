import { useState } from 'react'
import { Check } from 'lucide-react'


const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const COLOR = {
  blue:   { badge: 'bg-blue-100 text-blue-700',     done: 'bg-blue-50 text-blue-600 hover:bg-blue-100'       },
  violet: { badge: 'bg-violet-100 text-violet-700', done: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
  orange: { badge: 'bg-orange-100 text-orange-700', done: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  teal:   { badge: 'bg-teal-100 text-teal-700',     done: 'bg-teal-50 text-teal-600 hover:bg-teal-100'       },
}

export function ActivityCard({ activityKey, name, label, gifUrl, color, weeklyHabits, onLog }) {
  const [durationStr, setDurationStr] = useState('30')

  const today = todayStr()
  const parsedDuration = Math.min(300, Math.max(1, parseInt(durationStr) || 1))

  const loggedValue = weeklyHabits[today]?.[activityKey]
  const isCompleted = Boolean(loggedValue)
  const c = COLOR[color] || COLOR.blue

  return (
    <div
      className={[
        'bg-white rounded-2xl shadow-card border-2 transition-all duration-200 overflow-hidden flex flex-col',
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-transparent hover:shadow-card-hover',
      ].join(' ')}
    >
      {/* Animated GIF */}
      <div className="w-full bg-slate-100 flex items-center justify-center" style={{ height: 160 }}>
        <img
          src={gifUrl}
          alt={`${name} demonstration`}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Badge + done indicator */}
        <div className="flex flex-col gap-1.5 mb-2.5">
          <span className={`text-[17px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
            {label}
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
              <Check size={13} strokeWidth={2.5} />
              {typeof loggedValue === 'number' ? `${loggedValue} min` : 'Done'}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-[21px] font-semibold text-slate-800 leading-snug">{name}</h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-3">Duration</p>

        {/* Duration control */}
        <div className="mb-3">
          <label className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 transition-colors cursor-text">
            <span className="text-[17px] font-semibold text-slate-400 shrink-0">MIN</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={durationStr}
              onChange={(e) => setDurationStr(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => setDurationStr(String(parsedDuration))}
              onFocus={(e) => e.target.select()}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none text-right"
            />
          </label>
        </div>

        {/* Mark Complete button */}
        <button
          onClick={() => onLog(today, activityKey, parsedDuration, name)}
          className={[
            'mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold',
            'transition-all duration-150 active:scale-[0.98]',
            isCompleted
              ? c.done
              : 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm',
          ].join(' ')}
        >
          <Check size={13} strokeWidth={2.5} />
          {isCompleted ? 'Logged — Update' : 'Done'}
        </button>
      </div>
    </div>
  )
}
