import { sprite, tile } from "./sprites.js?v=21";
import { PROFILE, loadProfile } from "./portfolio-data.js?v=21";
import { playBump, playPickup, playVictory, play1Up, playWarp, toggleSound, updateSoundButton } from "./audio.js?v=21";
// openWindow is imported lazily to avoid circular dep (windows.js imports world.js)
let _openWindow = null;
async function getOpenWindow() {
  if (!_openWindow) {
    const mod = await import("./windows.js?v=21");
    _openWindow = mod.openWindow;
  }
  return _openWindow;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SECTION_ICONS = {
  about: "bulb",
  projects: "term",
  awards: "trophy",
  experience: "gear",
  resume: "doc"
};

export const seen = new Set();
let busy = false;

let sceneEl = null;
let heroEl = null;
let blocksEl = null;
let scoreCenterEl = null;
let roleTextEl = null;

export function initWorld() {
  sceneEl = document.getElementById("world");
  heroEl = document.getElementById("hero");
  blocksEl = document.getElementById("blocks");
  scoreCenterEl = document.getElementById("hc");

  if (!sceneEl || !heroEl || !blocksEl) return;

  // Initialize sound toggle
  updateSoundButton();
  const soundBtn = document.getElementById("soundToggle");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      toggleSound();
    });
  }

  // Set up background tiles
  const floorStrip = sceneEl.querySelector(".floor .strip");
  const floorEarth = sceneEl.querySelector(".floor .earth");
  if (floorStrip) floorStrip.style.backgroundImage = tile("brick", 3);
  if (floorEarth) floorEarth.style.backgroundImage = tile("brick", 3); // Fix #2: brick color all the way to bottom

  // Set up sign plank background and chains
  const signEl = document.getElementById("sign");
  if (signEl) {
    signEl.style.backgroundImage = tile("plank", 3);
    const chainLeft = signEl.querySelector(".chain-left");
    const chainRight = signEl.querySelector(".chain-right");
    if (chainLeft) chainLeft.style.backgroundImage = tile("chain", 2);
    if (chainRight) chainRight.style.backgroundImage = tile("chain", 2);
  }

  // Set up authentic NES pixel bushes (matching reference image)
  const sceneryBush1 = document.getElementById("sceneryBush1");
  if (sceneryBush1) sceneryBush1.src = sprite("bush", 3);
  const sceneryBush2 = document.getElementById("sceneryBush2");
  if (sceneryBush2) sceneryBush2.src = sprite("bush", 3);

  // Set up evenly spaced authentic NES clouds
  buildClouds();

  // Set up sprites
  heroEl.src = sprite("hero", 5);

  const castleImg = document.getElementById("castleImg");
  if (castleImg) castleImg.src = sprite("castle", 7);

  const flagSprite = sceneEl.querySelector(".flag-sprite");
  if (flagSprite) flagSprite.src = sprite("flag", 5);

  // Build 5 question blocks in order
  buildBlocks();

  // Populate wooden sign content dynamically from profile data
  updateSignContent();
  loadProfile().then(() => {
    updateSignContent();
  });

  // Set up role typing animation
  roleTextEl = document.getElementById("roleText");
  startTypewriter();

  // Wire block & flag clicks
  sceneEl.addEventListener("click", (e) => {
    const targetBlock = e.target.closest(".block");
    if (targetBlock) {
      const go = targetBlock.dataset.go;
      if (go) visit(go);
      return;
    }

    const flagBtn = e.target.closest(".flag-btn");
    if (flagBtn) {
      visit("contact");
      return;
    }
  });

  // Wire interactive Mario tap/click
  heroEl.addEventListener("click", () => {
    playBump();
    triggerHeroCheer();
  });

  updateScore();

  // Start continuous Mario in-place actions & poses
  startHeroIdleCycle();
}

