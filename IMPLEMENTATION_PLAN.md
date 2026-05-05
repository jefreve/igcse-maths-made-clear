# IGCSE Maths Made Clear — Domain Finder Exercise Platform
## Implementation Plan

---

## Overview

A math self-assessment demo platform where students solve:

> Find the domain of the function f(x) = (x² − 3) / √(x² − 8x + 15)

Features AI-powered maieutic tutoring via n8n + Gemini AI, streamed over SSE.

---

## Brand Identity

| Token | Value |
|---|---|
| Navy Dark (page bg) | `#0C1F3C` |
| Navy (card bg) | `#17273E` |
| Gold (accent) | `#FFC300` |
| Font — IGCSE badge | League Spartan |
| Font — Body/UI | Montserrat |

---

## Phase 1: Project Setup

- [x] Create `IMPLEMENTATION_PLAN.md`
- [x] Install `katex` and `react-katex`
- [x] Configure `tailwind.config.ts` with brand colours
- [x] Update `app/globals.css` with CSS variables and KaTeX styles
- [x] Update `app/layout.tsx` with Google Fonts (League Spartan + Montserrat) and metadata

---

## Phase 2: Core Layout Components

- [x] `components/layout/SiteHeader.tsx` — Brand header with IGCSE logo, tagline
- [x] `components/layout/PageShell.tsx` — Consistent page wrapper

---

## Phase 3: Exercise Components

- [x] `components/exercise/MathDisplay.tsx` — KaTeX function display card
- [x] `components/exercise/ProgressBar.tsx` — Gold-fill step progress indicator
- [x] `components/exercise/StepCard.tsx` — Per-step prompt and input wrapper
- [x] `components/exercise/MathInput.tsx` — Textarea with live KaTeX preview
- [x] `components/exercise/HintButton.tsx` — Proactive hint request button
- [x] `components/exercise/TutorFeedback.tsx` — SSE-streamed AI feedback with typewriter effect
- [x] `components/exercise/SignTable.tsx` — Interactive sign chart for Step 2
- [x] `components/exercise/NumberLine.tsx` — Visual number line with interval selection
- [x] `components/exercise/StepController.tsx` — Orchestrates all step state and transitions

---

## Phase 4: Error Detection Logic

Client-side detection before any API call. Five error patterns:

| Code | Trigger | Feedback |
|---|---|---|
| `INCLUDES_ENDPOINT` | Student includes x=3 or x=5 as closed boundary | Remind: denominator cannot be zero |
| `INTERVAL_3_5` | Student selects (3, 5) as the domain | Prompt sign analysis / parabola direction |
| `GEQ_NOT_GT` | Student writes ≥ 0 instead of > 0 as final condition | Remind: square root in denominator → strictly > 0 |
| `ONLY_ROOTS` | Student gives x=3 and x=5 without solving inequality | Explain critical values ≠ solution |
| `FORGOT_DENOM` | Student ignores denominator restriction entirely | Remind: check all denominator conditions |

- [x] `lib/errorDetection.ts` — All five patterns + answer correctness checker
- [x] `lib/types.ts` — Shared TypeScript types

---

## Phase 5: n8n Webhook Integration (SSE)

### Next.js API Route
- [x] `app/api/tutor/route.ts` — Receives `{ stepNumber, studentAnswer, errorCode, hintMode, conversationHistory }`, forwards to n8n webhook, streams SSE response back to browser

### n8n Workflow Structure (configure separately in n8n)

```
[Webhook Node]
    ↓
[Switch Node] — branch on hintMode
    ├── [Set Node: Hint Prompt] → constructs Socratic guiding question
    └── [Set Node: Feedback Prompt] → constructs error-specific maieutic response
         ↓
[Gemini AI Node] — streaming enabled, British English system instructions
         ↓
[Respond to Webhook Node] — SSE stream back to Next.js
```

