const GIF_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'

// Core exercise schema. User-adjustable fields (weight, targetReps) are stored
// in the DB; all other fields are fixed identity/instruction data.
// bodyweight: true  → no dumbbell weight selector shown on the card
// unit: 'sec'       → reps field shows "SEC" and uses 5-second step increments
export const INITIAL_EXERCISES = [
  // ── Push bucket ────────────────────────────────────────────────────────────
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

  // ── Pull bucket ────────────────────────────────────────────────────────────
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
    id: 'dumbbell-row',
    name: 'Single-Arm Row',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Lats', 'Rhomboids', 'Rear Delts'],
    gifUrl: `${GIF_BASE}/upper-back/dumbbell-one-arm-bent-over-row.gif`,
    formTip:
      'Brace one hand and same-side knee on a chair for support. Pull dumbbell toward hip leading with the elbow — not the bicep. Squeeze lats and upper back hard at the top. Full stretch at the bottom, keep back parallel to floor throughout.',
  },
  {
    id: 'reverse-fly',
    name: 'Reverse Fly',
    category: 'press-raise',
    weight: 20,
    targetReps: 12,
    totalSets: 3,
    muscles: ['Rear Delts', 'Rhomboids', 'Upper Traps'],
    gifUrl: `${GIF_BASE}/delts/dumbbell-reverse-fly.gif`,
    formTip:
      'Hinge forward at hips to ~45°, neutral spine, soft knees. Let dumbbells hang below shoulders with a slight fixed bend at the elbows. Raise them laterally until arms are parallel to the floor — squeeze rear delts and rhomboids hard at the top. Lower slowly. These muscles are small; use lighter weight than you expect.',
  },
  {
    id: 'upright-row',
    name: 'Upright Row',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Delts', 'Upper Traps', 'Biceps'],
    gifUrl: `${GIF_BASE}/delts/dumbbell-upright-row.gif`,
    formTip:
      'Stand tall, dumbbells in front of thighs with a neutral or overhand grip. Pull the dumbbells straight up toward your chin, leading with the elbows — they should flare wide and rise above wrist level. Stop at collarbone height. Lower with control. Keep the movement slow; momentum defeats the purpose.',
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    category: 'press-raise',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Lats', 'Chest', 'Serratus Anterior'],
    gifUrl: `${GIF_BASE}/pectorals/dumbbell-pullover.gif`,
    formTip:
      'Lie on your back, knees bent, feet flat. Hold one dumbbell with both hands directly above your chest, arms nearly straight with a soft elbow bend — lock that angle in place. Lower the dumbbell back over your head in an arc until you feel a deep stretch in your lats and chest, arms roughly parallel to the floor. Pull it back along the same arc to the start. Power comes from the lats, not the arms — keep the elbow angle fixed throughout.',
  },
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    category: 'seated',
    weight: 20,
    targetReps: 12,
    totalSets: 3,
    muscles: ['Biceps', 'Brachialis', 'Forearms'],
    gifUrl: `${GIF_BASE}/biceps/dumbbell-biceps-curl.gif`,
    formTip:
      'Stand or sit, palms forward. Pin elbows to ribcage — they must not drift forward. Curl to a full contraction at the top, pause briefly, then lower with control over 3 counts. The eccentric (lowering) phase builds as much strength as the lift. Alternate arms or do both simultaneously.',
  },

  // ── Legs bucket ────────────────────────────────────────────────────────────
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
  {
    id: 'hip-hinge',
    name: 'Hip Hinge',
    category: 'out-of-seat',
    bodyweight: true,
    weight: 0,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    gifUrl: `${GIF_BASE}/glutes/dumbbell-stiff-leg-deadlift.gif`,
    formTip:
      'Stand with feet hip-width, soft knee bend. Push your hips straight back as if reaching for a wall behind you — keep shins vertical and spine neutral throughout. Fold forward until you feel a strong hamstring pull, then drive the hips forward to stand tall. This is the fundamental movement pattern behind all deadlift variations. Bodyweight only to start; add light dumbbells once the pattern feels solid.',
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 15,
    totalSets: 3,
    muscles: ['Glutes', 'Hamstrings', 'Core'],
    gifUrl: `${GIF_BASE}/glutes/low-glute-bridge-on-floor.gif`,
    formTip:
      'Lie on your back, knees bent, feet flat on the floor hip-width. Brace your core, then drive through your heels to push hips toward the ceiling. Squeeze glutes hard at the top — hold 2 seconds. Lower slowly. Do not arch the lower back; ribs stay down throughout. Add a dumbbell across your hips to progress.',
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'bodyweight',
    bodyweight: true,
    unit: 'sec',
    weight: 0,
    targetReps: 30,
    totalSets: 3,
    muscles: ['Quads', 'Glutes', 'Hip Flexors'],
    gifUrl: `${GIF_BASE}/glutes/march-sit-wall.gif`,
    formTip:
      'Back flat against the wall, feet hip-width and 12 inches in front of you. Slide down until thighs are parallel to the floor and shins are vertical — 90° at the knee. Arms resting on thighs or crossed on chest. Hold for the full duration without pushing off your thighs. If knees ache, raise your position slightly.',
  },
  {
    id: 'rotating-squat-to-press',
    name: 'Rotating Squat to Press',
    category: 'out-of-seat',
    weight: 15,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Quads', 'Glutes', 'Shoulders', 'Obliques'],
    gifUrl: `${GIF_BASE}/quads/squat-to-overhead-reach-with-twist.gif`,
    formTip:
      'Stand feet shoulder-width, one dumbbell held at your right shoulder. Squat down — chest tall, knees tracking toes, weight in heels. As you drive back to stand, rotate your torso left and press the dumbbell overhead. Return it to the starting shoulder as you lower into the next squat. Complete all reps on one side, then switch. The rotation comes from your core, not just your arm.',
  },

  // ── Core bucket ────────────────────────────────────────────────────────────
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
    id: 'plank-hold',
    name: 'Plank Hold',
    category: 'bodyweight',
    bodyweight: true,
    unit: 'sec',
    weight: 0,
    targetReps: 30,
    totalSets: 3,
    muscles: ['Core', 'Shoulders', 'Glutes'],
    gifUrl: `${GIF_BASE}/abs/weighted-front-plank.gif`,
    formTip:
      'Forearms flat on the floor, elbows directly under shoulders. Body in a straight line from head to heels — no sagging hips, no raised butt. Brace your core as if bracing for a punch. Squeeze your glutes. Breathe normally throughout the hold. A short perfect plank beats a long sloppy one — end the set the moment your hips drop.',
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 20,
    totalSets: 3,
    muscles: ['Obliques', 'Abs', 'Hip Flexors'],
    gifUrl: `${GIF_BASE}/abs/russian-twist.gif`,
    formTip:
      'Sit on the floor, knees bent at 45°. Lean back slightly until you feel your core engage. Feet flat or lifted for more challenge. Rotate your torso side to side, touching your hands (or a light dumbbell) to the floor beside each hip. The rotation comes from the core — do not just swing the arms. Stay tall through the spine.',
  },
  {
    id: 'wood-chop',
    name: 'Wood Chop',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Obliques', 'Core', 'Shoulders'],
    gifUrl: `${GIF_BASE}/abs/cable-twist-up-down.gif`,
    formTip:
      'Stand with feet shoulder-width, holding one dumbbell with both hands. Start with the weight above one shoulder, arms nearly straight. Rotate your torso and swing the dumbbell diagonally across your body toward the opposite hip — like chopping wood. Control the return, do not just let it swing back. Keep knees soft throughout. Complete all reps on one side before switching.',
  },
  {
    id: 'side-bend',
    name: 'Side Bend',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 12,
    totalSets: 3,
    muscles: ['Obliques', 'Lats', 'Core'],
    gifUrl: `${GIF_BASE}/abs/dumbbell-side-bend.gif`,
    formTip:
      'Stand with one dumbbell at your side, feet hip-width. Keeping your core braced, bend directly to the side, sliding the dumbbell toward your knee. Do not let your torso rotate or lean forward. Return to upright by contracting the opposite side. Complete all reps on one side before switching. Keep the non-working hand on your hip to feel for any rotation.',
  },
  {
    id: 'dumbbell-swing',
    name: 'Dumbbell Swing',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 15,
    totalSets: 3,
    muscles: ['Glutes', 'Hamstrings', 'Core'],
    gifUrl: `${GIF_BASE}/glutes/kettlebell-swing.gif`,
    formTip:
      'Stand with feet shoulder-width, dumbbell held in both hands in front of you. Hinge at the hips — not a squat — pushing them back as the dumbbell swings between your legs. Drive your hips forward explosively to swing the dumbbell up to chest height. Let gravity bring it back down and flow into the next rep. Power comes from the hip drive, not your arms. Keep your spine neutral throughout.',
  },
]