export function updateSignContent() {
  const statusEl = document.querySelector("#sign .status-pill span:last-child");
  if (statusEl && PROFILE.status) statusEl.textContent = PROFILE.status;

  const nameEl = document.querySelector("#sign .name");
  if (nameEl && PROFILE.name) nameEl.textContent = PROFILE.name;

  const summaryEl = document.querySelector("#sign .summary");
  if (summaryEl && PROFILE.summary) summaryEl.textContent = PROFILE.summary;

  const techEl = document.querySelector("#sign .tech-stack-row");
  if (techEl && Array.isArray(PROFILE.techStack)) {
    techEl.innerHTML = PROFILE.techStack.map(t => `<span class="tech-badge">${t}</span>`).join("\n");
  }

  const chipsEl = document.querySelector("#sign .chips-row");
  if (chipsEl && Array.isArray(PROFILE.chips)) {
    chipsEl.innerHTML = PROFILE.chips.map(c => `<a class="chip" href="${c.href}">${c.label}</a>`).join("\n");
  }

  const btnsEl = document.querySelector("#sign .buttons-row");
  if (btnsEl && Array.isArray(PROFILE.buttons)) {
    btnsEl.innerHTML = PROFILE.buttons.map(b => 
      `<a class="btn-sign${b.primary ? ' pri' : ''}" href="${b.href}"${b.download ? ' download' : ''}>${b.label}</a>`
    ).join("\n");
  }
}

function buildBlocks() {
  blocksEl.innerHTML = "";
  const sections = ["about", "projects", "awards", "experience", "resume"];

  sections.forEach((id) => {
    const btn = document.createElement("button");
    btn.className = "block";
    btn.dataset.go = id;
    btn.setAttribute("aria-label", `Section ${id}`);

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = id;

    const img = document.createElement("img");
    img.src = seen.has(id) ? sprite("used", 5) : sprite("q", 5);
    img.alt = `Block ${id}`;

    btn.appendChild(label);
    btn.appendChild(img);
    blocksEl.appendChild(btn);
  });
}

function buildClouds() {
  const container = document.getElementById("cloudsContainer");
  if (!container) return;
  container.innerHTML = "";

  // 4 evenly spaced clouds with varied heights across the sky
  // Phased by exactly 30s in a 120s drift loop (25% intervals),
  // guaranteeing they NEVER bunch up and remain evenly spaced across the entire screen!
  // Includes clouds positioned lower in the sky as requested.
  const configs = [
    { type: "cloud", top: 48, scale: 3, delay: 0 },
    { type: "cloud1", top: 175, scale: 3, delay: -30 },
    { type: "cloud", top: 80, scale: 2.8, delay: -60 },
    { type: "cloud1", top: 255, scale: 3, delay: -90 } // Lower sky cloud
  ];

  configs.forEach((c) => {
    const img = document.createElement("img");
    img.className = "cloud-sprite";
    img.src = sprite(c.type, c.scale);
    img.alt = "";
    img.style.top = `${c.top}px`;
    img.style.left = "0px";
    img.style.animationDelay = `${c.delay}s`;
    container.appendChild(img);
  });
}

export function targetFor(id) {
  if (id === "contact") return sceneEl.querySelector(".flag-btn");
  return sceneEl.querySelector(`.block[data-go="${id}"]`);
}

export async function visit(id) {
  if (busy) return;
  busy = true;

  const el = targetFor(id);
  if (!el || !heroEl || !sceneEl) {
    const ow = await getOpenWindow();
    ow(id);
    busy = false;
    return;
  }

  // Check reduced motion preference or phone screen (Phase 12: Hero walk skipped on phone)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isPhone = window.innerWidth <= 720;

  if (prefersReduced || isPhone) {
    if (el.classList.contains("block")) {
      playBump();
      el.classList.add("bump");
      popItem(id, el.getBoundingClientRect());
      markSeen(id, el);
      // On mobile, Mario stays standing in the left, but cheers in place on block hit
      if (!prefersReduced && heroEl) {
        heroEl.className = "hero pose-jump";
        heroEl.src = sprite("hero_jump", 5);
        setTimeout(() => {
          heroEl.className = "hero idle-breath";
          heroEl.src = sprite("hero", 5);
        }, 500);
      }
      setTimeout(() => el.classList.remove("bump"), 250);
    } else {
      markSeen(id, el);
    }
    await sleep(prefersReduced ? 50 : 350);
    const ow = await getOpenWindow();
    ow(id, el.getBoundingClientRect());
    busy = false;
    return;
  }

  // Desktop: Mario walks to block but idle cycle keeps running (world stays visible)
  const s = sceneEl.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const targetX = r.left + r.width / 2 - s.left - heroEl.offsetWidth / 2;
  const currentX = heroEl.offsetLeft;
  const dist = Math.abs(targetX - currentX);

  // Walk
  heroEl.classList.add("walk");
  heroEl.style.left = `${targetX}px`;
  await sleep(300 + dist * 0.7);
  heroEl.classList.remove("walk");

  // Jump and bump if it's a question block
  if (el.classList.contains("block")) {
    heroEl.classList.add("jump");
    await sleep(230);

    playBump();
    el.classList.add("bump");
    popItem(id, r);
    markSeen(id, el);

    await sleep(450);
    heroEl.classList.remove("jump");
    el.classList.remove("bump");
  } else if (id === "contact") {
    markSeen(id, el);
  }

  const ow = await getOpenWindow();
  ow(id, el.getBoundingClientRect());
  await sleep(400);
  busy = false;
}

