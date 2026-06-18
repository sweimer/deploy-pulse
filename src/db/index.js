import { PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { INITIAL_EXERCISES } from '../data/exercises'

const LEGACY_KEY = 'deploypulse_v4'

export async function initDB() {
  const db = await PGlite.create('idb://deploypulse', { extensions: { live } })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS exercise_prefs (
      id TEXT PRIMARY KEY,
      weight INTEGER NOT NULL DEFAULT 0,
      target_reps INTEGER NOT NULL DEFAULT 10
    );

    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'exercise',
      exercise_id TEXT,
      exercise_name TEXT NOT NULL,
      sets INTEGER,
      reps INTEGER,
      weight INTEGER,
      activity_key TEXT,
      duration_minutes INTEGER,
      timestamp TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habits (
      date TEXT NOT NULL,
      habit_key TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (date, habit_key)
    );

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `)

  // Seed bucket rotation state — safe to run every init (ON CONFLICT DO NOTHING)
  await db.exec(`
    INSERT INTO app_meta (key, value) VALUES ('current_bucket', 'push') ON CONFLICT DO NOTHING;
    INSERT INTO app_meta (key, value) VALUES ('last_active_date', '') ON CONFLICT DO NOTHING;
  `)

  // One-time migration from localStorage — runs before exercise seeding so that
  // saved user values (weight, targetReps) take priority over defaults
  const { rows } = await db.query(
    "SELECT value FROM app_meta WHERE key = 'migrated'",
  )

  if (rows.length === 0) {
    await migrateFromLocalStorage(db)
    await db.query("INSERT INTO app_meta (key, value) VALUES ('migrated', 'true')")
    localStorage.removeItem(LEGACY_KEY)
  }

  // Seed prefs for any exercises not yet in the DB — handles exercises added
  // in app updates for returning users. DO NOTHING preserves saved user prefs.
  for (const ex of INITIAL_EXERCISES) {
    await db.query(
      `INSERT INTO exercise_prefs (id, weight, target_reps) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [ex.id, ex.weight ?? 0, ex.targetReps ?? 10],
    )
  }

  // These exercises were briefly seeded at weight=15 (not a valid selector option);
  // correct to 20 for any user whose DB has that transient value.
  await db.query(
    `UPDATE exercise_prefs SET weight = 20 WHERE id IN ('kettlebell-halo', 'kettlebell-windmill') AND weight = 15`,
  )

  return db
}

async function migrateFromLocalStorage(db) {
  let saved = null
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (raw) saved = JSON.parse(raw)
  } catch {
    // ignore corrupt data
  }

  // Seed exercise prefs — overlay any saved weight/reps from localStorage
  for (const ex of INITIAL_EXERCISES) {
    const savedEx = (saved?.exercises ?? []).find((e) => e.id === ex.id)
    await db.query(
      `INSERT INTO exercise_prefs (id, weight, target_reps) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [ex.id, savedEx?.weight ?? ex.weight ?? 0, savedEx?.targetReps ?? ex.targetReps ?? 10],
    )
  }

  if (!saved) return

  for (const log of saved.logs ?? []) {
    await db.query(
      `INSERT INTO logs
         (id, type, exercise_id, exercise_name, sets, reps, weight,
          activity_key, duration_minutes, timestamp, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [
        log.id,
        log.type ?? 'exercise',
        log.exerciseId ?? null,
        log.exerciseName,
        log.sets ?? null,
        log.reps ?? null,
        log.weight ?? null,
        log.activityKey ?? null,
        log.durationMinutes ?? null,
        log.timestamp,
        log.date,
      ],
    )
  }

  for (const [date, habits] of Object.entries(saved.weeklyHabits ?? {})) {
    for (const [habitKey, value] of Object.entries(habits)) {
      await db.query(
        `INSERT INTO habits (date, habit_key, value) VALUES ($1, $2, $3)
         ON CONFLICT (date, habit_key) DO UPDATE SET value = EXCLUDED.value`,
        [date, habitKey, String(value)],
      )
    }
  }
}