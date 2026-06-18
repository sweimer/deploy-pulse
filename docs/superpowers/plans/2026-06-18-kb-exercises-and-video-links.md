# KB Exercises + Video Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand each exercise bucket from 6 to 10 exercises (16 new KB/bodyweight exercises total) and add clickable video links to every exercise title.

**Architecture:** Two files change. `exercises.js` gets 16 new exercise objects, `videoUrl` added to all 41 exercises, and 4 IDs appended to each bucket's `exerciseIds` array. `ExerciseCard.jsx` wraps the exercise name in an anchor tag when `videoUrl` is present, with an `ExternalLink` icon from lucide-react.

**Tech Stack:** React 18, Tailwind CSS v3, lucide-react. No DB changes — `videoUrl` is static client-side data. No test infrastructure in this project; verification is `npm run dev` + visual inspection.

---

### Task 1: Add video link UI to ExerciseCard

**Files:**
- Modify: `src/components/ExerciseCard.jsx`

- [ ] **Step 1: Add ExternalLink to the lucide-react import**

In `src/components/ExerciseCard.jsx`, line 1:

```jsx
// Before
import { Check } from 'lucide-react'

// After
import { Check, ExternalLink } from 'lucide-react'
```

- [ ] **Step 2: Replace the exercise name h3 (line 70) with a conditional link**

```jsx
// Before (line 70)
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

- [ ] **Step 3: Verify build**

```bash
cd /Users/29457/Documents/Sites/0.apps/deploy-pulse && npm run build 2>&1 | tail -5
```

Expected: build succeeds (exit 0). Exercise names with no `videoUrl` still render as plain text (unchanged behaviour until data tasks are done).

- [ ] **Step 4: Commit**

```bash
rm -f .git/index.lock && sleep 0.5 && \
git add src/components/ExerciseCard.jsx && \
git commit -m "feat: add external video link to exercise card title"
```

---

### Task 2: Add videoUrl to all 25 existing exercises

**Files:**
- Modify: `src/data/exercises.js`

Add one `videoUrl` line to each existing exercise object. Place it immediately after the `gifUrl` line in every object. The complete set of additions:

- [ ] **Step 1: Add videoUrl to the 6 Push exercises**

For each exercise, find the `gifUrl:` line and add `videoUrl:` on the next line:

```js
// seated-overhead-press — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=_RlRDWO2jfg',

// hammer-curl-to-press — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=kx7ATa2Lhg8',

// seated-tricep-extension — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=YbX7Wd8jQ-Q',

// floor-press — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=AqYFvc9t_vU',

// lateral-raise — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=DquLYDI-CmE',

// push-up — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=WDIpL0pjun0',
```

- [ ] **Step 2: Add videoUrl to the 6 Pull exercises**

```js
// bent-over-row — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=EEFHHOCfHgw',

// dumbbell-row (Single-Arm Row) — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=PgpQ4-jHiq4',

// reverse-fly — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=buuYPLVXsJg',

// upright-row — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=SO_nHq52a8o',

// dumbbell-pullover — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=tcHaHIQStsk',

// bicep-curl — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=yTWO2th-RIY',
```

- [ ] **Step 3: Add videoUrl to the 7 Legs exercises + 2 orphaned exercises**

```js
// goblet-squat — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=gm4ln6PO4rc',

// romanian-deadlift — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=Q5vwsJFwhyg',

// calf-raise — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=3jTwNTm1EBE',

// hip-hinge (orphaned, still in INITIAL_EXERCISES) — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=Hk65AxtXJD4',

// glute-bridge (orphaned, still in INITIAL_EXERCISES) — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=wPM8icPu6H8',

// wall-sit — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=y-wV4Venusw',

// rotating-squat-to-press — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=wlUrNtNcwGs',
```

- [ ] **Step 4: Add videoUrl to the 6 Core exercises**

```js
// sit-up — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=pCX65Mtc_Kk',

// plank-hold — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=mwlp75MS6Rg',

// russian-twist — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=9V9csctSKj0',