**Environment variable required:**
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/tutor
```

**Payload sent to n8n:**
```json
{
  "stepNumber": 1,
  "studentAnswer": "x² - 8x + 15 ≥ 0",
  "errorCode": "GEQ_NOT_GT",
  "hintMode": false,
  "conversationHistory": []
}
```

**Gemini system prompt principles:**
- British English throughout
- Never reveal the answer directly
- Ask guiding questions (Socratic / maieutic method)
- Tailor feedback to the specific error code
- Keep responses concise (2–4 sentences)

**Error code → suggested prompt context mapping for n8n:**

| errorCode | n8n prompt instruction |
|---|---|
| `INCLUDES_ENDPOINT` | "The student has included x=3 or x=5 as a closed endpoint. Remind them (without giving the answer) that the denominator cannot be zero." |
| `INTERVAL_3_5` | "The student selected the interval between 3 and 5. Ask them to check the sign of the quadratic in each region or think about the direction the parabola opens." |
| `GEQ_NOT_GT` | "The student wrote ≥ 0 as the final condition. Ask them to think carefully about what happens when the square root equals zero and it is in the denominator." |
| `ONLY_ROOTS` | "The student only found x=3 and x=5. Explain that these are critical values and ask them what they need to do next to find the solution to the inequality." |
| `FORGOT_DENOM` | "The student seems to have forgotten the denominator restriction. Ask them to look again at the structure of the function and identify all the parts that could cause it to be undefined." |

---

## Phase 6: Pages

- [x] `app/page.tsx` — Landing page with exercise intro and "Begin Exercise" CTA
- [x] `app/exercise/page.tsx` — Full interactive workspace
- [x] `app/results/page.tsx` — Assessment report with per-step evaluation

---

## Phase 7: Assessment Report

- [x] `components/results/AssessmentReport.tsx`

Three evaluation dimensions assessed per step:

| Dimension | What is assessed |
|---|---|
| Logical Reasoning | Correct identification of conditions and their combination |
| Algebraic Manipulation | Correct solution of the quadratic equation/inequality |
| Mathematical Notation | Correct interval notation with open brackets |

Scoring:
- **Correct** — answered correctly without hints or feedback (3 pts)
- **With guidance** — needed hints or feedback before getting it right (2 pts)
- **Answer shown** — answer was revealed (1 pt)

---

## Correct Answer Reference

```
x² - 8x + 15 = (x - 3)(x - 5)
(x - 3)(x - 5) > 0
Solution: x < 3 or x > 5
Domain: (-∞, 3) ∪ (5, +∞)
```

Endpoints 3 and 5 are **excluded** (open brackets) because the denominator cannot be zero.

---

## File Structure

```
app/
  page.tsx                    ✅ Landing page
  layout.tsx                  ✅ Root layout with fonts
  globals.css                 ✅ Global styles + KaTeX
  exercise/
    page.tsx                  ✅ Exercise workspace
  results/
    page.tsx                  ✅ Assessment report
  api/
    tutor/
      route.ts                ✅ n8n SSE proxy

components/
  layout/
    SiteHeader.tsx            ✅
    PageShell.tsx             ✅
  exercise/
    MathDisplay.tsx           ✅
    ProgressBar.tsx           ✅
    StepCard.tsx              ✅
    MathInput.tsx             ✅
    HintButton.tsx            ✅
    TutorFeedback.tsx         ✅
    SignTable.tsx             ✅
    NumberLine.tsx            ✅
    StepController.tsx        ✅
  results/
    AssessmentReport.tsx      ✅

lib/
  errorDetection.ts           ✅ Client-side error pattern matching
  types.ts                    ✅ Shared TypeScript types
  utils.ts                    (existing)

public/
  logo.png                    ✅ IGCSE circular logo

.env                          ✅ N8N_WEBHOOK_URL placeholder added
IMPLEMENTATION_PLAN.md        ✅ This file
```

---

## Setup Instructions

1. Deploy the Next.js app as normal.
2. In your n8n instance, create a workflow with:
   - **Webhook** trigger node (POST, path: `/tutor`, SSE response enabled)
   - **Switch** node branching on `{{ $json.hintMode }}`
   - **Set** nodes for hint and feedback prompts (see error code table above)
   - **Gemini AI** node with streaming
   - **Respond to Webhook** node returning SSE events in format: `data: {"text": "..."}\n\n`
3. Copy the n8n webhook URL into `.env` as `N8N_WEBHOOK_URL`.
4. Redeploy / restart the Next.js app.
