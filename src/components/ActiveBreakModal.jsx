import { useCallback, useEffect, useRef, useState } from 'react'
import { X, Lightbulb, Trophy } from 'lucide-react'

const REST_SECONDS = 60

// Plays a soft ascending triad chime using the Web Audio API.
// Must be called from within (or downstream of) a user gesture to satisfy
// browser autoplay policies — clicking a set button satisfies this.
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()

    const note = (freq, start, dur, vol = 0.22) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
      gain.gain.setValueAtTime(0, ctx.currentTime + start)
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur + 0.05)
    }

    // Soft C-E-G triad (C5 = 523 Hz)
    note(523.25, 0, 0.9)
    note(659.25, 0.18, 0.9)
    note(783.99, 0.36, 1.4)
  } catch {
    // Silent fallback if AudioContext is unavailable
  }
}

// Soothing color that shifts from mint → amber → rose as rest time runs low
function timerColor(secondsLeft) {
  if (secondsLeft > 40) return '#6ee7b7'  // mint
  if (secondsLeft > 20) return '#34d399'  // emerald
  if (secondsLeft > 10) return '#fbbf24'  // amber
  if (secondsLeft > 0) return '#fb7185'   // rose
  return '#4ade80'                         // bright green on complete
}

// ── Rest Timer ──────────────────────────────────────────────────────────────
function RestTimer({ onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(REST_SECONDS)
  const [isComplete, setIsComplete] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (secondsLeft === 0 && !isComplete) {
      setIsComplete(true)
      playChime()
      onCompleteRef.current()
    }
  }, [secondsLeft, isComplete])

  const size = 144
  const stroke = 7
  const r = (size - stroke * 2) / 2   // 65
  const cx = size / 2                  // 72
  const circ = 2 * Math.PI * r        // ≈ 408.4
  const progress = secondsLeft / REST_SECONDS
  const offset = circ * (1 - progress)
  const color = timerColor(secondsLeft)
  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute -rotate-90"
        >
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.85s ease-out, stroke 0.4s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-light tabular-nums"
            style={{ color, transition: 'color 0.4s ease' }}
          >
            {mins}:{secs.toString().padStart(2, '0')}
          </span>
          <span className="text-[17px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
            rest
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center leading-relaxed">
        {secondsLeft === 0
          ? '✓ Rest complete — ready for the next set!'
          : secondsLeft <= 10
          ? 'Almost there...'
          : 'Breathe and recover'}
      </p>
    </div>
  )
}

// ── Active Break Modal ───────────────────────────────────────────────────────
export function ActiveBreakModal({ exercise, onClose, onLog }) {
  // Each element is true once that set is tapped complete
  const [sets, setSets] = useState([false, false, false])
  // Index of the set whose timer is currently running; null when no timer shown
  const [timerForSet, setTimerForSet] = useState(null)
  // Increment to force RestTimer remount (reset countdown) for each new set
  const [timerRevision, setTimerRevision] = useState(0)
  const [allDone, setAllDone] = useState(false)

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key closes
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSetClick = useCallback(
    (i) => {
      if (sets[i]) return                          // already complete
      if (i > 0 && !sets[i - 1]) return           // must complete in order

      const next = sets.map((v, idx) => (idx === i ? true : v))
      setSets(next)
      setTimerForSet(i)
      setTimerRevision((r) => r + 1)
      if (next.every(Boolean)) setAllDone(true)
    },
    [sets],
  )

  const handleTimerComplete = useCallback(() => {
    setTimerForSet(null)
  }, [])

  const handleLog = () => {
    const completedCount = sets.filter(Boolean).length
    onLog(exercise.id, exercise.name, completedCount, exercise.targetReps, exercise.weight)
    onClose()
  }

  const completedCount = sets.filter(Boolean).length
  const isOutOfSeat = exercise.category === 'out-of-seat'

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-3xl shadow-modal w-full max-w-md overflow-hidden animate-slide-up">

        {/* ── Modal Header ── */}
        <div className={`px-6 pt-6 pb-5 ${isOutOfSeat ? 'bg-emerald-50/50' : 'bg-amber-50/50'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <span
                className={[
                  'inline-block text-[17px] font-semibold px-2.5 py-0.5 rounded-full mb-2',
                  isOutOfSeat
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700',
                ].join(' ')}
              >
                {isOutOfSeat ? '⚡ Out-of-Seat Compound' : '🪑 Desk Seated'}
              </span>
              <h2 className="text-xl font-semibold text-slate-800 leading-tight">
                {exercise.name}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{exercise.muscles.join(' · ')}</p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-full p-1.5 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-2 mt-3">
            {[
              { label: `${exercise.weight} lbs` },
              { label: `${exercise.targetReps} reps` },
              { label: `${exercise.totalSets} sets` },
            ].map(({ label }) => (
              <span
                key={label}
                className="bg-white/70 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className="px-6 py-5 space-y-4">

          {/* Set checklist */}
          <div>
            <p className="text-[17px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Sets — tap each when complete
            </p>
            <div className="flex items-center gap-3">
              {sets.map((done, i) => {
                const available = i === 0 || sets[i - 1]
                return (
                  <button
                    key={i}
                    onClick={() => handleSetClick(i)}
                    disabled={done || !available}
                    className={[
                      'w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold',
                      'transition-all duration-200',
                      done
                        ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-300 scale-95'
                        : available
                        ? 'bg-white border-2 border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-500 hover:scale-105 cursor-pointer'
                        : 'bg-slate-50 border-2 border-slate-100 text-slate-200 cursor-not-allowed',
                    ].join(' ')}
                    aria-label={`Set ${i + 1}${done ? ' — complete' : ''}`}
                  >
                    {done ? (
                      // Checkmark SVG
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </button>
                )
              })}
              <span className="text-sm text-slate-400 ml-1">
                {completedCount === 0
                  ? 'Tap Set 1 to begin'
                  : completedCount < 3
                  ? `${completedCount} / 3 done`
                  : 'All sets complete!'}
              </span>
            </div>
          </div>

          {/* Rest timer — visible between sets */}
          {timerForSet !== null && (
            <div className="bg-slate-50 rounded-2xl px-5 py-5">
              <p className="text-[17px] font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
                Rest Timer — Set {timerForSet + 1} done
              </p>
              <RestTimer key={timerRevision} onComplete={handleTimerComplete} />
            </div>
          )}

          {/* All-done celebration banner */}
          {allDone && timerForSet === null && (
            <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl px-4 py-3">
              <Trophy size={18} className="text-emerald-500 shrink-0" />
              <p className="text-sm font-semibold text-emerald-700">
                All 3 sets complete — outstanding work!
              </p>
            </div>
          )}

          {/* Form quick-reference */}
          <div className="bg-violet-50/60 rounded-2xl px-4 py-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={14} className="text-violet-400 shrink-0" />
              <span className="text-[17px] font-semibold text-violet-500 uppercase tracking-wider">
                Form Quick-Reference
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{exercise.formTip}</p>
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div className="px-6 pb-6 pt-1">
          <button
            onClick={handleLog}
            disabled={completedCount === 0}
            className={[
              'w-full py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all duration-150',
              completedCount > 0
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg active:scale-[0.98]'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed',
            ].join(' ')}
          >
            {completedCount > 0
              ? `Log ${completedCount} Set${completedCount > 1 ? 's' : ''} — ${completedCount}×${exercise.targetReps} @ ${exercise.weight} lbs`
              : 'Complete at least one set to log'}
          </button>
        </div>
      </div>
    </div>
  )
}
