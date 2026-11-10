// Retro OS Window Manager: manages draggable, stackable windows over the Mario surface world

import { sprite } from "./sprites.js?v=21";
import { seen, updateScore, syncBlockSprites, startHeroIdleCycle, stopHeroIdleCycle } from "./world.js?v=21";
import { playBump, playPickup, playWarp, isSoundEnabled, toggleSound, updateSoundButton } from "./audio.js?v=21";

const SECTION_CONFIG = {
  about: { title: "ABOUT-ME", icon: "bulb", color: "about" },
  projects: { title: "PROJECTS", icon: "term", color: "projects" },
  experience: { title: "EXPERIENCE", icon: "gear", color: "experience" },
  awards: { title: "AWARDS", icon: "trophy", color: "awards" },
  resume: { title: "RESUME", icon: "doc", color: "resume" },
  contact: { title: "CONTACT", icon: "mail", color: "contact" }
};

const pageCache = new Map();
const openWindows = new Map(); // id -> element
let topZIndex = 100;
let containerEl = null;
let taskbarTabsEl = null;
let startMenuEl = null;

export function initWindows() {
  containerEl = document.getElementById("windowsContainer");
  if (!containerEl) {
    const sceneEl = document.getElementById("world");
    containerEl = document.createElement("div");
    containerEl.className = "windows-container";
    containerEl.id = "windowsContainer";
    if (sceneEl) sceneEl.appendChild(containerEl);
  }

  taskbarTabsEl = document.getElementById("taskbarTabs");
  startMenuEl = document.getElementById("startMenu");

  // Wire Start Menu button
  const startBtn = document.getElementById("taskbarStart");
  if (startBtn) {
    const startHeroIcon = document.getElementById("startHeroIcon");
    if (startHeroIcon) startHeroIcon.src = sprite("hero", 3);

    startBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleStartMenu();
    });
  }

  // Wire Start Menu items
  if (startMenuEl) {
    startMenuEl.addEventListener("click", (e) => {
      const item = e.target.closest(".start-item");
      if (!item) return;
      const action = item.dataset.action;
      if (action === "toggle-sfx") {
        toggleSound();
        updateSfxUi();
      } else if (action && SECTION_CONFIG[action]) {
        openWindow(action);
      }
      closeStartMenu();
    });
  }

  // Close Start Menu on click outside
  document.addEventListener("click", (e) => {
    if (startMenuEl && !startMenuEl.hidden && !e.target.closest("#startMenu") && !e.target.closest("#taskbarStart")) {
      closeStartMenu();
    }

    // Wire internal links inside windows (e.g. btn-retro pointing to #/projects)
    const internalLink = e.target.closest("a[href^='#/']");
    if (internalLink && e.target.closest(".retro-window")) {
      const href = internalLink.getAttribute("href");
      const id = href.replace(/^#\/?/, "");
      if (id && SECTION_CONFIG[id]) {
        e.preventDefault();
        openWindow(id);
      }
    }
  });

  // Wire Tray buttons
  const traySfx = document.getElementById("traySfx");
  if (traySfx) {
    traySfx.addEventListener("click", () => {
      toggleSound();
      updateSfxUi();
    });
  }

  const trayAch = document.getElementById("trayAchievements");
  if (trayAch) {
    trayAch.addEventListener("click", () => {
      openWindow("awards");
    });
  }

  // Live Clock in Tray
  updateClock();
  setInterval(updateClock, 1000);

  // Esc key closes top window
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTopWindow();
    }
  });
}

function updateClock() {
  const clockEl = document.getElementById("trayClock");
  if (!clockEl) return;
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}

function updateSfxUi() {
  const enabled = isSoundEnabled();
  const traySfx = document.getElementById("traySfx");
  if (traySfx) traySfx.textContent = enabled ? "SFX: ON" : "SFX: OFF";
  const startSfxLabel = document.getElementById("startSfxLabel");
  if (startSfxLabel) startSfxLabel.textContent = enabled ? "SFX: On" : "SFX: Off";
  updateSoundButton();
}

function toggleStartMenu() {
  if (!startMenuEl) return;
  const isHidden = startMenuEl.hidden;
  startMenuEl.hidden = !isHidden;
  const startBtn = document.getElementById("taskbarStart");
  if (startBtn) startBtn.classList.toggle("is-open", isHidden);
}

function closeStartMenu() {
  if (!startMenuEl) return;
  startMenuEl.hidden = true;
  const startBtn = document.getElementById("taskbarStart");
  if (startBtn) startBtn.classList.remove("is-open");
}