export function syncBlockSprites() {
  if (!blocksEl) return;
  const blocks = blocksEl.querySelectorAll(".block");
  blocks.forEach((b) => {
    const id = b.dataset.go;
    const img = b.querySelector("img");
    if (img && seen.has(id)) {
      img.src = sprite("used", 5);
    }
  });
}

function markSeen(id, el) {
  seen.add(id);
  if (el && el.classList.contains("block")) {
    const img = el.querySelector("img");
    if (img) img.src = sprite("used", 5);
  }
  syncBlockSprites();
  updateScore();
}

function popItem(id, rect) {
  const iconName = SECTION_ICONS[id];
  if (!iconName) return;

  playPickup();

  const s = sceneEl.getBoundingClientRect();
  const item = document.createElement("div");
  item.className = "pickup-item";
  item.style.left = `${rect.left + rect.width / 2 - s.left - 20}px`;
  item.style.top = `${rect.top - s.top}px`;

  const img = document.createElement("img");
  img.src = sprite(iconName, 5);
  img.alt = "";

  const scoreLabel = document.createElement("span");
  scoreLabel.className = "score-popup";
  scoreLabel.textContent = "+100";

  item.appendChild(img);
  item.appendChild(scoreLabel);
  sceneEl.appendChild(item);

  setTimeout(() => {
    if (item.parentNode) item.parentNode.removeChild(item);
  }, 950);
}

export function updateScore() {
  // Count items collected: 5 blocks + contact flag = 6 total
  let count = 0;
  const iconOrder = ["about", "projects", "awards", "experience", "resume"];
  let iconsHtml = "";

  iconOrder.forEach((id) => {
    if (seen.has(id)) {
      count++;
      const icon = SECTION_ICONS[id];
      iconsHtml += `<img src="${sprite(icon, 2)}" alt="${id}">`;
    }
  });

  if (seen.has("contact")) {
    count++;
  }

  // Update old score HUD if present
  if (scoreCenterEl) {
    const isAllClear = count === 6;
    scoreCenterEl.innerHTML = `
      <div class="score-center ${isAllClear ? "gold-score" : ""}">
        <span class="collected-icons">${iconsHtml}</span>
        <span>${count}/6</span>
      </div>
    `;
  }

  // Update taskbar tray score
  const trayScore = document.getElementById("trayScore");
  if (trayScore) trayScore.textContent = `${count}/6`;

  if (count === 6) {
    const flagBtn = sceneEl ? sceneEl.querySelector(".flag-btn") : null;
    if (flagBtn) {
      flagBtn.classList.add("flag-raised");
    }
  }
}

// Konami Code Easter Egg (Phase 14)
const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiPos = 0;

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  const key = e.key;
  if (key === KONAMI_CODE[konamiPos] || key.toLowerCase() === KONAMI_CODE[konamiPos]) {
    konamiPos++;
    if (konamiPos === KONAMI_CODE.length) {
      konamiPos = 0;
      playVictory();
      const sc = document.querySelector(".score-center");
      if (sc) sc.classList.add("gold-score");
    }
  } else {
    konamiPos = 0;
  }
});

