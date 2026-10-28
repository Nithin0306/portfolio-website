/**
 * WORLD//CLI: Room Controller (Phase 7 & 8)
 * Renders page content into the underground paper card,
 * manages the nav row, underground floor, warp pipe, and decor.
 */

import { sprite, tile } from "./sprites.js";
import { seen, updateScore } from "./world.js";

const NEXT_SECTIONS = {
  about: "projects",
  projects: "awards",
  awards: "experience",
  experience: "resume",
  resume: "contact"
};

let underEl = null;
let paperEl = null;
let navRowEl = null;
let promptF2 = null;
let currentShowing = "";

export function initRoom() {
  underEl = document.getElementById("under");
  if (!underEl) return;

  // Background blue brick tile
  underEl.style.backgroundImage = tile("ubrick", 4);

  // Build underground structure
  underEl.innerHTML = `
    <!-- Top Nav Row -->
    <nav class="under-nav" id="underNav" aria-label="Underground navigation"></nav>

    <!-- Wall Decor Bobbing Sprites -->
    <img class="under-decor bulb" src="${sprite("bulb", 4)}" alt="" aria-hidden="true">
    <img class="under-decor gear" src="${sprite("gear", 4)}" alt="" aria-hidden="true">

    <!-- Paper Card Container -->
    <div class="paper" id="paperCard" role="region" aria-live="polite" tabindex="-1"></div>

    <!-- Standing Hero (Decor) -->
    <img class="under-hero" src="${sprite("hero", 5)}" alt="" aria-hidden="true">

    <!-- Warp Pipe (Surface Button) -->
    <button class="pipe-btn" id="pipeBtn" aria-label="Return to surface">
      <span class="label">surface</span>
      <img src="${sprite("pipe", 4)}" alt="">
    </button>

    <!-- Underground Floor & Prompt #f2 -->
    <div class="under-floor">
      <div class="strip" style="background-image: ${tile("ubrick", 3)}"></div>
      <div class="earth">
        <form class="prompt" id="f2">
          <span class="p" id="f2Path">nithin@world-1:~$</span>
          <input aria-label="Underground command prompt" autocomplete="off" spellcheck="false" placeholder="type surface, back, or any command...">
        </form>
      </div>
    </div>
  `;

  paperEl = document.getElementById("paperCard");
  navRowEl = document.getElementById("underNav");
  promptF2 = document.getElementById("f2");

  buildNav();

  // Wire Warp Pipe
  const pipeBtn = document.getElementById("pipeBtn");
  if (pipeBtn) {
    pipeBtn.addEventListener("click", () => {
      location.hash = "#/";
    });
  }

  // Wire Prompt #f2 form submission
  if (promptF2) {
    promptF2.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = promptF2.querySelector("input");
      if (!inp) return;
      const val = inp.value.trim().toLowerCase();
      inp.value = "";
      if (!val) return;

      if (["surface", "exit", "..", "back", "up"].includes(val)) {
        location.hash = "#/";
        return;
      }
      const cleaned = val.replace(/^(cd|cat|open|ls|goto)\s+/, "").replace(/^projects\//, "");
      if (["skillup", "groupflix", "fishglob", "neoflash"].includes(cleaned)) {
        location.hash = `#/projects/${cleaned}`;
      } else {
        location.hash = `#/${cleaned}`;
      }
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
    { id: "surface", label: "surface", action: "up" }
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

  // Append Next Section button if applicable
  const nextId = NEXT_SECTIONS[id];
  if (nextId) {
    const nextBar = document.createElement("div");
    nextBar.className = "next-section-bar";
    const nextBtn = document.createElement("a");
    nextBtn.className = "btn";
    nextBtn.href = `#/${nextId}`;
    nextBtn.textContent = `Next: ${nextId} ▸`;
    nextBar.appendChild(nextBtn);
    paperEl.appendChild(nextBar);
  }

  // Mark as seen and update score line
  if (!seen.has(id)) {
    seen.add(id);
    updateScore();
  }

  // Update nav row highlighting
  updateNavState(id);

  // Update prompt path in #f2
  const f2Path = document.getElementById("f2Path");
  if (f2Path) {
    f2Path.textContent = `nithin@world-1:~/${id}$`;
  }

  // Scroll underground view to top
  if (underEl) {
    underEl.scrollTop = 0;
  }

  // Move focus to first heading for screen reader / keyboard accessibility
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
  const sceneEl = document.getElementById("world");
  if (sceneEl) {
    sceneEl.classList.remove("down");
  }

  // Reset surface prompt path
  const f1Path = document.querySelector("#f1 .p");
  if (f1Path) {
    f1Path.textContent = "nithin@world-1:~$";
  }

  // Focus surface prompt
  const f1Input = document.querySelector("#f1 input");
  if (f1Input) {
    setTimeout(() => f1Input.focus(), 350);
  }
}
