// Room Controller: underground blue brick room, paper card, and floor Mario teleport patrol

import { sprite, tile } from "./sprites.js?v=8";
import { seen, updateScore, syncBlockSprites } from "./world.js?v=8";
import { mountProjectWorld } from "./projects.js?v=8";
import { playBump, playPickup } from "./audio.js?v=8";

const PROJECT_IDS = new Set(["dayta", "archivist", "gocdc", "skillup"]);

let underEl = null;
let scrollBodyEl = null;
let paperEl = null;
let navRowEl = null;
let currentShowing = "";

let patrolActive = false;
let patrolCycle = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function initRoom() {
  underEl = document.getElementById("under");
  if (!underEl) return;

  // Background blue brick tile
  underEl.style.backgroundImage = tile("ubrick", 4);

  underEl.innerHTML = `
    <!-- Scrollable content area: contains nav, coins, and paper card (Fix #2: separate from floor) -->
    <div class="under-scroll-body" id="underScrollBody">
      <!-- Top Nav Row -->
      <nav class="under-nav" id="underNav" aria-label="Underground navigation"></nav>

      <!-- Wall Coins -->
      <img class="under-decor coin-left" src="${sprite("coin", 4)}" alt="" aria-hidden="true">
      <img class="under-decor coin-right" src="${sprite("coin", 4)}" alt="" aria-hidden="true">

      <!-- Paper Card Container -->
      <div class="paper" id="paperCard" role="region" aria-live="polite" tabindex="-1"></div>
      <div class="under-scroll-spacer" aria-hidden="true"></div>
    </div>

    <!-- Underground Floor: permanently anchored to viewport bottom -->
    <div class="under-floor" id="underFloor">
      <div class="strip" style="background-image: ${tile("ubrick", 3)}"></div>
      <div class="earth" style="background-image: ${tile("ubrick", 4)}">
        <!-- Left Pipe -->
        <div class="floor-pipe pipe-left" id="floorPipeLeft">
          <img src="${sprite("pipe", 4)}" alt="" aria-hidden="true">
        </div>

        <!-- Right Pipe with Surface Button -->
        <button class="pipe-btn pipe-right" id="pipeBtn" aria-label="Return to surface">
          <span class="label">surface ↑</span>
          <img src="${sprite("pipe", 4)}" alt="" aria-hidden="true">
        </button>

        <!-- Question Block near Right Pipe -->
        <div class="floor-qblock" id="floorQBlock" aria-hidden="true">
          <img id="floorQBlockImg" src="${sprite("q", 4)}" alt="">
        </div>

        <!-- Reward Coin popping out of Question Block -->
        <div class="floor-reward" id="floorReward" aria-hidden="true">
          <img src="${sprite("coin", 4)}" alt="">
        </div>

        <!-- Mario Teleporting Actor -->
        <div class="floor-mario" id="floorMario" aria-hidden="true">
          <img id="floorMarioImg" src="${sprite("hero", 4)}" alt="">
        </div>
      </div>
    </div>`;

  scrollBodyEl = document.getElementById("underScrollBody");
  paperEl = document.getElementById("paperCard");
  navRowEl = document.getElementById("underNav");

  buildNav();

  // Wire Warp Pipe to return to surface
  const pipeBtn = document.getElementById("pipeBtn");
  if (pipeBtn) {
    pipeBtn.addEventListener("click", () => {
      location.hash = "#/";
    });
  }

  // Esc key anywhere underground exits to surface
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const sceneEl = document.getElementById("world");
      if (sceneEl && sceneEl.classList.contains("down")) {
        location.hash = "#/";
      }
    }
  });
}

function buildNav() {
  if (!navRowEl) return;
  const items = [
    { id: "about", label: "about" },
    { id: "projects", label: "projects" },
    { id: "awards", label: "awards" },
    { id: "experience", label: "experience" },
    { id: "resume", label: "resume" },
    { id: "contact", label: "contact" },
    { id: "surface", label: "↑ surface", action: "up" }
  ];

  navRowEl.innerHTML = "";
  items.forEach((item) => {
    const btn = document.createElement("a");
    btn.className = "nav-btn";
    btn.dataset.id = item.id;
    btn.textContent = item.label;

    if (item.action === "up") {
      btn.href = "#/";
    } else {
      btn.href = `#/${item.id}`;
    }

    navRowEl.appendChild(btn);
  });
}

