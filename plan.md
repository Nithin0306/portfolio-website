# WORLD//CLI: Portfolio Build Plan (HTML + CSS + JavaScript)

**Purpose of this file:** a complete, phase-by-phase specification. An AI (or a developer) should be able to build the whole website from this file alone, without asking questions. Every phase lists what to build, exact values, code where it matters, and an acceptance check.

**What is being built:** a personal portfolio for **Nithin** (CSE student at Amrita, SDE intern, Hack101 2nd place) styled as a **Mario-style pixel world** where a **terminal is part of the world** (prompt written on the floor, content in an underground bonus room). It must impress and inform recruiters (HR) in seconds while staying playful and unique.

**Stack:** plain HTML, CSS, JavaScript (ES modules). No framework, no build step, no image libraries. Pixel art is drawn from text maps in JS. The only raster images are real project screenshots.

---

## 0. Non-negotiable rules

1. **HR-first.** Within 10 seconds a visitor must see: name, what he does, education, internship, award, and a Resume button. Every section is reachable in one click, by plain link, by block, or by typing.
2. **Content works without JavaScript.** All text lives in real HTML sections. JS only enhances.
3. **Every page has a real URL** (hash routes) so links can be shared and the browser Back button works.
4. **Flat colour only.** No smooth gradients, no glows, no blur, no translucent shadows. Hard-stop colour bands, solid colours, hard offset shadows in solid ink only.
5. **Two typefaces** (Press Start 2P, Inter) plus **one exception**: JetBrains Mono for the terminal prompt only.
6. **Five type sizes** only (see tokens).
7. **No emoji anywhere** (including favicon and terminal output). Use pixel sprites.
8. **Original art only.** No Nintendo sprites, names, music or logos. The hero is a developer with a monitor for a head.
9. **No invented proof.** Never invent companies, dates, metrics, quotes, skills or links. Unknown content stays as a visible `TODO` in the HTML and is listed in the final report.
10. **Reduced motion and keyboard are first-class** (Phase 13).
11. **Real pictures:** at least 4 real project screenshots appear on the site (billboard + project pages).

---

## 1. The idea (decide before building)

> On this page, **a developer's projects and career** becomes **a playable Mario-style level whose terminal is the floor and the underground**.

Each project is a level with **its own mini-world drawn from what the project is**:

| Project | Level | World theme |
|---|---|---|
| SkillUp (AI skill gap analyzer, Hack101 2nd place) | 1-1 | A literal **gap** in the ground between two ledges: "where you are" and "target role"; stepping blocks labelled with skills |
| GroupFlix (movie recommendation) | 1-2 | A **cinema room**: red curtains, screen, seat silhouettes |
| FishGlob (current-aware fish analysis) | 1-3 | An **underwater** level: flat blue bands, fish, animated current arrows |
| NeoFlash (learning platform, web) | 2-1 | A **study room** of flashcard blocks that flip on click |

The one live thing: the hero **walks to a block, jumps, bumps it, a tech item pops** (lightbulb, terminal, trophy, gear, document) and you drop into that section. Collected items fill the score line.

---

## 2. Design tokens (create first, reference everywhere)

### 2.1 Colour (flat)

```css
:root{
  /* ink + paper */
  --ink:#1a1208; --paper:#fbf6e6; --paper-2:#f1e9cf; --muted:#5c5546;
  /* accents */
  --gold:#f5c451; --red:#e8453c; --green:#2e9f4a;
  /* wood sign */
  --wood:#a8742f; --wood-2:#8f5f25; --wood-dark:#3b2410; --wood-light:#c99350; --sign-text:#fff4d6;
  /* brick floor */
  --brick:#c84c0c; --brick-dark:#7a2a00; --brick-top:#e08a4a;
  /* underground */
  --wall:#1d4fd8; --wall-dark:#0b2570;
  /* scenery */
  --grass:#2fa84f; --grass-dark:#0c5a1f; --stone:#b4b4b8; --stone-dark:#7a7a80;
  /* sky: 4 flat bands, lightest at the horizon */
  --sky-1:#4f87f0; --sky-2:#5c94fc; --sky-3:#6fa3ff; --sky-4:#86b4ff; --cloud:#ffffff; --sun:#ffe36b;
  /* project worlds */
  --water-1:#0f4f8a; --water-2:#1d6fb8; --water-3:#2a86d4;
  --cine-wall:#2a1418; --curtain:#7a1f2b; --curtain-dark:#5a1420;
  --study-1:#1f7a6b; --study-2:#2a9a88;
}
/* night variant: only the sky and clouds change */
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){ --sky-1:#141f55; --sky-2:#1b2a66; --sky-3:#243480; --sky-4:#34459a; --cloud:#8d9bd0; --sun:#e8ecf5; }
}
:root[data-theme="dark"]{ --sky-1:#141f55; --sky-2:#1b2a66; --sky-3:#243480; --sky-4:#34459a; --cloud:#8d9bd0; --sun:#e8ecf5; }
```

### 2.2 Type (two faces + one exception, five sizes)

| Token | Value | Use |
|---|---|---|
| `--fs-xs` | `12px` | score line, block labels, prompt, tags, captions (minimum size anywhere) |
| `--fs-s` | `16px` | body text (Inter 400, line-height 1.55) |
| `--fs-m` | `24px` | page headings and the statement line (Inter 700) |
| `--fs-l` | `32px` | project names and big sub-headings (Inter 700) |
| `--fs-xl` | `clamp(40px, 10vw, 136px)` | the name "NITHIN" only (Press Start 2P) |

Fonts (Google Fonts, `display=swap`): `Press Start 2P`, `Inter` (400, 600, 700), `JetBrains Mono` (400, prompt only). Fallbacks: `"Courier New", monospace` for the pixel face, `system-ui, sans-serif` for Inter, `ui-monospace, monospace` for the prompt. Press Start 2P is also used at 12px for the score plaques and level tags.

### 2.3 Space, borders, shadows

- Outer margin: `--m: clamp(16px, 3vw, 40px)`, equal left and right everywhere.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 px.
- Borders: **3px solid var(--ink)** on signs, buttons, cards (pixel look). No 1px hairlines, no dashed lines.
- Shadows: only hard offsets in solid ink: `box-shadow: 4px 4px 0 var(--ink)` (small) or `6px 6px 0 var(--ink)` (card). Never blurred, never translucent.
- Corners: square (0 radius) everywhere, except the pixel hills and bushes.
- Pixel images: `image-rendering: pixelated` on every sprite; screenshots use normal rendering.

### 2.4 Motion tokens

`--t-fast: 120ms`, `--t-med: 250ms`, `--t-slide: 800ms cubic-bezier(.6,0,.3,1)`, stagger step `70ms`. Animate only `transform` and `opacity`.
