const GIF_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'

// Core exercise schema. User-adjustable fields (weight, targetReps) are stored
// in localStorage; all other fields are fixed identity/instruction data.
// bodyweight: true means no dumbbell weight selector is shown on the card.
export const INITIAL_EXERCISES = [
  // ── Out-of-Seat Compound Lifts ─────────────────────────────────────────────
  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Quads', 'Glutes', 'Core'],
    gifUrl: `${GIF_BASE}/quads/dumbbell-goblet-squat.gif`,
    formTip:
      'Hold dumbbell vertically at chest, elbows tucked under. Feet shoulder-width, toes slightly out. Sit back into heels — chest tall, core braced. Drive through heels to full stand. Do not let knees cave inward.',
  },
  {
    id: 'bent-over-row',
    name: 'Bent-Over Row',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Back', 'Biceps', 'Rear Delts'],
    gifUrl: `${GIF_BASE}/upper-back/dumbbell-bent-over-row.gif`,
    formTip:
      'Hinge at hips to ~45°, neutral spine throughout — no rounding. Pull elbows back toward ribcage and squeeze shoulder blades hard at the top. Lower slowly with control. Brace your core to protect the lower back.',
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    gifUrl: `${GIF_BASE}/glutes/dumbbell-romanian-deadlift.gif`,
    formTip:
      'Soft bend in knees, hinge from hips keeping a flat back. Slide the weight close to your legs. Stop when you feel a deep hamstring stretch — never round the lower back. Squeeze glutes aggressively at the top.',
  },

  // ── Seated at Desk ─────────────────────────────────────────────────────────
  {
    id: 'seated-overhead-press',
    name: 'Seated Overhead Press',
    category: 'seated',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Shoulders', 'Triceps', 'Upper Chest'],
    gifUrl: `${GIF_BASE}/delts/dumbbell-seated-shoulder-press.gif`,
    formTip:
      'Sit at the edge of your chair — NO back support. Ribs tucked, core engaged before pressing. Drive dumbbells straight overhead, elbows slightly forward of the ears. Full lockout at top, controlled descent. Spine unsupported is essential for core activation.',
  },
  {
    id: 'hammer-curl-to-press',
    name: 'Hammer Curl to Press',
    category: 'seated',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Biceps', 'Shoulders', 'Forearms'],
    gifUrl: `${GIF_BASE}/biceps/dumbbell-hammer-curl.gif`,
    formTip:
      'Neutral grip (thumbs up) through the curl phase — protect the wrist. Rotate palms forward at the top, then press overhead. Resist gravity on the way back: a slow lowering phase doubles the bicep stimulus and protects tendons.',
  },
  {
    id: 'seated-tricep-extension',
    name: 'Seated Tricep Extension',
    category: 'seated',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Triceps', 'Core Stabilizers'],
    gifUrl: `${GIF_BASE}/triceps/dumbbell-seated-triceps-extension.gif`,
    formTip:
      'Hold one dumbbell overhead with both hands, clasped under the top plate. Keep elbows close to your head — they are the only pivot point, do not flare. Lower slowly behind head to a deep stretch, then extend fully, squeezing hard at the top.',
  },

  // ── Press & Pull ───────────────────────────────────────────────────────────
  {
    id: 'floor-press',
    name: 'Floor Press',
    category: 'press-raise',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    gifUrl: `${GIF_BASE}/pectorals/dumbbell-lying-hammer-press.gif`,
    formTip:
      'Lie on floor, knees bent, feet flat. Neutral grip (thumbs toward face). Press vertically to full lockout, then lower until elbows rest on floor — brief pause each rep. The floor caps ROM naturally, protecting your shoulders. Keep core braced and lower back flat throughout.',
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    category: 'press-raise',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Medial Delts', 'Upper Traps'],
    gifUrl: `${GIF_BASE}/delts/dumbbell-lateral-raise.gif`,
    formTip:
      'Stand or sit tall, slight forward lean from hips, soft elbow bend locked in place. Raise dumbbells laterally to shoulder height leading with the elbows — never the wrists. Brief hold at top, lower slowly over 3 counts. Do not shrug or use momentum. Use less weight than you think you need.',
  },
  {
    id: 'dumbbell-row',
    name: 'Single-Arm Row',
    category: 'press-raise',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Lats', 'Rhomboids', 'Rear Delts'],
    gifUrl: `${GIF_BASE}/upper-back/dumbbell-one-arm-bent-over-row.gif`,
    formTip:
      'Brace one hand and same-side knee on a chair for support. Pull dumbbell toward hip leading with the elbow — not the bicep. Squeeze lats and upper back hard at the top. Full stretch at the bottom, keep back parallel to floor throughout.',
  },

  // ── Bodyweight ─────────────────────────────────────────────────────────────
  {
    id: 'push-up',
    name: 'Push-Up',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Chest', 'Triceps', 'Core'],
    gifUrl: `${GIF_BASE}/pectorals/push-up.gif`,
    formTip:
      'Hands slightly wider than shoulders, body in a straight line from head to heels. Lower chest to within an inch of the floor, elbows at ~45° — do not flare. Press back to full lockout. Brace core and glutes the entire time. Too hard? Elevate hands on your desk. Too easy? Elevate feet.',
  },
  {
    id: 'sit-up',
    name: 'Sit-Up',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Abs', 'Hip Flexors', 'Core'],
    gifUrl: `${GIF_BASE}/abs/sit-up-v-2.gif`,
    formTip:
      'Knees bent, feet flat on floor. Cross arms on chest or lightly support head — do not pull your neck. Engage core to lift shoulder blades fully off the floor. Control the descent slowly — the eccentric phase builds as much strength as the lift. Exhale on the way up.',
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 15,
    totalSets: 3,
    muscles: ['Calves', 'Achilles', 'Ankle Stabilizers'],
    gifUrl: `${GIF_BASE}/calves/bodyweight-standing-calf-raise.gif`,
    formTip:
      'Stand tall, feet hip-width. Rise onto the balls of your feet as high as possible — hold 1 second at peak. Lower slowly and fully. For more range, stand on the edge of a step and drop heel below parallel on the way down. Single-leg variation doubles the challenge and benefits balance.',
  },
]
