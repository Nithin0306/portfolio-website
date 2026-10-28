# WORLD//CLI: Portfolio Build Plan (HTML + CSS + JavaScript)

**Purpose of this file:** a complete, phase-by-phase specification. An AI (or a developer) should be able to build the whole website from this file alone, without asking questions. Every phase lists what to build, exact values, code where it matters, and an acceptance check.

**What is being built:** a personal portfolio for **Nithin** (CSE student at Amrita, SDE intern, Hack101 2nd place) styled as a **Mario-style pixel world** where a **terminal is part of the world** (prompt written on the floor, content in an underground bonus room). It must impress and inform recruiters (HR) in seconds while staying playful and unique.

**Home screen reference:** the home screen must match the approved layout in Phase 5 (a screenshot of the v8 prototype): a hanging wooden sign at the top left that contains the name and every key fact, open sky with a sun and clouds on the right, a centred row of question blocks, hills, a small castle with a flag, and the terminal prompt written on the brick floor.

**Stack:** plain HTML, CSS, JavaScript (ES modules). No framework, no build step, no image libraries. Pixel art is drawn from text maps in JS. The only raster images are real project screenshots.

---
## 0. Non-negotiable rules

1. **HR-first.** Within 10 seconds a visitor must see: name, what he does, education, internship, award, and a Resume button. Every section is reachable in one click, by plain link, by block, or by typing.
2. **Content works without JavaScript.** All text lives in real HTML sections. JS only enhances.
3. **Every page has a real URL** (hash routes) so links can be shared and the browser Back button works.
4. **Flat colour only.** No smooth gradients, no glows, no blur, no translucent shadows. The sky is one flat colour. Shadows are hard offsets in solid ink only.
5. **Three typefaces with fixed roles:** Press Start 2P (name, score line, hint), JetBrains Mono (the "terminal voice" on the world surface: sign text, labels, chips, buttons, prompt), Inter (reading content in the underground pages).
6. **Five type sizes** only (see tokens).
7. **No emoji anywhere** (including favicon and terminal output). Use pixel sprites.
8. **Original art only.** No Nintendo sprites, names, music or logos. The hero is a developer with a monitor for a head.
9. **No invented proof.** Never invent companies, dates, metrics, quotes, skills or links. Unknown content stays as a visible `TODO` in the HTML and is listed in the final report.
10. **Reduced motion and keyboard are first-class** (Phase 13).
11. **Real pictures:** the four real project screenshots appear on the project pages inside the arcade-bezel frame.
12. **The home screen is fixed by the approved reference.** Do not add a top bar, billboard, signpost or oversized name to it. The hanging sign is the information board.
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
  /* wood sign (check white text on wood is at least 4.5:1) */
  --wood:#8f5f25; --wood-2:#7a4f1c; --wood-dark:#3b2410; --wood-light:#c99350; --sign-text:#ffffff; --sign-soft:#f1e3c0;
  /* brick floor */
  --brick:#c84c0c; --brick-dark:#7a2a00; --brick-top:#e08a4a;
  /* underground */
  --wall:#1d4fd8; --wall-dark:#0b2570;
  /* scenery */
  --grass:#2fa84f; --grass-dark:#0c5a1f; --stone:#b4b4b8; --stone-dark:#7a7a80;
  /* sky: one flat colour */
  --sky:#5c94fc; --cloud:#ffffff; --sun:#ffe36b; --sun-ring:#9dc0ff;
  /* project worlds */
  --water-1:#0f4f8a; --water-2:#1d6fb8; --water-3:#2a86d4;
  --cine-wall:#2a1418; --curtain:#7a1f2b; --curtain-dark:#5a1420;
  --study-1:#1f7a6b; --study-2:#2a9a88;
}
/* night variant: only the sky and clouds change */
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){ --sky:#1b2a66; --cloud:#8d9bd0; --sun:#e8ecf5; --sun-ring:#34459a; }
}
:root[data-theme="dark"]{ --sky:#1b2a66; --cloud:#8d9bd0; --sun:#e8ecf5; --sun-ring:#34459a; }
```

### 2.2 Type (three faces with fixed roles, five sizes)

Faces (Google Fonts, `display=swap`):
- **Press Start 2P**: the name, the score line, the hint, level tags. Fallback `"Courier New", monospace`.
- **JetBrains Mono** (400, 700): the terminal voice on the world surface: sign label, sign paragraph, chips, buttons, block labels, prompt, nav row. Fallback `ui-monospace, monospace`.
- **Inter** (400, 600, 700): reading content inside the underground pages (headings, body, lists, tags). Fallback `system-ui, sans-serif`.

| Token | Value | Use |
|---|---|---|
| `--fs-xs` | `12px` | labels, chips, block labels, score line, hint, tags (minimum size anywhere) |
| `--fs-s` | `14px` | sign paragraph, prompt |
| `--fs-m` | `16px` | body text in room pages (Inter, line-height 1.55), the typed role line (Inter 700) |
| `--fs-l` | `24px` | page headings and project names (Inter 700) |
| `--fs-xl` | `clamp(32px, 5vw, 56px)` | "NITHIN" inside the sign only (Press Start 2P) |

### 2.3 Space, borders, shadows

- Outer margin: `--m: clamp(16px, 3vw, 40px)`, equal left and right everywhere.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 px.
- Borders: **3px solid var(--ink)** on signs, buttons, cards (pixel look). No 1px hairlines, no dashed lines.
- Shadows: only hard offsets in solid ink: `box-shadow: 4px 4px 0 var(--ink)` (small) or `6px 6px 0 var(--ink)` (card). Never blurred, never translucent.
- Corners: square (0 radius) everywhere, except the pixel hills and bushes.
- Pixel images: `image-rendering: pixelated` on every sprite; screenshots use normal rendering.

### 2.4 Motion tokens

`--t-fast: 120ms`, `--t-med: 250ms`, `--t-slide: 800ms cubic-bezier(.6,0,.3,1)`, stagger step `70ms`. Animate only `transform` and `opacity`.

---

## 3. File structure

```
portfolio/
├── index.html              # all content as real HTML + world markup
├── css/
│   ├── tokens.css          # section 2
│   ├── base.css            # reset, type, focus, no-JS document styling
│   ├── world.css           # sky, hills, floor, blocks, hero, castle
│   ├── sign.css            # hanging wooden sign, chips, buttons
│   ├── room.css            # underground layer, paper card, nav, pipe
│   ├── projects.css        # the four project worlds
│   └── responsive.css      # breakpoints + reduced motion
├── js/
│   ├── sprites.js          # maps + sprite() + tile()
│   ├── router.js           # hash routing, titles
│   ├── world.js            # hero walk/jump/bump, item pop, score
│   ├── room.js             # render page into card, nav, next buttons
│   ├── terminal.js         # prompt + commands
│   ├── projects.js         # themed project worlds + small interactions
│   └── main.js             # boot order, state
├── assets/
│   ├── shots/              # skillup.png groupflix.png fishglob.png neoflash.png (1280x800)
│   ├── resume.pdf
│   ├── og.png              # 1200x630 preview (screenshot of the first screen)
│   └── favicon.svg         # generated from the hero sprite map as <rect>s
└── plan.md
```

Script load order: `main.js` (a `<script type="module">`) imports `sprites → router → world → room → projects → terminal`.

---

## Phase 0: Prerequisites (gather before coding)

Collect these; the build needs them.

1. **Facts** (fill every `TODO`): company, dates and 2 to 3 impact bullets for the internship (with numbers if true), education years, per-project problem, what was built, 3 highlights, stack, Source and Demo URLs, email, GitHub, LinkedIn, resume PDF.
2. **Screenshots:** one real screenshot per project (1280x800 PNG, no browser chrome, cropped to the best screen, alt text written). Names: `skillup.png`, `groupflix.png`, `fishglob.png`, `neoflash.png`.
3. **Known facts so far:** Nithin; CSE at Amrita; SDE intern; Hack101 second place for SkillUp (AI skill gap analyzer); projects SkillUp, GroupFlix (movie recommendation), FishGlob (current-aware fish analysis), NeoFlash (learning platform).
4. **Argument (claims and proof):** one line per section.

| Section | Claim | Proof shown |
|---|---|---|
| About | Builds useful AI and web software | summary, education, status |
| Projects | Ships real things | 4 levels with screenshots, stack, links |
| Awards | Competes and places | Hack101 2nd place, linked to SkillUp |
| Experience | Works in a team | internship role, bullets |
| Resume | Everything on one page | summary table + PDF |
| Contact | Easy to reach | email, GitHub, LinkedIn |

**Done when:** a list of remaining `TODO`s exists and screenshots are in `assets/shots/`.

---

## Phase 1: Semantic HTML, content first (works with no JS)

Build the whole content as a normal document. The world is added on top later.

### 1.1 Page skeleton

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Nithin · Software engineer in the making</title>
  <meta name="description" content="Nithin: CSE student at Amrita, SDE intern, Hack101 runner-up. Projects in AI and web.">
  <meta property="og:title" content="Nithin · Software engineer in the making">
  <meta property="og:description" content="Projects, experience and resume.">
  <meta property="og:image" content="assets/og.png">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <!-- fonts + css links -->
</head>
<body>
  <a class="skip" href="#pages">Skip to content</a>
  <div id="world"> <!-- Phase 4 and later; empty at this stage --> </div>

  <main id="pages">
    <header class="page" data-page="home">
      <h1>Nithin</h1>
      <p>Software engineer in the making: CSE student at Amrita, SDE intern, Hack101 runner-up.</p>
      <p><a href="assets/resume.pdf">Resume</a> · <a href="#/projects">Projects</a> · <a href="#/contact">Contact</a></p>
    </header>
    <section class="page" id="about"      data-page="about"      data-icon="bulb">...</section>
    <section class="page" id="projects"   data-page="projects"   data-icon="term">...</section>
    <section class="page" id="awards"     data-page="awards"     data-icon="trophy">...</section>
    <section class="page" id="experience" data-page="experience" data-icon="gear">...</section>
    <section class="page" id="resume"     data-page="resume"     data-icon="doc">...</section>
    <section class="page" id="contact"    data-page="contact">...</section>
    <!-- one article per project -->
    <article class="page project" data-page="skillup" data-level="1-1" data-theme="gap"
             data-shot="assets/shots/skillup.png" data-title="SkillUp" data-tagline="AI skill gap analyzer">...</article>
    <article class="page project" data-page="groupflix" data-level="1-2" data-theme="cinema">...</article>
    <article class="page project" data-page="fishglob"  data-level="1-3" data-theme="water">...</article>
    <article class="page project" data-page="neoflash"  data-level="2-1" data-theme="study">...</article>
    <section class="page" data-page="help">...</section>
    <section class="page" data-page="map">...</section>
    <section class="page" data-page="error"><h2>Command not found</h2><p>Try <b>help</b>.</p></section>
  </main>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### 1.2 Content per page (write real copy)

- **about:** `h2` "About"; one paragraph (max 25 words); key facts list (Education, Role, Focus, Status); Resume button.
- **projects:** `h2` "Projects"; four entries, each a link `<a href="#/projects/skillup">` with name, tagline, one sentence, tags.
- **project (each):** `h2` name; tagline; award badge if any; screenshot `<img>` with alt; Overview (problem + what was built); Highlights (3 bullets); Stack tags; Links (Source, Demo); previous and next project links.
- **awards:** Hack101, second place, SkillUp; link to the project.
- **experience:** role, company, dates, bullets; education block.
- **resume:** summary table (education, experience, projects, awards) + download link.
- **contact:** email (`mailto:`), GitHub, LinkedIn, Resume; ASCII castle inside `<pre aria-hidden="true">`.
- **help:** list of commands (Phase 10).

Copy rules: every heading fits two lines at every width (about 32 characters or fewer); body in full ink at 16px or more; no placeholder text without a visible `TODO`.

### 1.3 No-JS styling (in `base.css`)

When `html:not(.js)`, `#pages` renders as a clean single-column document on `--paper` ground, 760px max width, `--m` margins, sections separated by 64px of space, and `#world` is hidden. When `html.js` (set by an inline script in `<head>`), `#pages` is visually hidden and its sections are used as templates (Phase 8).

**Done when:** with JS disabled, a reader gets every fact and every link on one readable page.

---

## Phase 2: Base CSS

- Reset: `*,*::before,*::after{box-sizing:border-box}`, `body{margin:0}`, `img{display:block;max-width:100%}`.
- `body`: Inter 16px/1.55, colour `--ink`, background `--paper`.
- Headings: `h2` and project names use `--fs-l`; no tiny uppercase tracked labels anywhere.
- Buttons (`.btn`): 3px ink border, flat fill, square corners, `font: 700 var(--fs-xs) JetBrains Mono` in the world and `600 var(--fs-m) Inter` inside room pages, padding `8px 16px`, shadow `4px 4px 0 var(--ink)`; hover: `translate(-1px,-2px)` and shadow `6px 6px 0`; active: `translate(2px,2px)` and shadow `0`. Variants: `.btn.pri` gold fill, default paper fill.
- Tags (`.tag`): `--paper-2` fill, ink text 12px Inter 600, padding `2px 8px`, no border.
- Focus: `:focus-visible { outline: 3px solid var(--red); outline-offset: 3px }`.
- Skip link first in `<body>`: "Skip to content" (visible on focus).

**Done when:** the no-JS page looks intentional and passes a quick keyboard tab-through.

---

## Phase 3: Sprite engine (`js/sprites.js`)

All art is text maps; each character is one pixel, mapped to a colour. `.` is transparent.

```js
export const PAL = {
  k:"#1a1208", K:"#0e1f14", g:"#8be28b", r:"#ff5c5c", n:"#3a5bd9",
  y:"#f5c451", w:"#fff1b8", o:"#b5542a", c:"#a8742f", C:"#6e4817",
  b:"#c84c0c", B:"#7a2a00", d:"#5a1d00",
  u:"#1d4fd8", U:"#0b2570",
  s:"#b4b4b8", S:"#7a7a80", G:"#8d8f94", W:"#f2f0e8"
};
export function dataURL(rows, scale){
  const c = document.createElement("canvas");
  c.width = rows[0].length*scale; c.height = rows.length*scale;
  const x = c.getContext("2d");
  rows.forEach((r,y)=>[...r].forEach((ch,i)=>{ if(PAL[ch]){ x.fillStyle=PAL[ch]; x.fillRect(i*scale,y*scale,scale,scale);} }));
  return c.toDataURL();
}
export const sprite = (name, scale) => dataURL(MAPS[name], scale);
export const tile   = (name, scale) => `url(${sprite(name, scale)})`; // for repeating backgrounds
```

### 3.1 Maps (use exactly)

```js
export const MAPS = {
  brick:  ["bbbbBbbb","bbbbBbbb","BBBBBBBB","bBbbbbbb","bBbbbbbb","BBBBBBBB","bbbbBbbb","bbbbBbbb"],
  earth:  ["BBBBdBBB","BBBBdBBB","dddddddd","BdBBBBBB","BdBBBBBB","dddddddd","BBBBdBBB","BBBBdBBB"],
  ubrick: ["uuuuUuuu","uuuuUuuu","UUUUUUUU","uUuuuuuu","uUuuuuuu","UUUUUUUU","uuuuUuuu","uuuuUuuu"],
  q:      ["kooooook","oyykkyyo","oykyykyo","oyyyykyo","oyyykyyo","oyyyyyyo","oyyykyyo","kooooook"],
  used:   ["CCCCCCCC","CccccccC","CccccccC","CccccccC","CccccccC","CccccccC","CccccccC","CCCCCCCC"],
  hero:   ["kkkkkkkkkk","kKKKKKKKKk","kKgKKKKKKk","kKKgKKKKKk","kKgKKggKKk","kkkkkkkkkk",
           "..rrrrrr..",".rrrrrrrr.",".rrrrrrrr.","..nnnnnn..","..nn..nn..",".kkk..kkk."],
  bulb:   ["..kkkk..",".kyyyyk.",".kywyyk.",".kyyyyk.","..kyyk..","..kkkk..","..kGGk..","...kk..."],
  term:   ["kkkkkkkk","kKKKKKKk","kKgKKKKk","kKKgKKKk","kKgKKggk","kKKKKKKk","kkkkkkkk","........"],
  trophy: ["kyyyyyyk","kywyyyyk",".kyyyyk.","..kyyk..","...kk...","...yy...","..kyyk..",".kkkkkk."],
  gear:   ["...GG...",".G.GG.G.","..GGGG..","GGG..GGG","GGG..GGG","..GGGG..",".G.GG.G.","...GG..."],
  doc:    [".kkkkkk.",".kWWWWk.",".kWkkWk.",".kWWWWk.",".kWkkkk.",".kWWWWk.",".kWkkWk.",".kkkkkk."],
  castle: ["s.s.s..s.s.s","ssssssssssss","ssSSssssSSss","ssssssssssss","ssssskksssss","ssssskksssss","ssssskksssss"],
  flag:   ["kggggg..","kgggggg.","kggggg..","kgggg...","k.......","k.......","k.......","k......."],
  plank:  ["cccccccc","cccccccc","cccccccc","cccccccc","cccccccc","cccccccc","cccccccc","CCCCCCCC"]   // wood plank with a dark join row
};
```
Additional decorative sprites (author as small maps in the same style, 8 to 14 px wide): `fish` (9x5, orange `o` body, `k` outline, one `w` eye, triangular tail), `seat` (cinema seat silhouette in the curtain-dark colour), `card` (flashcard, paper `W` with `k` outline). Add any new colour letters to `PAL` as needed.

### 3.2 Usage
- `<img src>` for the hero (scale 5 → 50x60px), blocks (scale 5 → 40px), pickups (scale 5), HUD icons (scale 2 → 16px), castle (scale 6 → 72px wide), flag (scale 4).
- Tiles: sign planks `tile("plank", 3)` (24px per plank), floor strip `tile("brick", 3)` (24px tall); earth `tile("earth", 3)`; underground wall `tile("ubrick", 4)`.
- Generate `assets/favicon.svg` once from the `hero` map as `<rect>` elements (no emoji).

**Done when:** a test page shows every sprite crisp, no blur at 100% and 200% zoom.

---
## Phase 4: World scene, surface layer

Reference size 1030 x 750 (desktop). Use percentages so it scales.

### 4.1 Markup

```html
<div id="world" class="scene">
  <div class="score"><span>NITHIN</span><span id="hc">0/6</span><span>WORLD 1-1</span></div>
  <div class="layer over" id="over">
    <div class="sun"><i></i></div>
    <div class="cloud big"></div> <div class="cloud"></div> <div class="cloud sm"></div>
    <div class="hill h1"></div> <div class="hill h2"></div>
    <div class="sign"> <!-- Phase 5 --> </div>
    <div class="hint">hit a block, or type on the floor</div>
    <div class="blocks" id="blocks"></div>
    <button class="flag-btn" data-go="contact" aria-label="Contact"><span>contact</span></button>
    <img class="castle" alt="">
    <img class="hero" id="hero" alt="Pixel developer with a terminal screen for a head">
    <div class="floor">
      <div class="strip"></div><div class="earth"></div>
      <form class="prompt" id="f1"><span class="p">nithin@world-1:~$</span><input aria-label="Command prompt" autocomplete="off" spellcheck="false" placeholder="type help, projects, open skillup..."></form>
    </div>
  </div>
  <div class="layer under" id="under"> <!-- Phase 7 --> </div>
</div>
```

### 4.2 CSS specification

- `.scene{position:relative; width:100%; height:clamp(720px,100svh,800px); overflow:hidden; background:var(--ink)}`.
- `.layer{position:absolute; inset:0; transition: transform var(--t-slide)}`; `.over{background:var(--sky)}` (flat).
- **Score line:** `position:absolute; top:10px; left:14px; right:14px; z-index:9; display:flex; justify-content:space-between; font:var(--fs-xs) "Press Start 2P"; color:#fff; text-shadow:2px 2px 0 var(--ink); pointer-events:none`. No bar, no plaque. Left "NITHIN", centre collected icons + `n/6`, right "WORLD 1-1".
- **Sun:** 68px square `--sun-ring` at `top:50px; right:6%`, with a centred 44px `--sun` square (the inner `<i>`) and a 4px lighter step border. Flat, no glow.
- **Clouds:** 20px square `--cloud` with hard box-shadow copies (`20px 0`, `40px 0`, `60px 0`, `20px -20px`, `40px -20px`, all `--cloud`, zero blur). `.big` scale 1.5, `.sm` scale .7. They live in the open right half (tops about 110px, 200px, 300px, left about 62%, 78%, 52%) and drift with `translateX` over 90, 110 and 130 s with negative delays.
- **Hills:** flat `--grass` with a 3px `--grass-dark` outline, `border-radius:50% 50% 0 0`, bottom at the floor top. Hill 1: `left:42%; width:260px; height:92px`. Hill 2: `left:70%; width:200px; height:64px`. Each has two small bush bumps drawn inside (`::before` and `::after`, same colours, slightly darker outline).
- **Floor:** `position:absolute; left:0; right:0; bottom:0; height:96px; z-index:5`. `.strip` 24px with `tile("brick",3)`; `.earth` the remaining 72px with `tile("earth",3)`; no overlay.
- **Prompt:** inside `.earth`, `display:flex; align-items:center; height:72px; padding:0 16px`; path `--gold`, input `#fff`, JetBrains Mono `--fs-s`, caret `--red`, placeholder colour `#b8a58a`.
- **Castle:** `right:2%; bottom:96px`, scale 6. **Flag button:** `right:112px; bottom:96px; width:48px; height:120px`; 5px pole (`#e8e8e8`, 100px tall) with a red triangle flag near the top; the label "contact" (mono 12px, white, hard ink shadow) sits above it.
- **Hint:** centred, `bottom:262px` (above the block labels), Press Start 2P `--fs-xs`, white with a hard ink shadow, 2s soft blink (static under reduced motion).

**Done when:** the empty world matches the reference at 1030x750 and looks complete at 1440x900 and 390x844 with no horizontal scroll.
---
## Phase 5: The hanging sign (the information board, matches the approved reference)

The sign is the whole first-screen message. There is no separate giant name, billboard or top bar.

### 5.1 Placement and frame
- `.sign{position:absolute; top:76px; left:max(14px,3.5%); width:min(600px, calc(100% - 28px)); z-index:3; padding:18px 22px}`.
- Hangs from the top of the scene by **two chains**: 6px wide strips running from the scene top to the sign top, at `left: 40px` and `right: 45px` of the sign. Chain = alternating light grey (`#c9ccd2`, 6px) and dark grey (`#555`, 2px) segments (use a 6x8 chain tile).
- Planks: background `tile("plank", 3)` (flat, 24px planks with dark join rows, so the horizontal lines show). Border 4px solid `--wood-dark`; inner highlight `outline: 3px solid var(--wood-light); outline-offset:-7px`; hard shadow `6px 6px 0 var(--ink)`; four nails (8px `--wood-dark` squares) at the corners.

### 5.2 Content, top to bottom (this order and these styles)
1. **Chapter label:** `CHAPTER 1 · THE DEVELOPER QUEST`, JetBrains Mono 700 `--fs-xs`, letter-spacing .08em, colour `--gold`.
2. **Status pill:** dark green fill (`#1f3a1f`), 2px `--wood-dark` border, green dot + "Open to opportunities", mono 700 `--fs-xs`, colour `#d8f5d8`, fully rounded (the one rounded element).
3. **Terminal line:** `nithin@world-1:~$ whoami`, mono `--fs-xs`; the prompt part in `--gold`, the command in `--sign-soft`.
4. **Name:** `<h1 class="name">NITHIN</h1>`, Press Start 2P at `--fs-xl`, line-height 1.1, colour `#fff`, `text-shadow: 3px 3px 0 var(--wood-dark)`. It is the page's only `h1`.
5. **Role line:** Inter 700 `--fs-m`, colour `--sign-text`. It types out and cycles through 3 to 4 lines ("SDE intern,", "Builds AI tools and web apps", "Hack101 runner-up"...), followed by a gold blinking block cursor. Typing 55ms per character, hold 2.4s, delete 28ms per character. `min-height: 26px`. Static text under reduced motion.
6. **Summary paragraph (always visible, never animated):** mono `--fs-s`, line-height 1.6, colour `--sign-soft`: "CSE student at Amrita and SDE intern. I build AI-driven and web products, and I like turning ideas into software people actually use."
7. **Chips row:** plaques (`#fff4d6` fill, ink text, 2px `--wood-dark` border, mono 700 `--fs-xs`, padding `2px 9px`), each a real `<a href>`: `CSE @ Amrita` → `#/about`, `SDE Intern` → `#/experience`, `Hack101 · 2nd place` → `#/awards`, `4 projects` → `#/projects`. Hover: lift 2px and fill `--gold`.
8. **Buttons row:** `Resume ↓` (gold fill, link to `assets/resume.pdf`), `View projects` (cream), `Contact` (cream). 3px `--wood-dark` border, hard shadow `3px 3px 0 var(--wood-dark)`, mono 700 `--fs-xs`, padding `7px 14px`; hover lifts 2px.

### 5.3 Contrast rule
White and `--sign-soft` text on the wood must be at least 4.5:1. If the check fails, darken the plank colours (for example `--wood:#7a4f1c`) rather than changing the layout.

### 5.4 The open right half
Left empty on purpose: sun, clouds and sky. Do not add a billboard, stats tablet or signpost here.

**Done when:** the first screen shows name, role, education, internship, award and a Resume button without any interaction, and it matches the reference screenshot.
---
## Phase 6: Blocks, hero, pickups (`js/world.js`)

### 6.1 Blocks
Five blocks, one per section, created from the `[data-icon]` pages in order: about (bulb), projects (term), awards (trophy), experience (gear), resume (doc). Each is a `<button class="block" data-go="about">`:
- Sprite `q` at scale 5 (40x40). Label above: mono 700 `--fs-xs`, white, `text-shadow: 1px 1px 0 var(--ink), 2px 2px 0 var(--ink)`.
- Row: `position:absolute; left:0; right:0; bottom:196px; display:flex; justify-content:center; gap: clamp(8px, 3vw, 40px); padding:0 6px; z-index:3`. `contact` is the flag.
- Hover: sprite rises 4px. Focus: `outline: 3px solid var(--red)`.

### 6.2 Hero
`<img id="hero">`, sprite `hero` at scale 5 (50x60), `position:absolute; bottom:96px; left:6%; width:50px; transition:left .7s linear; z-index:4`. While `.walk` the image bobs 3px every 260ms (`steps(1)`). `.jump` runs a 450ms keyframe up 46px and back (the head must reach the block bottom, 100px above the floor).

### 6.3 Visit sequence

```js
export async function visit(id){
  if (busy) return; busy = true;
  const el = targetFor(id);                               // `.block[data-go="id"]` or `.flag-btn`
  const s = scene.getBoundingClientRect(), r = el.getBoundingClientRect();
  const x = r.left + r.width/2 - s.left - hero.offsetWidth/2;
  const dist = Math.abs(x - hero.offsetLeft);
  hero.classList.add("walk"); hero.style.left = x + "px";
  await sleep(300 + dist*0.7); hero.classList.remove("walk");
  if (el.classList.contains("block")){
    hero.classList.add("jump"); await sleep(230);
    el.classList.add("bump");                              // block hops 14px
    popItem(id, r);                                        // the section's sprite rises 70px and fades over 900ms
    if(!seen.has(id)) el.querySelector("img").src = sprite("used",5);
    await sleep(450); hero.classList.remove("jump"); el.classList.remove("bump");
  }
  location.hash = "#/" + id;                               // router performs the slide (Phase 8)
  await sleep(850); busy = false; focusPrompt();
}
```
Rules: ignore clicks while `busy`; select targets with `.block[data-go="x"]` so the sign buttons are never matched; recompute positions on resize; under reduced motion skip walk and jump and go straight to the route.

### 6.4 Score line
`seen` is a Set of visited section ids. `updateScore()` renders one 16px pickup icon per visited section (those with an icon) followed by `n/6` in the centre of the score line.

**Done when:** each block walks, jumps, pops its own item, turns into a used block, updates the score and opens the right route.
---

## Phase 7: Underground room

### 7.1 Transition
`.under` starts at `translateY(100%)`. `scene.classList.add("down")` sets `.over` to `translateY(-100%)` and `.under` to `translateY(0)` over `--t-slide`. Removing `down` reverses it. Under reduced motion the layers swap instantly.

### 7.2 Look
- Background: full-bleed wall tile `tile("ubrick", 4)`, no vignette.
- Floor: same 96px structure with a blue-brick strip and wall-dark earth, with the second prompt form `#f2`.
- Left on the floor: hero image standing (decor). Right on the floor: a green pipe (46x54, 3px dark-green outline) labelled "surface" (button) that goes back up.
- Decor on the wall: two bobbing item sprites (bulb, gear) at 10% and 88% width.
- **Nav row** at the top: buttons `about projects awards experience resume contact` + `surface`. Paper fill, ink border 3px, hard shadow 3px; current page = gold fill.
- **Paper card** (`.paper`): width `min(100%, 760px)`, padding 24px, border 3px ink, fill `--paper`, shadow `6px 6px 0 var(--ink)`, scrolls inside the room if taller than the space. List rows use alternating `--paper` and `--paper-2` fills (tone steps, no dashed lines).

---

## Phase 8: Router and page rendering (`js/router.js`, `js/room.js`)

### 8.1 Routes

| Hash | Shows |
|---|---|
| `#/` or empty | surface |
| `#/about` `#/projects` `#/awards` `#/experience` `#/resume` `#/contact` `#/help` `#/map` | underground page |
| `#/projects/skillup` (or groupflix, fishglob, neoflash) | project page |
| anything else | `error` page |

### 8.2 Behaviour

```js
export function parse(hash){ const p = hash.replace(/^#\/?/,"").split("/"); return { page:p[0]||"", sub:p[1]||"" }; }
function route(){
  const {page, sub} = parse(location.hash);
  if(!page){ up(); document.title = DEFAULT_TITLE; return; }
  const id = sub || page;
  show(PAGES.has(id) ? id : "error");                        // idempotent: does nothing if already showing
  scene.classList.add("down");
  document.title = `${titleFor(id)} · Nithin`;
}
addEventListener("hashchange", route);
route();                                                      // deep links skip the walk animation
```
- `show(id)`: find `#pages [data-page="id"]`, `cloneNode(true)` its children into `.paper`, add stagger (children fade-up 16px, 70ms steps, once), mark seen (+ update score), set the prompt path to `~/${id}`, append a **"Next ▸"** button to the following page in order (about → projects → awards → experience → resume → contact) except on the last, and update `aria-current` on the nav.
- Project pages call `mountProjectWorld(article)` (Phase 9) after render.
- `up()` removes `down`, focuses the prompt and resets the path.
- `Esc` anywhere underground goes up. The browser Back button works because every move changes the hash.
- The paper card has `aria-live="polite"` and focus moves to its `h2` after each render.

---

## Phase 9: The four project worlds (`css/projects.css`, `js/projects.js`)

Each project page = **world band** (top, `height: clamp(180px, 26vh, 260px)`, full card width, 3px ink border, flat colours) + **screenshot arcade frame** + content.

Shared project layout inside `.paper`:
1. World band.
2. Header: `Level 1-1` (Press Start 2P 12px on an ink plaque), name (`--fs-l`), tagline (Inter 16px, `--muted`), award badge if any (gold plaque).
3. Two columns at 820px and wider (text left, picture right): left = Overview, Highlights, Stack tags, Links; right = arcade frame with the real screenshot (arcade bezel: 12px `--stone-dark` frame, 3px ink border, screen 16:10 with `object-fit: cover`) and a caption.
4. Footer buttons: `◂ previous level`, `all projects`, `next level ▸` (the last project's next = "level complete: contact").

Themes (all flat colours, the hero stands in each):

- **gap (SkillUp):** flat `--sky` colour, brick floor on both sides with a **gap** 25% wide in the middle. Left ledge plaque "You are here", right ledge plaque "Target role". Three floating blocks over the gap labelled with skill names from `data-skills`. A "Cross the gap" button makes the hero walk, jump and land on the right ledge (CSS transform sequence, 1.4s).
- **cinema (GroupFlix):** wall `--cine-wall`; curtains = two flat `--curtain` columns with `--curtain-dark` pleat strips at the left and right; a lighter flat screen rectangle in the centre; a row of `seat` sprites along the bottom.
- **water (FishGlob):** three flat horizontal bands `--water-1/2/3`; a stepped pixel wave line at the top; 3 `fish` sprites swimming across at different speeds (translateX, 8 to 14 s); current arrows: three rows of `>` pixel chevrons moving right (translateX loop, 3s).
- **study (NeoFlash):** background `--study-1`, floor strip `--study-2`, four flashcard sprites floating; the first three are real flip cards (`<button aria-pressed>`) showing a term on the front and a definition on the back (text from the project content), flipping with a 250ms `rotateY` transform.

All band animations are transform-only and removed under reduced motion (elements remain static).

**Done when:** each project page looks like its own place, shows a real screenshot, and still reads as a clean case study.

---

## Phase 10: Terminal prompt (`js/terminal.js`)

Two prompt forms (surface `#f1`, underground `#f2`) share one parser.

```js
const ALIAS = { achievements:"awards", exp:"experience", castle:"contact", cv:"resume" };
export function run(raw){
  let c = raw.trim().toLowerCase()
    .replace(/^(cd|cat|open|ls|goto)\s+/,"").replace(/^projects\//,"").replace(/\/$/,"").replace(/\.(md|pdf)$/,"");
  if(!c) return;
  c = ALIAS[c] || c;
  if(["exit","..","back","up"].includes(c)) return (location.hash = "#/");
  if(c==="clear") return;
  if(c==="whoami") return toast("nithin: software engineer in the making");
  if(c==="hire")   { toast("permission granted. opening contact"); return go("contact"); }
  if(c==="resume") return window.open("assets/resume.pdf");
  if(PAGES.has(c)) return underground ? (location.hash = pathFor(c)) : visit(c);
  location.hash = "#/not-found";                               // error page; echo the unknown word inside it
}
```
- Commands: `help`, `about`, `projects`, `awards`, `experience`, `resume`, `contact`, `skillup` / `groupflix` / `fishglob` / `neoflash` (or `open <name>`), `whoami`, `hire`, `map`, `exit`, `clear`.
- `help` and `map` are HTML sections; `map` shows an ASCII route in a `<pre aria-hidden="true">`: `[1-1 SkillUp]--[1-2 GroupFlix]--[1-3 FishGlob]--[2-1 NeoFlash]--[flag]`.
- Features: ArrowUp/Down history (kept in memory), Tab completion over command names, path in the prompt reflects the route (`nithin@world-1:~/projects/skillup$`), typing any printable key anywhere focuses the active prompt, `/` focuses the prompt.
- The prompt input has `aria-label="Command prompt"`; submit is a real `<form>`; the placeholder is a hint, not the label.
- Toast: a `role="status"` plaque above the floor (paper fill, ink text, 3px border, hard shadow), visible 3.2s.

---
## Phase 11: Navigation (no top bar)

Navigation lives in the world and is always plain:

- **Sign:** the four chips and three buttons are real `<a>` links (Phase 5).
- **Blocks and flag:** one block per section plus the flag for contact (Phase 6).
- **Prompt:** type any section or project name (Phase 10).
- **Underground:** the nav row plus the pipe (Phase 7).
- **Screen readers and search engines:** add a visually hidden `<nav aria-label="Primary" class="sr-only">` with plain links to `#/about`, `#/projects`, `#/awards`, `#/experience`, `#/resume`, `#/contact`. It does not change the look.
- All of these are `<a href="#/...">` or `<button data-go>` handled by one delegated click listener.
---
## Phase 12: Responsive and the phone composition

| Width | Behaviour |
|---|---|
| 1100px and wider | full desktop composition (reference layout) |
| 721 to 1099px | sign width `calc(100% - 28px)`, castle hidden, scene `height:auto; min-height:100svh` |
| 720px and narrower | **separate phone composition** (below) |

**Phone composition** is its own layout, not a shrunken desktop:
1. The sign is full width (chains kept short), name at about 32px, chips wrap, buttons wrap.
2. The hint sits under the sign.
3. Blocks as a 3 x 2 grid (five blocks plus the flag as a block-sized "contact" button), labels visible, touch targets of 48px or more.
4. Hero walk is skipped: tapping a block triggers the bump, the item pop and the route immediately.
5. Floor is `position: sticky; bottom: 0` with the prompt (font-size 16px to stop iOS zoom).
6. Sun and clouds stay as a small decoration at the top right.
7. Underground: card full width, nav row scrolls horizontally, pipe hidden (nav has "surface").
8. Project pages: single column, world band shorter (140px), screenshot below the band.

Check at 360, 390, 768, 1024, 1440 and 1920 px wide. No horizontal scroll at any width.
---

## Phase 13: Accessibility and reduced motion

- Every interactive object is a real `<a>` or `<button>` with visible focus; tab order follows reading order (sign chips and buttons, blocks, flag, prompt).
- The hero image has alt text; decorative sprites have `alt=""`; ASCII has `aria-hidden="true"` and a text alternative next to it.
- Contrast: body at least 4.5:1; large text at least 3:1; no text smaller than 12px; labels on sky always sit on a paper or ink plaque.
- `aria-live="polite"` on the paper card; focus moves to its heading after navigation; Esc exits.
- `@media (prefers-reduced-motion: reduce)`: stop cloud drift, typing, hero walk and jump, slide (instant swap), bobbing, fish, current and hint blink; keep all content and state changes.
- `lang="en"`; one `h1`; headings in order; links have clear names (no "click here").

---

## Phase 14: Polish

- Favicon (SVG from the hero map), `og.png` (screenshot of the first screen at 1200x630), `theme-color` meta.
- Print stylesheet: hide the world; print `#pages` as a clean one-page profile.
- Optional sound toggle (off by default, remembered): short WebAudio blips for bump and pickup. Never autoplay.
- Small tasteful easter eggs: Konami code, and the `hire` command.
- "All sections visited": the score plaque turns gold and the flag animates up (transform only).
- Contact page close: a "THE END" heading in Press Start 2P (`--fs-xl`) under the castle, as the designed ending.
- Preload the two key fonts; `font-display: swap`; keep total JS under 40 KB unminified, no dependencies.

---

## Phase 15: Quality gate

1. If the `design-taste-frontend` skill's scripts are available: run `lint.mjs` on the source and `inspect.mjs` on `index.html` (viewports 1440, 768, 390). Fix every FAIL; fix or defend every WARN. Intentional exceptions to document: the mono terminal voice, level numbers (1-1), thick outlines, hard solid shadows.
2. Screenshots at 1440, 768 and 390 of: surface, each underground page, each project page. Look at every one.
3. Manual checklist:
   - [ ] No JS: all content and links readable.
   - [ ] Every hash route loads directly and Back and Forward work.
   - [ ] Blocks, chips, buttons, flag and prompt each open the right page.
   - [ ] Keyboard-only run-through works; focus is always visible.
   - [ ] Reduced-motion mode works.
   - [ ] No horizontal scroll at any width; touch targets at least 44px on phone.
   - [ ] No emoji, no gradients, no blurred or translucent shadows (search the CSS).
   - [ ] Three typefaces in their fixed roles; only the five sizes appear.
   - [ ] Home screen matches the approved reference (sign, open sky, block row, hills, castle, floor prompt).
   - [ ] Lighthouse: Performance 90+, Accessibility 95+, SEO 90+.
   - [ ] Safari, Chrome, Firefox, iOS Safari, Android Chrome.
   - [ ] Resume downloads; email, GitHub and LinkedIn are correct.
   - [ ] All `TODO` content replaced (or listed in the report).
4. **HR test:** ask someone unfamiliar to find the internship and the resume. Target: under 15 seconds.

---

## Phase 16: Deploy

1. Create a GitHub repo and push.
2. Host on GitHub Pages, Netlify or Vercel (static, free).
3. Optional custom domain.
4. Add the live link to the resume, LinkedIn and GitHub profile.
5. Optional light analytics (Plausible or Umami).

---

## Build order summary (for the implementing AI)

1. Phases 0 and 1: facts, screenshots, full semantic HTML (works without JS).
2. Phases 2 and 3: base CSS, tokens, sprite engine, favicon.
3. Phases 4 and 5: world scene and the hanging sign (the first screen must match the reference and already satisfy the HR test).
4. Phases 6 and 7: blocks, hero, pickups, underground layer.
5. Phase 8: router and page rendering.
6. Phase 9: four project worlds.
7. Phases 10 and 11: terminal and navigation.
8. Phases 12 and 13: phone composition, accessibility, reduced motion.
9. Phases 14 to 16: polish, gate, deploy.

After each phase run the page, check its acceptance line, and fix before moving on.

## Common pitfalls

- Do not add a top bar, billboard, signpost, stats tablet or oversized name to the home screen; the approved layout is the reference.
- Never name a JavaScript variable `in` (reserved word), including element ids used as globals.
- The `hidden` attribute loses to any CSS that sets `display`; use a class when a style sets `display`.
- Find blocks with `.block[data-go="x"]`, not the first `[data-go="x"]`, or sign buttons get picked.
- Build sprite data-URLs before the first paint of tiled backgrounds (in `main.js`, before showing the scene).
- Keep the router idempotent (calling `route()` for the page already shown must do nothing), or animations and hashchange will loop.
- Compute hero positions from `getBoundingClientRect()` relative to the scene and recompute on resize.
- One source of truth: content lives in the HTML `#pages` sections. Do not duplicate text in JS.
- Do not add ornament to fill space. Fill it with scale, real content, real screenshots or flat colour.
