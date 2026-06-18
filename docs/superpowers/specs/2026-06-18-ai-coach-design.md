# AI Coach Design

**Date:** 2026-06-18

## Goal

Add a fifth "Coach" tab that calls the Anthropic API directly from the browser, analyzes the current month's exercise and cardio data, and streams back personalized tips, progress observations, and encouragement.

---

## Architecture

**Approach:** Direct browser-to-Anthropic API call using `fetch` with streaming (SSE). No server or proxy. The API key is stored in `localStorage` under the key `deploypulse_coach_key`. This is acceptable for a personal app used only by the owner.

**Model:** `claude-haiku-4-5-20251001` — fast and cheap; appropriate for a structured coaching summary.

**Files changed:**
| File | Change |
|---|---|
| `src/components/CoachView.jsx` | New component: key setup form + streaming response view |
| `src/App.jsx` | Add "Coach" tab + render `<CoachView>` |

---

## Feature: API Key Setup

On first visit (no key in localStorage), `CoachView` renders a centered form:

- Label: "Anthropic API Key"
- Input: `<input type="password" name="apiKey" id="apiKey" autocomplete="current-password">`
  - `type="password"` enables Dashlane autofill on mobile (store the key under the app's Amplify domain in Dashlane)
- Button: "Save Key"
- On save: write key to `localStorage.setItem('deploypulse_coach_key', key)`, trigger analysis

At the bottom of the response view, a small "Change API key" link clears the stored key and re-shows the form.

---

## Feature: Coaching Analysis

**Trigger:** Fires automatically each time the Coach tab is opened (no caching).

**Data sent:**

1. Current month's exercise logs — grouped by date, each exercise aggregated: name, total sets, reps, weight.
2. Current month's cardio habit days — which dates had peloton, walk, yoga, outdoor bike.
3. Static user context baked into the system prompt.

**System prompt:**

```
You are a supportive fitness coach for a 60-year-old web developer who does short "exercise snacks" 
at their desk during software deployment breaks. They use dumbbells and kettlebells. Be encouraging, 
specific to their data, and practical. Keep your response under 300 words.

Respond in exactly three short sections with these markdown headers:
## Progress
## Tips
## Keep Going
```

**User message:** A structured text summary of the month's data, e.g.:

```
Here is my workout data for June 2026:

Exercise logs:
- Jun 2: Push-Up — 3 sets × 10 reps, Goblet Squat — 2 sets × 12 reps @ 20 lbs
- Jun 4: (rest day)
...

Cardio habits:
- Jun 2: Peloton Ride (30 min)
- Jun 5: Walk
...

Today is Jun 18. Please analyze my month so far.
```

---

## Feature: Streaming Response

The response streams using the Anthropic Messages API with `"stream": true`. The component reads the SSE stream and appends text chunks to state as they arrive, so the coaching text appears word-by-word.

**Loading state:** "Thinking..." with a subtle animated ellipsis while the first token arrives.

**Error states:**
- `401` / invalid key: "Invalid API key. Please check your key and try again." + "Change API key" link.
- Network failure: "Couldn't reach the coaching service. Check your connection and try again." + retry button.
- Any other error: generic error message + retry button.

**Rendering:** The streamed response contains markdown (`##` headers, plain paragraphs). Render it as plain text with `##` headers styled as `<h3>` elements, and paragraphs as `<p>`. No markdown library dependency — a lightweight inline renderer handles just headers and paragraphs.

---

## UI

**Tab:** Label "Coach", icon `Sparkles` from lucide-react.

**Response layout:**
- Subtle card with white background, rounded corners, consistent with existing card style
- Three sections render progressively as tokens stream in
- "Change API key" link at the very bottom in muted text

**No history or persistence** of past coaching responses — each tab visit is a fresh analysis.

---

## Out of Scope

- No conversational back-and-forth (one-shot analysis only)
- No persistence of past coaching responses
- No model selector
- No token usage display