// wood-chop — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=b65s5BtdOEc',

// side-bend — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=UUQHeBRE_Wo',

// dumbbell-swing — after gifUrl line
videoUrl: 'https://www.youtube.com/watch?v=YNwvx12oV2M',
```

- [ ] **Step 5: Verify build**

```bash
cd /Users/29457/Documents/Sites/0.apps/deploy-pulse && npm run build 2>&1 | tail -5
```

Expected: build succeeds. No runtime errors. Exercise title links are now clickable for all existing exercises.

- [ ] **Step 6: Commit**

```bash
rm -f .git/index.lock && sleep 0.5 && \
git add src/data/exercises.js && \
git commit -m "feat: add videoUrl to all existing exercises"
```

---

### Task 3: Add 16 new exercises and expand bucket arrays

**Files:**
- Modify: `src/data/exercises.js`

This task has two parts: append 16 new exercise objects to `INITIAL_EXERCISES`, then add their IDs to the four `BUCKETS` arrays.

`GIF_BASE` is already defined at the top of `exercises.js` as:
```js
const GIF_BASE = 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0'
```

- [ ] **Step 1: Append 4 Push exercises after the push-up object**

Insert after the closing `},` of the `push-up` entry (before the `// ── Pull bucket` comment):

```js
  // ── Push bucket (KB / bodyweight additions) ───────────────────────────────
  {
    id: 'kettlebell-arnold-press',
    name: 'KB Arnold Press',
    category: 'seated',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Shoulders', 'Triceps', 'Upper Chest'],
    gifUrl: `${GIF_BASE}/delts/kettlebell-arnold-press.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=twYr543Akp4',
    formTip:
      'Sit at the edge of your chair — no back support. Hold the KB at shoulder height, palm facing you, elbow below the bell. Press overhead while rotating the palm away from you so it faces forward at full lockout. Reverse the rotation as you lower. The rotation recruits all three delt heads in one movement. Keep your core braced throughout; the unsupported spine does the stabilizing. Complete all reps on one side before switching.',
  },
  {
    id: 'kettlebell-one-arm-floor-press',
    name: 'KB One-Arm Floor Press',
    category: 'press-raise',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Chest', 'Triceps', 'Core Stability'],
    gifUrl: `${GIF_BASE}/pectorals/kettlebell-one-arm-floor-press.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=zGqkWqza2z8',
    formTip:
      'Lie on your back, knees bent, feet flat. KB in one hand pressed directly above your shoulder, palm facing your feet. Brace your core against the rotational pull of the unilateral load — your body will want to twist toward the KB side; resist it actively. Lower until your elbow touches the floor — the floor caps range, protecting the shoulder. Pause briefly, then press to full lockout. Complete all reps on one side before switching.',
  },
  {
    id: 'kettlebell-push-press',
    name: 'KB Push Press',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 8,
    totalSets: 3,
    muscles: ['Shoulders', 'Triceps', 'Legs'],
    gifUrl: `${GIF_BASE}/delts/kettlebell-one-arm-push-press.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=4DAzffDFYzc',
    formTip:
      'Stand with KB cleaned to rack position: resting on the back of your wrist and forearm, not pinched in your fingers. Dip 2–3 inches at the knees — no more — then drive up through your legs and use that momentum to help press the KB overhead. Lock arm out fully. Lower with control back to rack position. The leg drive lets you move more weight than a strict press and teaches power transfer. Too much dip turns it into a jerk; too little defeats the purpose.',
  },
  {
    id: 'bench-dip',
    name: 'Bench Dip',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 12,
    totalSets: 3,
    muscles: ['Triceps', 'Chest', 'Front Delts'],
    gifUrl: `${GIF_BASE}/triceps/bench-dip-knees-bent.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=jdFzYGmvDyg',
    formTip:
      'Hands on the front edge of a sturdy chair, fingers pointing forward. Feet flat, knees at 90°. Keep hips close to the chair. Lower by bending the elbows — they track straight back, not flaring out — until your upper arms are roughly parallel to the floor. Press back to full lockout. Sliding your feet further forward increases range. If you feel shoulder impingement, do not go below 90° at the elbow — that is your limit.',
  },
```

- [ ] **Step 2: Append 4 Pull exercises after the bicep-curl object**

Insert after the closing `},` of the `bicep-curl` entry (before the `// ── Legs bucket` comment):

```js
  // ── Pull bucket (KB / bodyweight additions) ───────────────────────────────
  {
    id: 'kettlebell-renegade-row',
    name: 'KB Renegade Row',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 8,
    totalSets: 3,
    muscles: ['Back', 'Core', 'Biceps'],
    gifUrl: `${GIF_BASE}/upper-back/kettlebell-alternating-renegade-row.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=4qEIChzM4ZA',
    formTip:
      'Start in a high push-up position: one hand on the KB handle, other hand on the floor. Feet wider than shoulder-width for stability. Keep your hips square to the floor throughout — they must not rotate. Row the KB to your hip, pulling the elbow close to your body. Lower with control, then switch sides. The anti-rotation demand makes this harder than any standing row. Use considerably less weight than a normal row and focus entirely on preventing hip movement.',
  },
  {
    id: 'kettlebell-sumo-high-pull',
    name: 'KB Sumo High Pull',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Traps', 'Upper Back', 'Delts', 'Legs'],
    gifUrl: `${GIF_BASE}/traps/kettlebell-sumo-high-pull.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=sgZ1pY32Vyc',
    formTip:
      'Stand with feet wide and toes turned out, KB between your feet. Hinge to grip it with a flat back. Drive through your heels to stand, then immediately pull the KB up your body: elbows flare wide and lead the pull, arriving above the wrists at chin height. Think "jump and shrug" — the power comes from your hips and legs, your arms just guide the path. Do not shoulder-press it up. Lower with control back to the starting position.',
  },
  {
    id: 'kettlebell-one-arm-row',
    name: 'KB One-Arm Row',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Lats', 'Rhomboids', 'Biceps'],
    gifUrl: `${GIF_BASE}/upper-back/kettlebell-one-arm-row.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=8gg400ddt-g',
    formTip:
      'Hinge at hips to about 45°, KB in one hand hanging straight down, free hand resting on your thigh or a chair for light balance support. Keep a flat, neutral spine throughout. Pull the elbow back toward your hip — squeeze your lat and shoulder blade hard at the top. Lower with full control over 2–3 counts. Do not let the working shoulder drop at the bottom. Complete all reps on one side before switching.',
  },
  {
    id: 'kettlebell-alternating-row',
    name: 'KB Alternating Row',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Upper Back', 'Lats', 'Rear Delts'],
    gifUrl: `${GIF_BASE}/upper-back/kettlebell-alternating-row.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=d6dp8bJpEvE',
    formTip:
      'Hinge at hips to 45°, KB in one hand. Row it to your hip, lower with control, then switch to the other hand in one smooth motion — maintain the hinge position throughout. The alternating rhythm maintains time under tension on your back without locking you into one side. Keep your spine completely still; the only thing moving is your arms. Treat each hand switch as a brief pause to reset your grip, not as a rest.',
  },
```

- [ ] **Step 3: Append 4 Legs exercises after the rotating-squat-to-press object**

Insert after the closing `},` of the `rotating-squat-to-press` entry (before the `// ── Core bucket` comment):

```js
  // ── Legs bucket (KB / bodyweight additions) ───────────────────────────────
  {
    id: 'kettlebell-single-leg-deadlift',
    name: 'KB Single-Leg Deadlift',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Hamstrings', 'Glutes', 'Balance'],
    gifUrl: `${GIF_BASE}/glutes/dumbbell-single-leg-deadlift.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=UsmcOKML8V0',
    formTip:
      'Stand on one leg with a slight bend in the knee, KB in the opposite hand. Hinge forward at the hip — your torso and free leg rise and fall together as a counterbalance, like a see-saw. Keep your spine neutral and your hips square to the floor; do not let the hip of the raised leg open outward. Lower until you feel a strong hamstring stretch, then drive through your standing heel to return upright. Go light until the balance is solid.',
  },
  {
    id: 'kettlebell-lunge-pass-through',
    name: 'KB Lunge Pass-Through',
    category: 'out-of-seat',
    weight: 15,
    targetReps: 8,
    totalSets: 3,
    muscles: ['Quads', 'Glutes', 'Core'],
    gifUrl: `${GIF_BASE}/glutes/kettlebell-lunge-pass-through.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=Vfx9-YwMkQ4',
    formTip:
      'Hold the KB in front of you with both hands. Step forward into a lunge — front knee above your ankle, back knee hovering just above the floor. At the bottom, pass the KB under your front thigh from one hand to the other. Press back to stand. Alternate legs each rep. The pass-through forces you to control the KB at the bottom of the lunge where you are least stable. Keep the movement deliberate — do not rush the hand transfer.',
  },
  {
    id: 'kettlebell-front-squat',
    name: 'KB Front Squat',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Quads', 'Glutes', 'Upper Back'],
    gifUrl: `${GIF_BASE}/glutes/kettlebell-front-squat.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=MG7xzkeHz8w',
    formTip:
      'Hold the KB with both hands wrapped around the handle, pulling it into your chest. Stand with feet shoulder-width, toes slightly out. Sit back and down — chest tall, elbows high and inside your knees at the bottom. Drive through your heels to stand, squeezing your glutes at the top. The front-loaded position shifts your center of mass forward compared to a deadlift, making this more quad-dominant. Do not let your elbows drop; keeping them up forces you to stay upright.',
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single-Leg Glute Bridge',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 12,
    totalSets: 3,
    muscles: ['Glutes', 'Hamstrings', 'Core'],
    gifUrl: `${GIF_BASE}/glutes/single-leg-bridge-with-outstretched-leg.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=VUl8R0kn6v4',
    formTip:
      'Lie on your back, knees bent, feet flat and hip-width. Extend one leg straight out. Drive through the heel of the planted foot to raise your hips until your body forms a straight line from shoulder to knee to raised foot. Squeeze your glute hard at the top — hold 2 seconds. Lower with control. If your hips dip or rotate, switch back to both legs. Complete all reps on one side before switching.',
  },
```

- [ ] **Step 4: Append 4 Core exercises after the dumbbell-swing object**

Insert after the closing `},` of the `dumbbell-swing` entry (before the closing `]` of `INITIAL_EXERCISES`):

```js
  // ── Core bucket (KB / bodyweight additions) ───────────────────────────────
  {
    id: 'kettlebell-windmill',
    name: 'KB Windmill',
    category: 'out-of-seat',
    weight: 15,
    targetReps: 8,
    totalSets: 3,
    muscles: ['Obliques', 'Shoulders', 'Hip Flexors'],
    gifUrl: `${GIF_BASE}/abs/kettlebell-windmill.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=IZrX6EQWI_8',
    formTip:
      'Stand with feet wider than shoulder-width, toes angled out 45°. Press the KB overhead with one arm and keep it locked out throughout — this arm does not move. Look up at the bell. Push your hip out to the side of the locked arm, then hinge laterally until your free hand touches the floor or your shin. The KB stays vertical overhead the entire time. Rise back up by driving through your hip. Start very light — this is a highly technical shoulder-stability and lateral-chain movement.',
  },
  {
    id: 'kettlebell-figure-8',
    name: 'KB Figure-8',
    category: 'out-of-seat',
    weight: 20,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Core', 'Grip', 'Lats'],
    gifUrl: `${GIF_BASE}/abs/kettlebell-figure-8.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=r7MoAw95LCc',
    formTip:
      'Stand in a partial squat with feet just wider than shoulder-width, hinging forward at the hips. Pass the KB between your legs in a figure-8 pattern: receive with left hand, swing it around the outside of your left leg, pass through the middle to your right hand, swing around the outside of your right leg, and repeat. Stay in the squat throughout — do not stand up between reps. Keep a flat back; the hinge position is the foundation. This trains coordination and grip as much as the core.',
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 10,
    totalSets: 3,
    muscles: ['Core', 'Hip Flexors', 'Shoulders'],
    gifUrl: `${GIF_BASE}/abs/dead-bug.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=bxn9FBrt4-A',
    formTip:
      'Lie on your back with arms extended straight up toward the ceiling and knees bent at 90° directly above your hips. Press your lower back firmly into the floor — maintain this contact throughout. Simultaneously lower your right arm overhead and extend your left leg toward the floor, stopping a few inches above it. Return to start, then switch sides. If your lower back arches, reduce the range of motion until you have the strength to control it. Count each complete left-right cycle as one rep.',
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    category: 'bodyweight',
    bodyweight: true,
    weight: 0,
    targetReps: 20,
    totalSets: 3,
    muscles: ['Core', 'Shoulders', 'Hip Flexors'],
    gifUrl: `${GIF_BASE}/cardio/mountain-climber.gif`,
    videoUrl: 'https://www.youtube.com/watch?v=De3Gl-nC7IQ',
    formTip:
      'Start in a high push-up position: hands directly under shoulders, body in a straight line from head to heels. Drive one knee toward your chest, then quickly switch legs in a running motion, keeping your hips low and level. Your core should be braced throughout — hips must not pike up or sag down. Count each foot touch as one rep. Start slow to establish the form before increasing speed. A fast mountain climber with a sagging core does nothing.',
  },