export function show(id) {
  if (!paperEl) initRoom();
  if (currentShowing === id) return;
  currentShowing = id;

  // Find template element in #pages
  let template = document.querySelector(`#pages [data-page="${id}"]`);
  if (!template) {
    template = document.querySelector(`#pages [data-page="error"]`);
  }

  // Clear paper card and clone template children
  paperEl.innerHTML = "";
  if (template) {
    Array.from(template.children).forEach((child) => {
      paperEl.appendChild(child.cloneNode(true));
    });
  }

  // Mount themed interactive mini-world band for project pages
  if (PROJECT_IDS.has(id)) {
    mountProjectWorld(id, paperEl);
  }

  // Mark as seen and update score line
  if (!seen.has(id)) {
    seen.add(id);
    updateScore();
  }

  // Update nav row highlighting
  updateNavState(id);

  // Scroll underground view to top inside independent scroll body
  if (scrollBodyEl) {
    scrollBodyEl.scrollTop = 0;
  } else if (underEl) {
    underEl.scrollTop = 0;
  }

  // Start Mario Floor Patrol loop
  startFloorMarioPatrol();

  // Move focus to first heading for accessibility
  const h2 = paperEl.querySelector("h2");
  if (h2) {
    h2.setAttribute("tabindex", "-1");
    h2.focus();
  } else {
    paperEl.focus();
  }
}

function updateNavState(id) {
  if (!navRowEl) return;
  const navBtns = navRowEl.querySelectorAll(".nav-btn");
  navBtns.forEach((btn) => {
    // If inside a project subpage, highlight 'projects' in nav
    const isProj = PROJECT_IDS.has(id) && btn.dataset.id === "projects";
    if (btn.dataset.id === id || isProj) {
      btn.classList.add("active");
      btn.setAttribute("aria-current", "page");
    } else {
      btn.classList.remove("active");
      btn.removeAttribute("aria-current");
    }
  });
}

export function up() {
  currentShowing = "";
  stopFloorMarioPatrol();
  const sceneEl = document.getElementById("world");
  if (sceneEl) {
    sceneEl.classList.remove("down");
  }
  syncBlockSprites();
}

export function stopFloorMarioPatrol() {
  patrolActive = false;
  patrolCycle++;
}

export function startFloorMarioPatrol() {
  if (patrolActive) return;
  patrolActive = true;
  const currentCycle = ++patrolCycle;
  runFloorMarioPatrol(currentCycle);
}