export const BUCKET_ORDER = ['push', 'pull', 'legs', 'core']

export const BUCKETS = {
  push: {
    label: 'Push',
    subtitle: 'Pressing and shoulder strength',
    dot: 'bg-blue-400',
    exerciseIds: [
      'seated-overhead-press',
      'hammer-curl-to-press',
      'seated-tricep-extension',
      'floor-press',
      'lateral-raise',
      'push-up',
    ],
  },
  pull: {
    label: 'Pull',
    subtitle: 'Back, biceps, and rear delts',
    dot: 'bg-emerald-400',
    exerciseIds: [
      'bent-over-row',
      'dumbbell-row',
      'reverse-fly',
      'upright-row',
      'dumbbell-pullover',
      'bicep-curl',
    ],
  },
  legs: {
    label: 'Legs',
    subtitle: 'Knee-friendly lower body',
    dot: 'bg-amber-400',
    exerciseIds: [
      'goblet-squat',
      'romanian-deadlift',
      'calf-raise',
      'wall-sit',
      'dumbbell-swing',
      'rotating-squat-to-press',
    ],
  },
  core: {
    label: 'Core',
    subtitle: 'Spine stability and abdominal strength',
    dot: 'bg-slate-400',
    exerciseIds: [
      'sit-up',
      'plank-hold',
      'russian-twist',
      'wood-chop',
      'side-bend',
      'dumbbell-swing',
    ],
  },
}