export async function openWindow(id, originRect = null) {
  if (!SECTION_CONFIG[id]) return;

  // Mark section as seen and update score
  if (!seen.has(id)) {
    seen.add(id);
    syncBlockSprites();
    updateScore();
  }

  // If already open, restore if minimized and focus
  if (openWindows.has(id)) {
    const existing = openWindows.get(id);
    if (existing.classList.contains("is-minimized")) {
      existing.classList.remove("is-minimized");
    }
    focusWindow(id);
    return;
  }

  // Fetch page content
  let html = pageCache.get(id);
  if (!html) {
    try {
      const res = await fetch(`pages/${id}.html?v=21`);
      if (res.ok) {
        html = await res.text();
        pageCache.set(id, html);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch {
      html = `<div style="padding: 20px;"><h3>Section loaded</h3><p>Content is loading...</p></div>`;
    }
  }

  const cfg = SECTION_CONFIG[id];
  const win = document.createElement("div");
  win.className = `retro-window window-${cfg.color} is-active`;
  win.id = `win-${id}`;
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-label", cfg.title);

  const iconSrc = sprite(cfg.icon, 2);

  win.innerHTML = `
    <div class="window-titlebar">
      <div class="window-title-left">
        <img class="window-title-icon" src="${iconSrc}" alt="" aria-hidden="true">
        <span class="window-title-text">${cfg.title}</span>
      </div>
      <div class="window-title-controls">
        <button type="button" class="window-btn btn-min" aria-label="Minimize ${cfg.title}">−</button>
        <button type="button" class="window-btn btn-close" aria-label="Close ${cfg.title}">×</button>
      </div>
    </div>
    <div class="window-content" tabindex="-1">
      ${html}
    </div>
  `;

  // Stagger window position on desktop
  const count = openWindows.size;
  const offset = (count % 4) * 26;
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    const desktopLeft = Math.max(20, Math.round((window.innerWidth - 860) / 2) + offset - 30);
    const desktopTop = Math.max(30, Math.round((window.innerHeight - 560) / 2) + offset - 40);
    win.style.left = `${desktopLeft}px`;
    win.style.top = `${desktopTop}px`;
    win.style.setProperty("--win-left", `${desktopLeft}px`);
    win.style.setProperty("--win-top", `${desktopTop}px`);
  }

  // Pop-out origin calculation from block
  if (originRect) {
    const originX = Math.round(originRect.left + originRect.width / 2);
    const originY = Math.round(originRect.top + originRect.height / 2);
    win.style.setProperty("--origin-x", `${originX}px`);
    win.style.setProperty("--origin-y", `${originY}px`);
    win.classList.add("window-popping");
    setTimeout(() => win.classList.remove("window-popping"), 300);
  }

  // Wire titlebar controls
  const minBtn = win.querySelector(".btn-min");
  if (minBtn) {
    minBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeWindow(id);
    });
  }

  const closeBtn = win.querySelector(".btn-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeWindow(id);
    });
  }

  // Clicking window raises it to front
  win.addEventListener("pointerdown", () => {
    focusWindow(id);
  });

  // Draggable behavior by titlebar on desktop
  if (!isMobile) {
    makeDraggable(win);
  }

  // Mount to container
  win.style.zIndex = ++topZIndex;
  containerEl.appendChild(win);
  openWindows.set(id, win);

  // Add Taskbar Tab
  addTaskbarTab(id, cfg, iconSrc);

  // Focus
  focusWindow(id);

  // If projects, initialize master-detail interactivity
  if (id === "projects") {
    initProjectsMasterDetail(win);
  }

  // If about, inject avatar sprite
  if (id === "about") {
    const avatarEl = win.querySelector("#aboutAvatarImg");
    if (avatarEl) avatarEl.src = sprite("portrait", 4);
  }

  // If experience, inject coin sprites
  if (id === "experience") {
    win.querySelectorAll(".exp-marker-img").forEach((img) => {
      img.src = sprite("coin", 3);
    });
  }

  // If contact, wire copy email button
  if (id === "contact") {
    const copyBtn = win.querySelector("#copyEmailBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const email = copyBtn.dataset.email || "nithin.p.m2006@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
          playPickup();
          const orig = copyBtn.innerHTML;
          copyBtn.innerHTML = "<span>✓ Copied!</span>";
          setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
        });
      });
    }
  }

  // Update hash
  location.hash = `#/${id}`;
}

