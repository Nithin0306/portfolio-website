// Room Controller: underground paper card rendering, nav, and prompt #f2

import { sprite, tile } from "./sprites.js";
import { seen, updateScore } from "./world.js";
import { mountProjectWorld } from "./projects.js";
import { run } from "./terminal.js";

const NEXT_SECTIONS = {
  about: "projects",
  projects: "awards",
  awards: "experience",
  experience: "resume",
  resume: "contact"
};

const PROJECT_IDS = new Set(["dayta", "archivist", "gocdc", "skillup"]);

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

  underEl.innerHTML = `
    <nav class="under-nav" id="underNav" aria-label="Underground navigation"></nav>
    <img class="under-decor bulb" src="${sprite("bulb", 4)}" alt="" aria-hidden="true">
    <img class="under-decor gear" src="${sprite("gear", 4)}" alt="" aria-hidden="true">
    <div class="paper" id="paperCard" role="region" aria-live="polite" tabindex="-1"></div>
    <img class="under-hero" src="${sprite("hero", 5)}" alt="" aria-hidden="true">
    <button class="pipe-btn" id="pipeBtn" aria-label="Return to surface">
      <span class="label">surface</span>
      <img src="${sprite("pipe", 4)}" alt="">
    </button>
    <div class="under-floor">
      <div class="strip" style="background-image: ${tile("ubrick", 3)}"></div>
      <div class="earth">
        <form class="prompt" id="f2">
          <span class="p" id="f2Path">nithin@world-1:~$</span>
          <input aria-label="Underground command prompt" autocomplete="off" spellcheck="false" placeholder="type surface, back, or any command...">
        </form>
      </div>
    </div>`;

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

  // Wire Prompt #f2 form submission via unified terminal runner
  if (promptF2) {
    promptF2.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = promptF2.querySelector("input");
      if (!inp) return;
      const val = inp.value;
      inp.value = "";
      if (val.trim()) {
        run(val);
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

  // Mount themed interactive mini-world band for project pages (Phase 9)
  if (PROJECT_IDS.has(id)) {
    mountProjectWorld(id, paperEl);
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
    const prefix = PROJECT_IDS.has(id) ? `projects/${id}` : id;
    f2Path.textContent = `nithin@world-1:~/${prefix}$`;
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
