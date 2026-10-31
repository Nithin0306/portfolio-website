// Room Controller: underground blue brick room, paper card, and floor Mario teleport patrol

import { sprite, tile } from "./sprites.js?v=14";
import { seen, updateScore, syncBlockSprites } from "./world.js?v=14";
import { playBump, playPickup } from "./audio.js?v=14";

const pageCache = new Map();

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
    <!-- Top Nav Row: fixed header at top of underground room -->
    <nav class="under-nav" id="underNav" aria-label="Underground navigation"></nav>

    <!-- Scrollable content area: contains coins and paper card -->
    <div class="under-scroll-body" id="underScrollBody">
      <!-- Wall Coins -->
      <img class="under-decor coin-left" src="${sprite("coin", 4)}" alt="" aria-hidden="true">
      <img class="under-decor coin-right" src="${sprite("coin", 4)}" alt="" aria-hidden="true">

      <!-- Paper Card Container -->
      <div class="paper" id="paperCard" role="region" aria-live="polite" tabindex="-1"></div>
      <div class="under-scroll-spacer" aria-hidden="true"></div>
    </div>

    <!-- Underground Floor: seamless blue brick floor matching background (Fix #1) -->
    <div class="under-floor" id="underFloor" style="background-image: ${tile("ubrick", 4)}">
      <!-- Left Pipe (Enlarged to 60x60) -->
      <div class="floor-pipe pipe-left" id="floorPipeLeft">
        <img src="${sprite("pipe", 5)}" alt="" aria-hidden="true">
      </div>

      <!-- Right Pipe with Surface Button (Enlarged) -->
      <button class="pipe-btn pipe-right" id="pipeBtn" aria-label="Return to surface">
        <span class="label">surface ↑</span>
        <img src="${sprite("pipe", 5)}" alt="" aria-hidden="true">
      </button>

      <!-- Question Block near Right Pipe (Raised higher & moved to left) -->
      <div class="floor-qblock" id="floorQBlock" aria-hidden="true">
        <img id="floorQBlockImg" src="${sprite("q", 5)}" alt="">
      </div>

      <!-- Reward Coin popping out of Question Block -->
      <div class="floor-reward" id="floorReward" aria-hidden="true">
        <img src="${sprite("coin", 5)}" alt="">
      </div>

      <!-- Mario Teleporting Actor -->
      <div class="floor-mario" id="floorMario" aria-hidden="true">
        <img id="floorMarioImg" src="${sprite("hero", 5)}" alt="">
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
    { id: "surface", label: "↑ surface", action: "up" },
    { id: "about", label: "about" },
    { id: "projects", label: "projects" },
    { id: "experience", label: "experience" },
    { id: "awards", label: "awards" },
    { id: "resume", label: "resume" },
    { id: "contact", label: "contact" }
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

export async function show(id) {
  if (!paperEl) initRoom();
  if (currentShowing === id) return;
  currentShowing = id;

  let html = pageCache.get(id);
  if (!html) {
    try {
      const res = await fetch(`pages/${id}.html?v=14`);
      if (res.ok) {
        html = await res.text();
        pageCache.set(id, html);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      // Fallback to inline template element in #pages if present
      const template = document.querySelector(`#pages [data-page="${id}"]`) || document.querySelector(`#pages [data-page="error"]`);
      if (template) {
        html = template.innerHTML;
      } else {
        try {
          const errRes = await fetch(`pages/error.html?v=14`);
          html = await errRes.text();
        } catch (e2) {
          html = `<h2>Page not found</h2><p>The requested section could not be found.</p><p><a class="btn" href="#/">Return to World</a></p>`;
        }
      }
    }
  }

  // Set paper card content
  paperEl.innerHTML = html;

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
    if (btn.dataset.id === id) {
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
  const leftPipeEl = document.getElementById("floorPipeLeft");
  const rightPipeEl = document.getElementById("pipeBtn");

  if (!marioEl || !marioImg || !qBlockEl || !qBlockImg || !rewardEl || !leftPipeEl || !rightPipeEl) return;

  const isCurrent = () => patrolActive && cycleId === patrolCycle;

  // Calculates exact coordinates dynamically based on element positions inside the floor
  const getCoords = () => {
    const marioW = marioEl.offsetWidth || 40;
    const leftPipeLeft = leftPipeEl.offsetLeft;
    const leftPipeW = leftPipeEl.offsetWidth;
    const rightPipeLeft = rightPipeEl.offsetLeft;
    const rightPipeW = rightPipeEl.offsetWidth;
    const qBlockLeft = qBlockEl.offsetLeft;
    const qBlockW = qBlockEl.offsetWidth;

    return {
      leftStand: Math.max(4, leftPipeLeft - marioW - 8),
      leftEdge: Math.max(8, leftPipeLeft - 4),
      leftCenter: leftPipeLeft + (leftPipeW - marioW) / 2,
      rightCenter: rightPipeLeft + (rightPipeW - marioW) / 2,
      rightLand: rightPipeLeft - marioW - 12,
      qBlockUnder: qBlockLeft + (qBlockW - marioW) / 2
    };
  };

  // Reduced motion check
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    const coords = getCoords();
    marioEl.style.left = coords.leftStand + "px";
    marioEl.style.right = "auto";
    marioEl.style.setProperty("--face", "1");
    marioEl.style.setProperty("--pipe-sink", "0px");
    marioEl.style.opacity = "1";
    return;
  }

  while (isCurrent()) {
    const coords = getCoords();

    // 0. Ensure Question Block is restored to '?'
    qBlockImg.src = sprite("q", 5);
    qBlockEl.classList.remove("bump");
    rewardEl.classList.remove("pop");

    // 1. Initial state: Mario standing to the left of the left pipe
    marioEl.className = "floor-mario";
    marioEl.style.left = coords.leftStand + "px";
    marioEl.style.right = "auto";
    marioEl.style.transform = "none";
    marioEl.style.setProperty("--face", "1");
    marioEl.style.setProperty("--pipe-sink", "0px");
    marioEl.style.opacity = "1";

    // Stand still for 1.2s
    await sleep(1200);
    if (!isCurrent()) break;

    // 2. Mario walks toward left pipe
    marioEl.className = "floor-mario moving-pos walking";
    marioEl.style.left = coords.leftEdge + "px";
    await sleep(380);
    if (!isCurrent()) break;

    marioEl.classList.remove("walking");

    // 3. Mario JUMPS onto top of the left pipe
    marioEl.className = "floor-mario jump-trans";
    marioEl.style.left = coords.leftCenter + "px";
    marioEl.style.transform = "translateY(-48px)";
    await sleep(280);
    if (!isCurrent()) break;

    // Lands on pipe rim
    marioEl.className = "floor-mario fall-trans";
    marioEl.style.transform = "translateY(-30px)";
    await sleep(200);
    if (!isCurrent()) break;

    // Slides down into pipe
    marioEl.className = "floor-mario pipe-trans";
    marioEl.style.setProperty("--pipe-sink", "60px");
    marioEl.style.transform = "translateY(30px)";
    await sleep(480);
    if (!isCurrent()) break;

    marioEl.style.opacity = "0";

    // 4. Teleporting through pipes to right pipe (vanished)
    await sleep(1500);
    if (!isCurrent()) break;

    // Recalculate coords in case of screen resize/orientation change
    const curCoords = getCoords();

    // 5. Position inside right pipe, prepare to JUMP OUT facing left
    marioEl.className = "floor-mario";
    marioEl.style.right = "auto";
    marioEl.style.left = curCoords.rightCenter + "px";
    marioEl.style.setProperty("--face", "-1");
    marioEl.style.setProperty("--pipe-sink", "60px");
    marioEl.style.transform = "translateY(30px)";
    marioEl.style.opacity = "1";
    void marioEl.offsetHeight; // Force reflow

    // 6. Mario JUMPS UP out of right pipe!
    marioEl.className = "floor-mario jump-trans";
    marioEl.style.setProperty("--pipe-sink", "0px");
    marioEl.style.transform = "translateY(-54px)";
    marioEl.style.left = (curCoords.rightCenter - 20) + "px";
    await sleep(300);
    if (!isCurrent()) break;

    // Arcs down and lands on floor
    marioEl.className = "floor-mario fall-trans";
    marioEl.style.transform = "translateY(0px)";
    marioEl.style.left = curCoords.rightLand + "px";
    await sleep(240);
    if (!isCurrent()) break;

    // 7. Mario walks left to under raised Question Block
    marioEl.className = "floor-mario moving-pos walking";
    marioEl.style.left = curCoords.qBlockUnder + "px";
    await sleep(750);
    if (!isCurrent()) break;

    marioEl.classList.remove("walking");
    await sleep(150);
    if (!isCurrent()) break;

    // 8. Mario jumps high up to hit the block!
    marioEl.className = "floor-mario jump-trans";
    marioEl.style.transform = "translateY(-54px)";
    await sleep(240);
    if (!isCurrent()) break;

    // Apex: hit block, collect reward!
    playBump();
    playPickup();
    qBlockEl.classList.add("bump");
    qBlockImg.src = sprite("used", 5);
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

    // 9. Mario turns around to the right and walks toward right pipe
    marioEl.style.setProperty("--face", "1");
    await sleep(100);
    if (!isCurrent()) break;

    marioEl.className = "floor-mario moving-pos walking";
    marioEl.style.left = (curCoords.rightLand + 8) + "px";
    await sleep(650);
    if (!isCurrent()) break;

    marioEl.classList.remove("walking");

    // 10. Mario JUMPS onto top of right pipe
    marioEl.className = "floor-mario jump-trans";
    marioEl.style.left = curCoords.rightCenter + "px";
    marioEl.style.transform = "translateY(-48px)";
    await sleep(280);
    if (!isCurrent()) break;

    // Lands on pipe rim
    marioEl.className = "floor-mario fall-trans";
    marioEl.style.transform = "translateY(-30px)";
    await sleep(200);
    if (!isCurrent()) break;

    // Slides down into right pipe
    marioEl.className = "floor-mario pipe-trans";
    marioEl.style.setProperty("--pipe-sink", "60px");
    marioEl.style.transform = "translateY(30px)";
    await sleep(480);
    if (!isCurrent()) break;

    marioEl.style.opacity = "0";

    // 11. Teleporting through pipes back to left pipe (vanished)
    // While Mario is teleporting back, question block restores to '?'!
    await sleep(750);
    if (!isCurrent()) break;
    qBlockImg.src = sprite("q", 5);
    rewardEl.classList.remove("pop");
    await sleep(750);
    if (!isCurrent()) break;

    // 12. Position inside left pipe, prepare to JUMP OUT facing left
    marioEl.className = "floor-mario";
    marioEl.style.right = "auto";
    marioEl.style.left = curCoords.leftCenter + "px";
    marioEl.style.setProperty("--face", "-1");
    marioEl.style.setProperty("--pipe-sink", "60px");
    marioEl.style.transform = "translateY(30px)";
    marioEl.style.opacity = "1";
    void marioEl.offsetHeight; // Force reflow

    // 13. Mario JUMPS UP out of left pipe!
    marioEl.className = "floor-mario jump-trans";
    marioEl.style.setProperty("--pipe-sink", "0px");
    marioEl.style.transform = "translateY(-54px)";
    marioEl.style.left = (curCoords.leftCenter - 20) + "px";
    await sleep(300);
    if (!isCurrent()) break;

    // Arcs down and lands on floor to the left of the left pipe
    marioEl.className = "floor-mario fall-trans";
    marioEl.style.transform = "translateY(0px)";
    marioEl.style.left = curCoords.leftStand + "px";
    await sleep(240);
    if (!isCurrent()) break;

    marioEl.style.setProperty("--face", "1"); // faces forward/right again

    // 14. Rest at starting position before starting the next loop
    await sleep(2000);
  }
}