function makeDraggable(win) {
  const titlebar = win.querySelector(".window-titlebar");
  if (!titlebar) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initLeft = 0;
  let initTop = 0;

  titlebar.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".window-btn")) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initLeft = win.offsetLeft;
    initTop = win.offsetTop;
    titlebar.setPointerCapture(e.pointerId);
    win.classList.add("is-dragging");
  });

  titlebar.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxLeft = window.innerWidth - win.offsetWidth;
    const maxTop = window.innerHeight - 100;

    const newLeft = Math.max(10, Math.min(maxLeft - 10, initLeft + dx));
    const newTop = Math.max(10, Math.min(maxTop - 60, initTop + dy));

    win.style.left = `${newLeft}px`;
    win.style.top = `${newTop}px`;
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    win.classList.remove("is-dragging");
    try { titlebar.releasePointerCapture(e.pointerId); } catch {}
  };

  titlebar.addEventListener("pointerup", endDrag);
  titlebar.addEventListener("pointercancel", endDrag);
}

function addTaskbarTab(id, cfg, iconSrc) {
  if (!taskbarTabsEl) return;
  let tab = taskbarTabsEl.querySelector(`.task-tab[data-id="${id}"]`);
  if (!tab) {
    tab = document.createElement("button");
    tab.className = "task-tab is-active";
    tab.dataset.id = id;
    tab.innerHTML = `<img class="task-tab-icon" src="${iconSrc}" alt=""><span>${cfg.title}</span>`;
    tab.addEventListener("click", () => {
      const win = openWindows.get(id);
      if (win) {
        if (win.classList.contains("is-minimized")) {
          win.classList.remove("is-minimized");
          focusWindow(id);
        } else if (win.classList.contains("is-active")) {
          minimizeWindow(id);
        } else {
          focusWindow(id);
        }
      } else {
        openWindow(id);
      }
    });
    taskbarTabsEl.appendChild(tab);
  }
}

export function focusWindow(id) {
  const win = openWindows.get(id);
  if (!win) return;

  win.style.zIndex = ++topZIndex;

  // Toggle active class on all windows
  openWindows.forEach((w) => w.classList.remove("is-active"));
  win.classList.add("is-active");

  // Toggle active class on taskbar tabs
  if (taskbarTabsEl) {
    const tabs = taskbarTabsEl.querySelectorAll(".task-tab");
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t.dataset.id === id);
    });
  }

  location.hash = `#/${id}`;
}

export function minimizeWindow(id) {
  const win = openWindows.get(id);
  if (!win) return;
  win.classList.add("is-minimized");
  win.classList.remove("is-active");

  if (taskbarTabsEl) {
    const tab = taskbarTabsEl.querySelector(`.task-tab[data-id="${id}"]`);
    if (tab) tab.classList.remove("is-active");
  }

  // Focus next available window
  focusNextTopWindow();
}

export function closeWindow(id) {
  const win = openWindows.get(id);
  if (!win) return;

  win.remove();
  openWindows.delete(id);

  if (taskbarTabsEl) {
    const tab = taskbarTabsEl.querySelector(`.task-tab[data-id="${id}"]`);
    if (tab) tab.remove();
  }

  // Focus next available window, or reset hash if none left
  if (openWindows.size > 0) {
    focusNextTopWindow();
  } else {
    location.hash = "#/";
    syncBlockSprites();
    startHeroIdleCycle();
  }
}

function focusNextTopWindow() {
  let highest = null;
  let maxZ = -1;
  openWindows.forEach((w, id) => {
    if (!w.classList.contains("is-minimized")) {
      const z = parseInt(w.style.zIndex, 10) || 0;
      if (z > maxZ) {
        maxZ = z;
        highest = id;
      }
    }
  });

  if (highest) {
    focusWindow(highest);
  } else {
    location.hash = "#/";
  }
}

function closeTopWindow() {
  let highest = null;
  let maxZ = -1;
  openWindows.forEach((w, id) => {
    const z = parseInt(w.style.zIndex, 10) || 0;
    if (z > maxZ) {
      maxZ = z;
      highest = id;
    }
  });
  if (highest) closeWindow(highest);
}

