# DeployPulse — CLAUDE.md

A desk-bound strength and fitness tracker built for a 60-year-old web developer. The concept: use deployment breaks as "exercise snacks" — quick sets of dumbbell exercises between deploys, tracked alongside cardio habits (Peloton, walks, yoga, outdoor bike). Deployed as a static app on AWS Amplify with no server; all data lives in the browser.

## Stack

- **Vite 5** + **React 18** + **Tailwind CSS v3**
- **PGlite** (`@electric-sql/pglite` v0.4.6) — PostgreSQL in browser via WASM, persisted to IndexedDB (`idb://deploypulse`)
- **PGlite React** (`@electric-sql/pglite-react`) — `PGliteProvider`, `usePGlite`, `useLiveQuery`
- **lucide-react** for icons
- **npm** only — bun is not installed on this machine

## Running locally

```
npm install
npm run dev
```

Build for production:

```
npm run build
```

The build target is `es2022` (required for top-level await in `main.jsx`).

## Hosting

AWS Amplify static hosting. Build config is in `amplify.yml` (Node 20, `npm ci`, `npm run build`, artifact dir `dist/`). No server-side code — everything runs in the browser.

## Architecture

```
src/
  main.jsx            # Awaits PGlite init, wraps app in PGliteProvider
  App.jsx             # Tab shell (Today / This Week / This Month), exercise card layout
  db/
    index.js          # PGlite singleton: schema creation + one-time localStorage migration
  hooks/
    useAppState.js    # All app state: useLiveQuery for reads, usePGlite for writes
  components/
    Header.jsx        # Sticky top bar: date, days/week, progress ring, active mins
    ExerciseCard.jsx  # One card per exercise: weight/reps controls, Set 1/2/3 buttons
    ActivityCard.jsx  # One card per cardio activity: duration + date picker, Mark Complete
    HistoryFeed.jsx   # Collapsible Today's Log sidebar
    WeeklyView.jsx    # Mon–Sun habits + lift summary
    CalendarView.jsx  # Month heatmap with day detail panel
    ActiveBreakModal.jsx  # DEAD CODE — replaced by inline Set buttons, safe to delete
  data/
    exercises.js      # INITIAL_EXERCISES: 12 exercises across 4 categories
```

## Database schema (PGlite / IndexedDB)

```sql
-- User-adjustable fields per exercise (weight, reps)
exercise_prefs (id TEXT PK, weight INTEGER, target_reps INTEGER)

-- All logged activity: sets or timed cardio
logs (
  id TEXT PK, type TEXT,           -- 'exercise' | 'activity'
  exercise_id TEXT,                -- null for activity logs
  exercise_name TEXT,
  sets INTEGER, reps INTEGER, weight INTEGER,
  activity_key TEXT,               -- null for exercise logs
  duration_minutes INTEGER,        -- null for exercise logs
  timestamp TEXT, date TEXT        -- date = YYYY-MM-DD local
)

-- Habit completions by date (yoga, walk, peloton, outdoorBike)
habits (date TEXT, habit_key TEXT, value TEXT, PK (date, habit_key))

-- Tracks one-time migrations
app_meta (key TEXT PK, value TEXT)
```

`habits.value` is stored as TEXT to preserve type: `'true'`/`'false'` for toggles, `'30'` for timed entries. `parseHabitValue()` in `useAppState.js` converts back to boolean or number on read.

### First-run migration

On first load, `initDB()` checks `app_meta` for `migrated = true`. If absent, it reads `localStorage` key `deploypulse_v4`, seeds `exercise_prefs` from `INITIAL_EXERCISES` (overlaying any saved weight/reps), imports all logs, and imports all habits. This migration is a one-time operation and is safe to re-run (all inserts use `ON CONFLICT DO NOTHING`).

## Exercises (`src/data/exercises.js`)

12 exercises across 4 categories:

| Category | IDs |
|---|---|
| `out-of-seat` | goblet-squat, bent-over-row, romanian-deadlift |
| `seated` | seated-overhead-press, hammer-curl-to-press, seated-tricep-extension |
| `press-raise` | floor-press, lateral-raise, dumbbell-row |
| `bodyweight` | push-up, sit-up, calf-raise |

`bodyweight: true` on an exercise hides the LBS weight selector in `ExerciseCard`. Only `weight` and `targetReps` are user-adjustable and stored in DB; everything else (gifUrl, muscles, formTip) always comes from `INITIAL_EXERCISES`.

GIF CDN: `https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0`

## Cardio activities (`App.jsx` ACTIVITIES array)

| Key | Name | Color |
|---|---|---|
| `yoga` | Yoga | violet |
| `walk` | Walk | teal |
| `peloton` | Peloton Ride | blue |
| `outdoorBike` | Outdoor Bike | orange |

Activities appear in the "Cardio & Mobility" section as `ActivityCard` components (2-column grid on desktop). They also appear as habit toggle buttons in `WeeklyView` and `CalendarView`.

## Key component interfaces

**`ExerciseCard`** — `{ exercise, setsLoggedToday, onLog, onUpdate }`
- Set 1/2/3 buttons each call `onLog(exercise.id, exercise.name, 1, targetReps, weight)`
- `onUpdate(id, { weight })` or `onUpdate(id, { targetReps })` for control changes

**`ActivityCard`** — `{ activityKey, name, label, gifUrl, color, weeklyHabits, onLog }`
- Calls `onLog(date, activityKey, parsedDuration, name)` on Mark Complete
- MIN field uses `type="text" inputMode="numeric"` (avoids React controlled input conflict with `type="number"`)
- Date picker has `max={todayStr()}` to prevent future dates

**`HistoryFeed`** — `{ todayLogs, totalActiveMinutes }`
- Accordion (open by default). `type === 'activity'` logs render with colored left bar + duration; exercise logs render with sets×reps @ weight.

**`WeeklyView`** — `{ weeklyHabits, logs, onToggle }`
- `onToggle(dateStr, habitKey)` flips a habit toggle for that day

**`CalendarView`** — `{ logs, weeklyHabits, onToggle }`
- Heatmap intensity based on total sets per day. Clicking a day opens a detail panel with habit toggles and logged exercises. Activity logs (`type === 'activity'`) are excluded from set count / heatmap intensity.

## `useAppState` hook

All state lives here. Returns:

```js
{
  exercises,           // INITIAL_EXERCISES with user prefs merged in
  logs,                // all log rows, normalized to camelCase
  weeklyHabits,        // { [date]: { [habitKey]: boolean | number } }
  updateExercise,      // async (id, { weight? | targetReps? }) => void
  logExercise,         // async (exerciseId, name, sets, reps, weight) => void
  toggleWeeklyHabit,   // async (date, habitKey) => void
  logHabit,            // async (date, habitKey, minutes, activityName) => void
  todayLogs,           // logs filtered to today's date
  exercisesCompletedToday,  // unique exercise IDs logged today (activity logs excluded)
  totalActiveMinutes,  // today: 2 min/set for exercises + actual duration for activities
  daysExercisedThisWeek,    // unique dates with any log in current Mon–Sun week
  today,               // YYYY-MM-DD string
}
```

## Vite config notes

`optimizeDeps.exclude: ['@electric-sql/pglite']` — prevents Vite from trying to pre-bundle PGlite's WASM assets.
`build.target: 'es2022'` — required for top-level `await` in `main.jsx`.

## Potential next steps

- Delete `src/components/ActiveBreakModal.jsx` (dead code, no longer imported)
- Add an export/backup feature (dump DB as JSON)
- Progressive Web App (PWA) manifest for home screen install
- Rest day suggestions or streak display in the header
