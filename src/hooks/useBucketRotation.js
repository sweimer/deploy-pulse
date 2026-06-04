import { useEffect, useRef } from 'react'
import { usePGlite, useLiveQuery } from '@electric-sql/pglite-react'
import { BUCKETS, BUCKET_ORDER } from '../data/exercises'

const localDateStr = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function useBucketRotation() {
  const db = usePGlite()
  const today = localDateStr()
  // Prevents re-running the advance logic after the DB write triggers a live query update
  const advancedRef = useRef(false)

  const metaResult = useLiveQuery(
    "SELECT key, value FROM app_meta WHERE key IN ('current_bucket', 'last_active_date')",
  )
  // Minimal log query — only the columns needed for the completion check
  const logsResult = useLiveQuery('SELECT exercise_id, date, type FROM logs')

  const meta = Object.fromEntries(
    (metaResult?.rows ?? []).map((r) => [r.key, r.value]),
  )
  const currentBucket = meta.current_bucket ?? 'push'
  const lastActiveDate = meta.last_active_date ?? ''
  const dataReady = metaResult != null && logsResult != null

  useEffect(() => {
    if (!dataReady || advancedRef.current) return
    advancedRef.current = true

    // Already updated today — nothing to do
    if (lastActiveDate === today) return

    const logRows = logsResult?.rows ?? []

    async function advance() {
      let nextBucket = currentBucket

      if (lastActiveDate) {
        const bucketIds = new Set(BUCKETS[currentBucket]?.exerciseIds ?? [])
        const completedPrevDay = logRows.some(
          (r) => r.date === lastActiveDate && r.type !== 'activity' && bucketIds.has(r.exercise_id),
        )
        if (completedPrevDay) {
          nextBucket = BUCKET_ORDER[(BUCKET_ORDER.indexOf(currentBucket) + 1) % BUCKET_ORDER.length]
        }
      }

      await db.query("UPDATE app_meta SET value = $1 WHERE key = 'current_bucket'", [nextBucket])
      await db.query("UPDATE app_meta SET value = $1 WHERE key = 'last_active_date'", [today])
    }

    advance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady, lastActiveDate, today])
  // Intentionally excludes currentBucket and logsResult from deps: after the
  // DB write above updates metaResult, we must not re-run — advancedRef guards this.

  return currentBucket
}