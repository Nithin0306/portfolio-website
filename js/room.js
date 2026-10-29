// Room Controller: underground blue brick room, paper card, and floor Mario teleport patrol

import { sprite, tile } from "./sprites.js?v=7";
import { seen, updateScore, syncBlockSprites } from "./world.js?v=7";
import { mountProjectWorld } from "./projects.js?v=7";

const PROJECT_IDS = new Set(["dayta", "archivist", "gocdc", "skillup"]);

let underEl = null;
let paperEl = null;
let navRowEl = null;
let currentShowing = "";

export function initRoom() {
  underEl = document.getElementById("under");
  if (!underEl) return;

  // Background blue brick tile
  underEl.style.backgroundImage = tile("ubrick", 4);

  underEl.innerHTML = `
    <!-- Top Nav Row -->
    <nav class="under-nav" id="underNav" aria-label="Underground navigation"></nav>

    <!-- Wall Coins -->
    <img class="under-decor coin-left" src="${sprite("coin", 4)}" alt="" aria-hidden="true">
    <img class="under-decor coin-right" src="${sprite("coin", 4)}" alt="" aria-hidden="true">

    <!-- Paper Card Container -->
    <div class="paper" id="paperCard" role="region" aria-live="polite" tabindex="-1"></div>
    <div class="under-scroll-spacer" aria-hidden="true"></div>

    <!-- Underground Floor with Left Pipe, Right Pipe, and Patrol Mario -->
    <div class="under-floor">
      <div class="strip" style="background-image: ${tile("ubrick", 3)}"></div>
      <div class="earth" style="background-image: ${tile("ubrick", 4)}">
        <div class="floor-pipe pipe-left">
          <img src="${sprite("pipe", 4)}" alt="">
        </div>
        <div class="floor-mario" id="floorMario" aria-hidden="true">
          <img src="${sprite("hero", 4)}" alt="">
        </div>
        <button class="pipe-btn pipe-right" id="pipeBtn" aria-label="Return to surface">
          <span class="label">surface ↑</span>
          <img src="${sprite("pipe", 4)}" alt="">
        </button>
      </div>
    </div>`;

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

  // Scroll underground view to top
  if (underEl) {
    underEl.scrollTop = 0;
  }

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
  const sceneEl = document.getElementById("world");
  if (sceneEl) {
    sceneEl.classList.remove("down");
  }
  syncBlockSprites();
}