// Master-detail interactive handler for Projects Window (Image 3 & 4)
const PROJECTS_DATA = {
  gocdc: {
    title: "GOCDC · EVENT-DRIVEN PIPELINE",
    status: "SHIPPED",
    statusColor: "green",
    shot: "assets/shots/gocdc.png",
    desc: "A Go-based Change Data Capture (CDC) streaming engine utilizing PostgreSQL WAL logical decoding via pgoutput to stream database events directly to Apache Kafka at 1,400 events/sec, completely eliminating database polling overhead.",
    metrics: [
      { val: "1,400 ev/s", lbl: "THROUGHPUT" },
      { val: "<150ms", lbl: "SYNC LAG" },
      { val: "100%", lbl: "ORDERING" }
    ],
    stack: ["Go (Golang)", "PostgreSQL WAL", "Apache Kafka", "Redis", "Docker"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/nithin0306/gocdc" }
    ]
  },
  archivist: {
    title: "ARCHIVIST · ARCHITECTURE BOT",
    status: "ACTIVE",
    statusColor: "green",
    shot: "assets/shots/archivist.png",
    desc: "An autonomous GitHub Action utilizing LangGraph state machines and Model Context Protocol (MCP) to dynamically parse pull request diffs, achieving 100% automated enforcement of Architecture Decision Records (ADRs).",
    metrics: [
      { val: "<60s", lbl: "CYCLE TIME" },
      { val: "100%", lbl: "ENFORCEMENT" },
      { val: "0", lbl: "DRIFT" }
    ],
    stack: ["Python", "LangGraph", "GitHub Actions", "MCP Protocol", "LLMs"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/nithin0306/archivist" }
    ]
  },
  dayta: {
    title: "DAYTA · RAG KNOWLEDGE BASE",
    status: "LIVE",
    statusColor: "gold",
    shot: "assets/shots/dayta.png",
    desc: "Processes multi-page academic schedules and course syllabi, generating high-density vector embeddings stored in Pinecone for rapid semantic search and sub-second conversational schedule querying.",
    metrics: [
      { val: "<1s", lbl: "LATENCY" },
      { val: "768-D", lbl: "VECTORS" },
      { val: "100%", lbl: "ACCURACY" }
    ],
    stack: ["React (Vite)", "TypeScript", "FastAPI", "Pinecone", "Gemini API"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/nithin0306/dayta" }
    ]
  },
  skillup: {
    title: "SKILLUP · RESKILLING ENGINE",
    status: "AWARDED",
    statusColor: "gold",
    shot: "assets/shots/skillup.png",
    desc: "AI-driven workforce reskilling engine that detects engineering skill gaps against target roles and curates personalized roadmaps. Built in a 36-hour sprint and awarded 2nd place out of 30+ teams at Hack101.",
    metrics: [
      { val: "2ND", lbl: "HACK101" },
      { val: "50+", lbl: "DOMAINS" },
      { val: "36H", lbl: "SPRINT" }
    ],
    stack: ["FastAPI", "Python", "Vector Search", "NLP", "React"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/nithin0306/skillup" }
    ]
  }
};

function initProjectsMasterDetail(win) {
  const cards = win.querySelectorAll(".proj-card");
  const detailPane = win.querySelector("#projectDetailPane");
  if (!cards.length || !detailPane) return;

  const renderProjectDetail = (projId) => {
    const data = PROJECTS_DATA[projId] || PROJECTS_DATA.gocdc;

    cards.forEach((c) => {
      const active = c.dataset.proj === projId;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-selected", String(active));
    });

    const metricsHtml = data.metrics.map((m) => `
      <div class="metric-tile">
        <span class="metric-val">${m.val}</span>
        <span class="metric-lbl">${m.lbl}</span>
      </div>
    `).join("");

    const stackHtml = data.stack.map((s) => `
      <span class="skill-pill">${s}</span>
    `).join("");

    const linksHtml = data.links.map((l) => `
      <a class="btn-retro pri" href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a>
    `).join("");

    detailPane.innerHTML = `
      <div class="proj-bezel-frame">
        <img class="proj-detail-img" src="${data.shot}" alt="${data.title}">
      </div>
      <div class="proj-detail-title-row">
        <h3 class="proj-detail-title">${data.title}</h3>
        <span class="proj-status-pill">${data.status}</span>
      </div>
      <p class="proj-detail-desc">${data.desc}</p>
      <div class="proj-metrics-row">
        ${metricsHtml}
      </div>
      <div class="exp-tags-row" style="margin-bottom: 14px;">
        ${stackHtml}
      </div>
      <div class="proj-detail-actions">
        ${linksHtml}
      </div>
    `;
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const projId = card.dataset.proj;
      if (projId) renderProjectDetail(projId);
    });
  });

  // Render initial selected
  renderProjectDetail("gocdc");
}
