# Bucket Select Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static "Today's Focus: Push" label with an inline `<select>` that lets the user pick any of the four exercise buckets, session-only (no DB write).

**Architecture:** A `bucketOverride` React state value is added to `App.jsx` and passed into `useAppState` as a parameter. Inside the hook, `currentBucket` becomes `bucketOverride ?? autoBucket`. `ExerciseSection` renders its own header with the select element instead of delegating to the generic `SectionHeader`.

**Tech Stack:** React 18, Tailwind CSS v3. No test infrastructure — verification is manual via `npm run dev`.

---

### Task 1: Accept bucket override in `useAppState`

**Files:**
- Modify: `src/hooks/useAppState.js`

- [ ] **Step 1: Update function signature and bucket derivation**

In `src/hooks/useAppState.js`, change lines 18 and 25:

```js
// Before
export function useAppState() {
  ...
  const currentBucket = useBucketRotation()

// After
export function useAppState(bucketOverride = null) {
  ...
  const autoBucket = useBucketRotation()
  const currentBucket = bucketOverride ?? autoBucket
```

No other changes needed — `bucketData`, `bucketExercises`, `exercisesCompletedToday`, and `bucketLabel` all derive from `currentBucket` already.

- [ ] **Step 2: Commit**

```bash
rm -f .git/index.lock && sleep 0.5 && \
git add src/hooks/useAppState.js && \
git commit -m "feat: accept bucketOverride param in useAppState"
```

---

### Task 2: Wire override state in App.jsx and render the select

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add BUCKETS/BUCKET_ORDER import**

At the top of `src/App.jsx`, add to the existing data import line (currently there is none — add a new import after the lucide-react import):

```js
import { BUCKETS, BUCKET_ORDER } from './data/exercises'
```

- [ ] **Step 2: Add bucketOverride state and pass it to useAppState**

In the `App` component, change:

```js
// Before
const [tab, setTab] = useState('today')

const {
  bucketExercises,
  bucketLabel,
  bucketData,

// After
const [tab, setTab] = useState('today')
const [bucketOverride, setBucketOverride] = useState(null)

const {
  bucketExercises,
  currentBucket,
  bucketData,
```

And change the `useAppState()` call to `useAppState(bucketOverride)`.

Note: `bucketLabel` is no longer needed — `ExerciseSection` will derive the label directly from `BUCKETS`.

- [ ] **Step 3: Update ExerciseSection call site**

Replace the `<ExerciseSection ... />` call (around line 98) with:

```jsx
<ExerciseSection
  dot={bucketData?.dot ?? 'bg-slate-400'}
  subtitle={bucketData?.subtitle ?? ''}
  exercises={bucketExercises}
  setsPerExercise={setsPerExercise}
  onLog={logExercise}
  onUpdate={updateExercise}
  bucketKey={currentBucket}
  onBucketChange={setBucketOverride}
/>
```

- [ ] **Step 4: Update ExerciseSection to render an inline select**

Replace the `ExerciseSection` function definition:

```jsx
function ExerciseSection({ dot, subtitle, exercises, setsPerExercise, onLog, onUpdate, bucketKey, onBucketChange }) {
  const active = exercises.filter((ex) => (setsPerExercise[ex.id] || 0) < (ex.totalSets || 3))
  const done = exercises.filter((ex) => (setsPerExercise[ex.id] || 0) >= (ex.totalSets || 3))

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
        <div>
          <div className="flex items-center gap-1 leading-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Today's Focus:
            </span>
            <select
              value={bucketKey}
              onChange={(e) => onBucketChange(e.target.value)}
              className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-transparent border-none outline-none cursor-pointer hover:text-slate-700"
            >
              {BUCKET_ORDER.map((key) => (
                <option key={key} value={key}>
                  {BUCKETS[key].label}
                </option>
              ))}
            </select>
          </div>
          {subtitle && (
            <p className="text-[17px] text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
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
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Check:
- "Today's Focus:" label appears with a select showing "Push" (or whatever the auto bucket is today)
- Selecting a different bucket (e.g. Legs) swaps the exercise cards immediately
- The dot color updates to match the selected bucket
- The subtitle updates to match the selected bucket
- The progress ring in the header reflects the selected bucket
- Refreshing the page resets back to the auto-rotation bucket

- [ ] **Step 6: Commit**

```bash
rm -f .git/index.lock && sleep 0.5 && \
git add src/App.jsx && \
git commit -m "feat: inline bucket select on Today's Focus section header"
```