async function runFloorMarioPatrol(cycleId) {
  const marioEl = document.getElementById("floorMario");
  const marioImg = document.getElementById("floorMarioImg");
  const qBlockEl = document.getElementById("floorQBlock");
  const qBlockImg = document.getElementById("floorQBlockImg");
  const rewardEl = document.getElementById("floorReward");

  if (!marioEl || !marioImg || !qBlockEl || !qBlockImg || !rewardEl) return;

  const isCurrent = () => patrolActive && cycleId === patrolCycle;

  // Reduced motion check
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    marioEl.style.left = "20px";
    marioEl.style.right = "auto";
    marioEl.style.setProperty("--face", "1");
    marioEl.style.setProperty("--pipe-sink", "0px");
    marioEl.style.opacity = "1";
    return;
  }

  while (isCurrent()) {
    // 0. Ensure Question Block is restored to '?'
    qBlockImg.src = sprite("q", 4);
    qBlockEl.classList.remove("bump");
    rewardEl.classList.remove("pop");

    // 1. Initial state: Mario standing to the left of the left pipe
    marioEl.className = "floor-mario";
    marioEl.style.left = "20px";
    marioEl.style.right = "auto";
    marioEl.style.setProperty("--face", "1");
    marioEl.style.setProperty("--pipe-sink", "0px");
    marioEl.style.opacity = "1";

    // Stand still to the left of left pipe for 1.4s
    await sleep(1400);
    if (!isCurrent()) break;

    // 2. Mario walks onto the left pipe (left: 84px)
    marioEl.className = "floor-mario moving-pos walking";
    marioEl.style.left = "84px";
    await sleep(750);
    if (!isCurrent()) break;

    marioEl.classList.remove("walking");

    // 3. Mario slides down into the left pipe
    marioEl.className = "floor-mario pipe-trans";
    marioEl.style.setProperty("--pipe-sink", "48px");
    await sleep(520);
    if (!isCurrent()) break;

    marioEl.style.opacity = "0";

    // 4. Teleporting through pipes to right pipe (vanished)
    await sleep(1600);
    if (!isCurrent()) break;

    // 5. Position inside right pipe, prepare to emerge facing left
    marioEl.className = "floor-mario";
    marioEl.style.left = "auto";
    marioEl.style.right = "52px";
    marioEl.style.setProperty("--face", "-1");
    marioEl.style.setProperty("--pipe-sink", "48px");
    marioEl.style.opacity = "1";
    void marioEl.offsetHeight; // Force reflow

    // Emerge UP out of right pipe
    marioEl.className = "floor-mario pipe-trans";
    marioEl.style.setProperty("--pipe-sink", "0px");
    await sleep(520);
    if (!isCurrent()) break;

    // 6. Mario walks left from right pipe (right: 52px) to under Question Block (right: 140px)
    marioEl.className = "floor-mario moving-pos walking";
    marioEl.style.right = "140px";
    await sleep(850);
    if (!isCurrent()) break;

    marioEl.classList.remove("walking");
    await sleep(150);
    if (!isCurrent()) break;

    // 7. Mario jumps up to hit the block!
    marioEl.className = "floor-mario jump-trans";
    marioEl.style.transform = "translateY(-28px)";
    await sleep(220);
    if (!isCurrent()) break;

    // Apex: hit block, collect reward!
    playBump();
    playPickup();
    qBlockEl.classList.add("bump");
    qBlockImg.src = sprite("used", 4);
    rewardEl.classList.add("pop");

    // Mario lands back down
    marioEl.className = "floor-mario fall-trans";
    marioEl.style.transform = "translateY(0px)";
    await sleep(240);
    if (!isCurrent()) break;

    // Mario rejoices on ground
    await sleep(700);
    if (!isCurrent()) break;

    qBlockEl.classList.remove("bump");

    // 8. Mario turns around to the right and walks back to right pipe
    marioEl.style.setProperty("--face", "1");
    await sleep(100);
    if (!isCurrent()) break;

    marioEl.className = "floor-mario moving-pos walking";
    marioEl.style.right = "52px";
    await sleep(850);
    if (!isCurrent()) break;

    marioEl.classList.remove("walking");

    // 9. Mario enters the right pipe (slides down into it)
    marioEl.className = "floor-mario pipe-trans";
    marioEl.style.setProperty("--pipe-sink", "48px");
    await sleep(520);
    if (!isCurrent()) break;

    marioEl.style.opacity = "0";

    // 10. Teleporting through pipes back to left pipe (vanished)
    // While Mario is teleporting back, the question block restores to '?'!
    await sleep(800);
    if (!isCurrent()) break;
    qBlockImg.src = sprite("q", 4);
    rewardEl.classList.remove("pop");
    await sleep(800);
    if (!isCurrent()) break;

    // 11. Position inside left pipe, prepare to emerge facing left
    marioEl.className = "floor-mario";
    marioEl.style.right = "auto";
    marioEl.style.left = "84px";
    marioEl.style.setProperty("--face", "-1");
    marioEl.style.setProperty("--pipe-sink", "48px");
    marioEl.style.opacity = "1";
    void marioEl.offsetHeight; // Force reflow

    // Emerge UP out of left pipe
    marioEl.className = "floor-mario pipe-trans";
    marioEl.style.setProperty("--pipe-sink", "0px");
    await sleep(520);
    if (!isCurrent()) break;

    // 12. Mario steps down to the left of the left pipe (left: 20px)
    marioEl.className = "floor-mario moving-pos walking";
    marioEl.style.left = "20px";
    await sleep(650);
    if (!isCurrent()) break;

    marioEl.classList.remove("walking");
    marioEl.style.setProperty("--face", "1"); // faces forward/right again

    // 13. Rest at starting position before starting the next loop
    await sleep(1800);
  }
}
