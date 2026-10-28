// World Controller: surface interaction, hero, blocks, score, sounds, typewriter

import { sprite, tile } from "./sprites.js";
import { PROFILE } from "./portfolio-data.js";
import { playBump, playPickup, playVictory, toggleSound, updateSoundButton } from "./audio.js";
import { toast } from "./terminal.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SECTION_ICONS = {
  about: "bulb",
  projects: "term",
  awards: "trophy",
  experience: "gear",
  resume: "doc"
};

const ROLE_LINES = PROFILE.roles;

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
  if (floorEarth) floorEarth.style.backgroundImage = tile("earth", 3);

  // Set up sign plank background and chains
  const signEl = document.getElementById("sign");
  if (signEl) {
    signEl.style.backgroundImage = tile("plank", 3);
    const chainLeft = signEl.querySelector(".chain-left");
    const chainRight = signEl.querySelector(".chain-right");
    if (chainLeft) chainLeft.style.backgroundImage = tile("chain", 2);
    if (chainRight) chainRight.style.backgroundImage = tile("chain", 2);
  }

  // Set up sprites
  heroEl.src = sprite("hero", 5);

  const castleImg = document.getElementById("castleImg");
  if (castleImg) castleImg.src = sprite("castle", 6);

  const flagSprite = sceneEl.querySelector(".flag-sprite");
  if (flagSprite) flagSprite.src = sprite("flag", 4);

  // Build 5 question blocks in order
  buildBlocks();

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

  updateScore();
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

export function targetFor(id) {
  if (id === "contact") return sceneEl.querySelector(".flag-btn");
  return sceneEl.querySelector(`.block[data-go="${id}"]`);
}

export async function visit(id) {
  if (busy) return;
  busy = true;

  const el = targetFor(id);
  if (!el || !heroEl || !sceneEl) {
    location.hash = "#/" + id;
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
      setTimeout(() => el.classList.remove("bump"), 250);
    } else {
      markSeen(id, el);
    }
    await sleep(prefersReduced ? 50 : 250);
    location.hash = "#/" + id;
    busy = false;
    focusPrompt();
    return;
  }

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

  location.hash = "#/" + id;
  await sleep(850);
  busy = false;
  focusPrompt();
}

function markSeen(id, el) {
  if (!seen.has(id)) {
    seen.add(id);
    if (el && el.classList.contains("block")) {
      const img = el.querySelector("img");
      if (img) img.src = sprite("used", 5);
    }
    updateScore();
  }
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

  item.appendChild(img);
  sceneEl.appendChild(item);

  setTimeout(() => {
    if (item.parentNode) item.parentNode.removeChild(item);
  }, 950);
}

export function updateScore() {
  if (!scoreCenterEl) return;

  // Count items collected
  let iconsHtml = "";
  const iconOrder = ["about", "projects", "awards", "experience", "resume"];
  let count = 0;

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

  const isAllClear = count === 6;

  scoreCenterEl.innerHTML = `
    <div class="score-center ${isAllClear ? "gold-score" : ""}">
      <span class="collected-icons">${iconsHtml}</span>
      <span>${count}/6</span>
    </div>
  `;

  if (isAllClear) {
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
      toast("★ 30 LIVES GRANTED! UNLIMITED DEVELOPER POWER ACTIVATED ★");
      playVictory();
      const sc = document.querySelector(".score-center");
      if (sc) sc.classList.add("gold-score");
    }
  } else {
    konamiPos = 0;
  }
});

function focusPrompt() {
  const inp = document.querySelector("#f1 input");
  if (inp && document.activeElement !== inp) {
    inp.focus();
  }
}

// Typewriter for the role line in the hanging sign
let typeIndex = 0;
let charIndex = 0;
let isDeleting = false;

function startTypewriter() {
  if (!roleTextEl) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    roleTextEl.textContent = ROLE_LINES[0];
    return;
  }

  function typeStep() {
    const currentLine = ROLE_LINES[typeIndex];

    if (isDeleting) {
      charIndex--;
      roleTextEl.textContent = currentLine.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        typeIndex = (typeIndex + 1) % ROLE_LINES.length;
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