// Typewriter for the role line in the hanging sign
let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTypewriter() {
  if (!roleTextEl) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    const roles = (PROFILE.roles && PROFILE.roles.length) ? PROFILE.roles : ["SDE intern,"];
    roleTextEl.textContent = roles[0];
    return;
  }

  function typeStep() {
    const roles = (PROFILE.roles && PROFILE.roles.length) ? PROFILE.roles : ["SDE intern,"];
    if (typeIndex >= roles.length) typeIndex = 0;
    const currentLine = roles[typeIndex];

    if (isDeleting) {
      charIndex--;
      roleTextEl.textContent = currentLine.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % roles.length;
        setTimeout(typeStep, 400);
        return;
      }
      setTimeout(typeStep, 28);
    } else {
      charIndex++;
      roleTextEl.textContent = currentLine.substring(0, charIndex);
      if (charIndex === currentLine.length) {
        isDeleting = true;
        setTimeout(typeStep, 2400); // hold for 2.4s
        return;
      }
      setTimeout(typeStep, 55); // 55ms per char
    }
  }

  typeStep();
}

// =============================================================================
// MARIO CONTINUOUS IN-PLACE ACTIONS & POSES
// Keeps Mario standing on the left in the same place while performing a dynamic,
// retro sequence of classic poses: idle breathing, cursor blink, curious lookup,
// waiting foot tap, classic vertical fist-pump jump, happy cheer, and friendly wave.
// =============================================================================

export let idleLoopActive = false;
let idleLoopCycle = 0;

export function startHeroIdleCycle() {
  if (idleLoopActive) return;
  idleLoopActive = true;
  const cycleId = ++idleLoopCycle;
  runHeroIdlePoses(cycleId);
}

export function stopHeroIdleCycle() {
  idleLoopActive = false;
  idleLoopCycle++;
  if (heroEl) {
    heroEl.className = "hero";
    heroEl.src = sprite("hero", 5);
  }
}

export async function triggerHeroCheer() {
  if (!heroEl) return;
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReduced) return;

  const currentCycle = idleLoopCycle;
  heroEl.className = "hero pose-jump";
  heroEl.src = sprite("hero_jump", 5);
  await sleep(650);

  if (currentCycle === idleLoopCycle) {
    heroEl.className = "hero pose-cheer";
    heroEl.src = sprite("hero_cheer", 5);
    await sleep(750);
    heroEl.className = "hero idle-breath";
    heroEl.src = sprite("hero", 5);
  }
}

async function runHeroIdlePoses(cycleId) {
  if (!heroEl) return;
  const isCurrent = () => idleLoopActive && cycleId === idleLoopCycle;

  // Initial gentle delay after surface load
  await sleep(700);

  while (isCurrent()) {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) {
      heroEl.className = "hero";
      heroEl.src = sprite("hero", 5);
      await sleep(1000);
      continue;
    }

    // 1. Idle breathing with terminal prompt cursor blinking
    heroEl.className = "hero idle-breath";
    heroEl.src = sprite("hero", 5);
    await sleep(1500);
    if (!isCurrent()) break;

    // Terminal cursor blink
    heroEl.src = sprite("hero_blink", 5);
    await sleep(350);
    if (!isCurrent()) break;
    heroEl.src = sprite("hero", 5);
    await sleep(1200);
    if (!isCurrent()) break;

    // 2. Curious: look up at the floating question blocks and sky!
    heroEl.className = "hero pose-lookup";
    heroEl.src = sprite("hero_lookup", 5);
    await sleep(1500);
    if (!isCurrent()) break;

    // 3. Fidget: impatient waiting foot tap in place
    heroEl.className = "hero pose-tap";
    heroEl.src = sprite("hero_tap", 5);
    await sleep(900);
    if (!isCurrent()) break;

    // 4. Classic Mario vertical fist-pump jump in place!
    heroEl.className = "hero pose-jump";
    heroEl.src = sprite("hero_jump", 5);
    await sleep(700);
    if (!isCurrent()) break;

    // 5. Joyful double-hop cheer with happy face
    heroEl.className = "hero pose-cheer";
    heroEl.src = sprite("hero_cheer", 5);
    await sleep(850);
    if (!isCurrent()) break;

    // 6. Friendly wave to the viewer
    heroEl.className = "hero pose-wave";
    heroEl.src = sprite("hero_wave", 5);
    await sleep(1200);
    if (!isCurrent()) break;

    // 7. Happy blink
    heroEl.src = sprite("hero_happy", 5);
    await sleep(650);
    if (!isCurrent()) break;

    // Return to default idle breathing
    heroEl.className = "hero idle-breath";
    heroEl.src = sprite("hero", 5);
    await sleep(1600);
  }
}
