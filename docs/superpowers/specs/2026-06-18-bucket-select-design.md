# Bucket Select Design

**Date:** 2026-06-18

## Problem

"Today's Focus: Push" is static text. The user wants to manually override which exercise bucket is displayed without affecting the automatic rotation.

## Solution

Add a session-only bucket override via React state. The auto-rotation continues to run and persist to the DB; the UI overrides the display when the user picks a different bucket.

## Changes

### `useAppState.js`
Accept an optional `bucketOverride` parameter. Internally derive `currentBucket` as `bucketOverride ?? autoBucket` (from `useBucketRotation`). All downstream derivations (bucket exercises, progress ring stats) already use `currentBucket`, so no further changes needed.

### `App.jsx`
- Add `const [bucketOverride, setBucketOverride] = useState(null)`.
- Pass `bucketOverride` to `useAppState`.
- Pass `bucketKey` (active bucket key string) and `onBucketChange` to `ExerciseSection`.

### `ExerciseSection` (in `App.jsx`)
Render its own header rather than delegating to `SectionHeader`. Display "Today's Focus:" as the uppercase label, followed by an inline `<select>` listing the four buckets (Push, Pull, Legs, Core). The dot color already reflects the active bucket via `bucketData.dot`.

## Constraints

- Session-only: no DB writes, resets to auto-rotation on page reload.
- The progress ring in the header reflects whichever bucket is selected (not the auto-rotation bucket).
- `SectionHeader` is unchanged; it is still used by the Cardio section.