```

- [ ] **Step 5: Append 4 IDs to each bucket's exerciseIds array**

In the `BUCKETS` export at the bottom of `exercises.js`, update each bucket:

```js
// push bucket — add after 'push-up'
exerciseIds: [
  'seated-overhead-press',
  'hammer-curl-to-press',
  'seated-tricep-extension',
  'floor-press',
  'lateral-raise',
  'push-up',
  'kettlebell-arnold-press',
  'kettlebell-one-arm-floor-press',
  'kettlebell-push-press',
  'bench-dip',
],

// pull bucket — add after 'bicep-curl'
exerciseIds: [
  'bent-over-row',
  'dumbbell-row',
  'reverse-fly',
  'upright-row',
  'dumbbell-pullover',
  'bicep-curl',
  'kettlebell-renegade-row',
  'kettlebell-sumo-high-pull',
  'kettlebell-one-arm-row',
  'kettlebell-alternating-row',
],

// legs bucket — add after 'rotating-squat-to-press'
exerciseIds: [
  'goblet-squat',
  'romanian-deadlift',
  'calf-raise',
  'wall-sit',
  'dumbbell-swing',
  'rotating-squat-to-press',
  'kettlebell-single-leg-deadlift',
  'kettlebell-lunge-pass-through',
  'kettlebell-front-squat',
  'single-leg-glute-bridge',
],

// core bucket — add after 'dumbbell-swing'
exerciseIds: [
  'sit-up',
  'plank-hold',
  'russian-twist',
  'wood-chop',
  'side-bend',
  'dumbbell-swing',
  'kettlebell-windmill',
  'kettlebell-figure-8',
  'dead-bug',
  'mountain-climber',
],
```

- [ ] **Step 6: Verify build and spot-check in dev server**

```bash
cd /Users/29457/Documents/Sites/0.apps/deploy-pulse && npm run build 2>&1 | tail -5
```

Expected: clean build. Then run `npm run dev` and verify:
- Each bucket now shows 10 exercise cards (6 existing + 4 new)
- New exercise cards show GIF, name (as a link), muscles, and set buttons
- Clicking a new exercise title opens the YouTube video in a new tab

- [ ] **Step 7: Commit**

```bash
rm -f .git/index.lock && sleep 0.5 && \
git add src/data/exercises.js && \
git commit -m "feat: add 16 KB/bodyweight exercises and expand buckets to 10 each"
```
