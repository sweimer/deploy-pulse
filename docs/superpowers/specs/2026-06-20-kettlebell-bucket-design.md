---
name: kettlebell-bucket
description: Add a 5th workout bucket for kettlebell exercises in DeployPulse
metadata:
  type: project
---

# Kettlebell Bucket — Design Spec

## Summary

Add a 5th workout bucket to DeployPulse for kettlebell exercises. This is a catchall bucket for
KB-specific moves that don't fit neatly into Push/Pull/Legs/Core — particularly flows, combos,
and ballistic movements. It participates in the daily auto-rotation.

## Changes

**File: `src/data/exercises.js` only.** No UI changes required.

### 1. `BUCKET_ORDER`

Add `'kettlebell'` after `'core'`:

```js
export const BUCKET_ORDER = ['push', 'pull', 'legs', 'core', 'kettlebell']
```

Rotation becomes: Push → Pull → Legs → Core → Kettlebell → Push

### 2. `BUCKETS`

```js
kettlebell: {
  label: 'Kettlebell',
  subtitle: 'Full-body KB flows and combos',
  dot: 'bg-rose-400',
  exerciseIds: [17 new IDs],
}
```

### 3. `INITIAL_EXERCISES` — 17 new entries

All are `category: 'out-of-seat'`, weighted (no `bodyweight: true`).
Default weight 20 lbs / 10 reps for straightforward moves; 15 lbs / 8 reps for complex combos.

| Exercise | ID | Weight | Reps |
|---|---|---|---|
| Goblet Squat to Press | `kb-goblet-squat-to-press` | 15 | 8 |
| KB Squat to RDL | `kb-squat-to-rdl` | 20 | 10 |
| Dead Lift | `kb-deadlift` | 25 | 10 |
| Around the World | `kb-around-the-world` | 15 | 10 |
| KB Row | `kb-row` | 20 | 10 |
| World Breakers | `kb-world-breakers` | 20 | 10 |
| Grave Digger | `kb-grave-digger` | 15 | 10 |
| Single Arm High Pull | `kb-single-arm-high-pull` | 20 | 10 |
| Chop | `kb-chop` | 15 | 10 |
| Clock Swings | `kb-clock-swings` | 20 | 10 |
| Halo to Hip | `kb-halo-to-hip` | 15 | 10 |
| Rick, Press, Tris Combo | `kb-rick-press-tris` | 15 | 8 |
| Lateral Lunge (KB) | `kb-lateral-lunge` | 20 | 10 |
| Leg Combo | `kb-leg-combo` | 15 | 8 |
| Squat/Hinge/Press Combo | `kb-squat-hinge-press` | 15 | 8 |
| Lunge Pullover | `kb-lunge-pullover` | 15 | 8 |
| Figure 8 Swing | `kb-figure-8-swing` | 20 | 10 |

GIFs use best-match paths from the existing CDN. Video URLs are the links provided by the user.
Form tips written from exercise names + KB knowledge; video link on each card is the authoritative reference.

## Non-Goals

- No changes to WeeklyView, CalendarView, or any other component
- Existing KB exercises in other buckets (KB Arnold Press, KB Thruster, etc.) stay where they are
- No splitting or reorganizing of this bucket at this time