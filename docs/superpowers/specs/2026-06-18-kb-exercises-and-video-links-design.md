# KB Exercises + Video Links Design

**Date:** 2026-06-18

## Goal

Two related changes to `exercises.js` and `ExerciseCard.jsx`:

1. Expand each bucket from 6 to 10 exercises by adding 4 kettlebell-first exercises per bucket, designed for vacation use with a single KB + bodyweight only.
2. Add a `videoUrl` field to every exercise so the title in `ExerciseCard` links out to a demonstration video in a new tab.

---

## Feature 1: 16 New Exercises

### Constraints

- Vacation context: single kettlebell + bodyweight only (no dumbbells, no bars, no bands)
- Appropriate for a 60-year-old; no high-risk movements
- GIF paths verified in `JahelCuadrado/ExerciseGymGifsDB@v1.1.0`

### New Exercises by Bucket

All new exercises appended to each bucket's `exerciseIds` array and added to `INITIAL_EXERCISES`.

#### Push (4 new → 10 total)

| id | name | category | bodyweight | weight | targetReps | gifUrl |
|---|---|---|---|---|---|---|
| `kettlebell-arnold-press` | KB Arnold Press | seated | — | 20 | 10 | `delts/kettlebell-arnold-press.gif` |
| `kettlebell-one-arm-floor-press` | KB One-Arm Floor Press | press-raise | — | 20 | 10 | `pectorals/kettlebell-one-arm-floor-press.gif` |
| `kettlebell-push-press` | KB Push Press | out-of-seat | — | 20 | 8 | `delts/kettlebell-one-arm-push-press.gif` |
| `bench-dip` | Bench Dip | bodyweight | true | 0 | 12 | `triceps/bench-dip-knees-bent.gif` |

#### Pull (4 new → 10 total)

| id | name | category | bodyweight | weight | targetReps | gifUrl |
|---|---|---|---|---|---|---|
| `kettlebell-renegade-row` | KB Renegade Row | out-of-seat | — | 20 | 8 | `upper-back/kettlebell-alternating-renegade-row.gif` |
| `kettlebell-sumo-high-pull` | KB Sumo High Pull | out-of-seat | — | 20 | 10 | `traps/kettlebell-sumo-high-pull.gif` |
| `kettlebell-one-arm-row` | KB One-Arm Row | out-of-seat | — | 20 | 10 | `upper-back/kettlebell-one-arm-row.gif` |
| `kettlebell-alternating-row` | KB Alternating Row | out-of-seat | — | 20 | 10 | `upper-back/kettlebell-alternating-row.gif` |

#### Legs (4 new → 10 total)

| id | name | category | bodyweight | weight | targetReps | gifUrl |
|---|---|---|---|---|---|---|
| `kettlebell-single-leg-deadlift` | KB Single-Leg Deadlift | out-of-seat | — | 20 | 10 | `glutes/dumbbell-single-leg-deadlift.gif` |
| `kettlebell-lunge-pass-through` | KB Lunge Pass-Through | out-of-seat | — | 15 | 8 | `glutes/kettlebell-lunge-pass-through.gif` |
| `kettlebell-front-squat` | KB Front Squat | out-of-seat | — | 20 | 10 | `glutes/kettlebell-front-squat.gif` |
| `single-leg-glute-bridge` | Single-Leg Glute Bridge | bodyweight | true | 0 | 12 | `glutes/single-leg-bridge-with-outstretched-leg.gif` |

#### Core (4 new → 10 total)

| id | name | category | bodyweight | weight | targetReps | gifUrl |
|---|---|---|---|---|---|---|
| `kettlebell-windmill` | KB Windmill | out-of-seat | — | 15 | 8 | `abs/kettlebell-windmill.gif` |
| `kettlebell-figure-8` | KB Figure-8 | out-of-seat | — | 20 | 10 | `abs/kettlebell-figure-8.gif` |
| `dead-bug` | Dead Bug | bodyweight | true | 0 | 10 | `abs/dead-bug.gif` |
| `mountain-climber` | Mountain Climber | bodyweight | true | 0 | 20 | `cardio/mountain-climber.gif` |

### `totalSets`

All new exercises: `totalSets: 3` (matches existing convention).

### `gifUrl` format

All `gifUrl` values use the `GIF_BASE` constant already defined at the top of `exercises.js`:
```js
const GIF_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'
// e.g. gifUrl: `${GIF_BASE}/delts/kettlebell-arnold-press.gif`
```

### `muscles` arrays and `formTip` strings

The implementer writes these for each new exercise. Follow the style of existing entries: `muscles` is a 2–4 item array of plain muscle names; `formTip` is 3–5 sentences covering stance/grip setup, the key movement cue, what not to do, and a progression or safety note. Length and tone should match existing entries.

---

## Feature 2: Video Links

### Data model

Add `videoUrl: string` to every exercise object in `INITIAL_EXERCISES` (all 25 existing + 16 new = 41 total). The field is a full YouTube URL pointing to a specific demonstration video.

Exercises without a `videoUrl` must still render correctly (graceful fallback to plain text). This means `videoUrl` is effectively optional at runtime even though all exercises should have one.

**Video URL research** is an implementation task. The implementer searches YouTube for each exercise by name + "form" or "how to" and selects the best result from a reputable fitness channel (Jeff Nippard, Alan Thrall, AthleanX, Howcast, Bodybuilding.com, etc.).

### UI change — `ExerciseCard.jsx`

**Import:** Add `ExternalLink` to the lucide-react import.

**Name rendering** (currently line 70):

```jsx
// Before
<h3 className="text-[21px] font-semibold text-slate-800 leading-snug">{exercise.name}</h3>

// After
<h3 className="text-[21px] font-semibold text-slate-800 leading-snug">
  {exercise.videoUrl ? (
    <a
      href={exercise.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 hover:text-blue-600"
    >
      {exercise.name}
      <ExternalLink size={14} className="shrink-0 text-slate-400" />
    </a>
  ) : (
    exercise.name
  )}
</h3>
```

No other UI changes. The link opens in a new tab. The `ExternalLink` icon signals external navigation. No in-app video player.

---

## Files Changed

| File | Change |
|---|---|
| `src/data/exercises.js` | Add 16 exercise objects to `INITIAL_EXERCISES`; add `videoUrl` to all 41 exercises; add 4 IDs to each bucket's `exerciseIds` |
| `src/components/ExerciseCard.jsx` | Import `ExternalLink`; wrap name in `<a>` when `videoUrl` present |

---

## Out of Scope

- No DB schema changes (videoUrl is client-side data only)
- No migration needed
- No changes to hooks, `App.jsx`, `WeeklyView`, or `CalendarView`
- `hip-hinge` and `glute-bridge` (orphaned exercises still in `INITIAL_EXERCISES` but not in any bucket) also receive `videoUrl` fields for completeness
