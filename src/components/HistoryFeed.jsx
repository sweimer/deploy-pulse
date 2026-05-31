import { Dumbbell, Clock, Bike, Sparkles, Mountain, PersonStanding } from 'lucide-react'

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const ACTIVITY_STYLE = {
  yoga:        { bar: 'bg-violet-300', icon: <Sparkles size={12} className="text-violet-500" /> },
  walk:        { bar: 'bg-teal-300',   icon: <PersonStanding size={12} className="text-teal-500" /> },
  peloton:     { bar: 'bg-blue-300',   icon: <Bike size={12} className="text-blue-500" /> },
  outdoorBike: { bar: 'bg-orange-300', icon: <Mountain size={12} className="text-orange-500" /> },
}

export function HistoryFeed({ todayLogs, totalActiveMinutes }) {
  const empty = todayLogs.length === 0

  return (
    <aside className="bg-white rounded-2xl shadow-card border border-slate-50 flex flex-col">
      {/* Panel header */}
      <div className="px-4 py-3.5 border-b border-slate-50 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold text-slate-700">Today's Log</h2>
        {!empty && (
          <div className="flex items-center gap-1 bg-emerald-50 rounded-full px-2.5 py-1">
            <Clock size={11} className="text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600">{totalActiveMinutes} min</span>
          </div>
        )}
      </div>

      {/* Scrollable feed */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-2"
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        {empty ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Dumbbell size={32} className="text-slate-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm font-medium text-slate-400">No sets logged yet</p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Start a break to<br />begin tracking
            </p>
          </div>
        ) : (
          [...todayLogs].reverse().map((log) => {
            const isActivity = log.type === 'activity'
            const style = isActivity ? (ACTIVITY_STYLE[log.activityKey] || { bar: 'bg-sky-300', icon: null }) : null

            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 bg-slate-50/70 rounded-xl p-3"
              >
                <div className={`w-[3px] self-stretch rounded-full shrink-0 mt-0.5 ${isActivity ? style.bar : 'bg-emerald-300'}`} />

                <div className="flex-1 min-w-0">
                  <p className="text-[19px] font-semibold text-slate-700 leading-snug truncate">
                    {log.exerciseName}
                  </p>
                  {isActivity ? (
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      {style.icon}
                      {log.durationMinutes} min
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {log.sets}×{log.reps} @ {log.weight} lbs
                    </p>
                  )}
                </div>

                <span className="text-[17px] text-slate-300 font-medium shrink-0 pt-0.5">
                  {fmtTime(log.timestamp)}
                </span>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}
