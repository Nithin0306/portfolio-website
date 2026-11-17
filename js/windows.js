// Retro OS Window Manager: manages draggable, stackable windows over the Mario surface world

import { sprite } from "./sprites.js?v=33";
import { seen, updateScore, syncBlockSprites, startHeroIdleCycle, stopHeroIdleCycle } from "./world.js?v=33";
import { playBump, playPickup, playWarp, isSoundEnabled, toggleSound, updateSoundButton } from "./audio.js?v=33";

const SECTION_CONFIG = {
  about: { title: "ABOUT-ME", icon: "bulb", color: "about" },
  projects: { title: "PROJECTS", icon: "term", color: "projects" },
  experience: { title: "EXPERIENCE", icon: "gear", color: "experience" },
  awards: { title: "AWARDS", icon: "trophy", color: "awards" },
  resume: { title: "RESUME", icon: "doc", color: "resume" },
  contact: { title: "CONTACT", icon: "mail", color: "contact" }
};

const SECTIONS_ORDER = ["about", "projects", "experience", "awards", "resume", "contact"];

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

  // Restore saved Theme (Day / Night)
  try {
    const savedTheme = localStorage.getItem("portfolio_theme");
    if (savedTheme === "night") {
      setTheme(true);
    }
  } catch {}

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
      } else if (action === "toggle-theme") {
        toggleTheme();
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

  // Wire Sun/Moon click to toggle Day/Night mode
  const sunBtn = document.getElementById("sunToggle") || document.querySelector(".sun");
  if (sunBtn) {
    sunBtn.addEventListener("click", () => {
      playPickup();
      toggleTheme();
    });
    sunBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playPickup();
        toggleTheme();
      }
    });
  }

  // Esc key closes top window
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTopWindow();
    }
  });
}

function updateSfxUi() {
  const enabled = isSoundEnabled();
  const traySfx = document.getElementById("traySfx");
  if (traySfx) traySfx.textContent = enabled ? "SFX: ON" : "SFX: OFF";
  const startSfxLabel = document.getElementById("startSfxLabel");
  if (startSfxLabel) startSfxLabel.textContent = enabled ? "SFX: On" : "SFX: Off";
  updateSoundButton();
}

function toggleTheme() {
  const world = document.getElementById("world");
  if (!world) return;
  const isNight = world.classList.toggle("night-mode");
  applyThemeUi(isNight);
  try {
    localStorage.setItem("portfolio_theme", isNight ? "night" : "day");
  } catch {}
}

function setTheme(isNight) {
  const world = document.getElementById("world");
  if (!world) return;
  world.classList.toggle("night-mode", isNight);
  applyThemeUi(isNight);
}

function applyThemeUi(isNight) {
  const sunBtn = document.getElementById("sunToggle") || document.querySelector(".sun");
  if (sunBtn) {
    sunBtn.title = isNight ? "Click to toggle Day Mode (Sun)" : "Click to toggle Night Mode (Moon)";
    sunBtn.setAttribute("aria-label", isNight ? "Switch to day mode" : "Switch to night mode");
  }
  const startThemeLabel = document.getElementById("startThemeLabel");
  if (startThemeLabel) startThemeLabel.textContent = isNight ? "Theme: Night" : "Theme: Day";
  const campfire = document.getElementById("nightCampfire");
  if (campfire) campfire.hidden = !isNight;
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

  // Mark section as seen and update score (for portfolio main sections)
  if (SECTIONS_ORDER.includes(id) && !seen.has(id)) {
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

  // Auto-minimize oldest window if 4 non-minimized windows are already open
  const openNonMin = [];
  openWindows.forEach((w, wId) => {
    if (!w.classList.contains("is-minimized")) openNonMin.push(wId);
  });
  if (openNonMin.length >= 4) {
    minimizeWindow(openNonMin[0]);
  }

  // Fetch page content
  let html = pageCache.get(id);
  if (!html) {
    try {
      const res = await fetch(`pages/${id}.html?v=32`);
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

  // Calculate Navigation targets for window footer
  const currentIdx = SECTIONS_ORDER.indexOf(id);
  let navFooterHtml = "";
  if (currentIdx !== -1) {
    const prevId = SECTIONS_ORDER[(currentIdx - 1 + SECTIONS_ORDER.length) % SECTIONS_ORDER.length];
    const nextId = SECTIONS_ORDER[(currentIdx + 1) % SECTIONS_ORDER.length];
    const prevTitle = SECTION_CONFIG[prevId].title;
    const nextTitle = SECTION_CONFIG[nextId].title;

    navFooterHtml = `
      <div class="window-footer">
        <span class="window-footer-path">${cfg.title}</span>
        <div class="window-footer-nav">
          <button type="button" class="win-nav-btn btn-prev" data-target="${prevId}">◂ ${prevTitle}</button>
          <button type="button" class="win-nav-btn btn-next" data-target="${nextId}">${nextTitle} ▸</button>
        </div>
      </div>
    `;
  }

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
    ${navFooterHtml}
  `;

  // Mount to container
  win.style.zIndex = ++topZIndex;
  containerEl.appendChild(win);
  openWindows.set(id, win);

  // Position in the middle of the available viewport / sky area (above the floor & taskbar)
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    const count = openWindows.size;
    const cascadeOffset = ((count - 1) % 3) * 18;
    const winW = win.offsetWidth || 900;
    const winH = win.offsetHeight || 520;
    const skyH = Math.max(320, window.innerHeight - 124);

    const desktopLeft = Math.max(16, Math.round((window.innerWidth - winW) / 2) + cascadeOffset);
    const desktopTop = Math.max(16, Math.round((skyH - winH) / 2) + cascadeOffset);

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
    const handleMin = (e) => {
      e.stopPropagation();
      e.preventDefault();
      playPickup();
      minimizeWindow(id);
    };
    minBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
    minBtn.addEventListener("mousedown", (e) => e.stopPropagation());
    minBtn.addEventListener("click", handleMin);
  }

  const closeBtn = win.querySelector(".btn-close");
  if (closeBtn) {
    const handleClose = (e) => {
      e.stopPropagation();
      e.preventDefault();
      playPickup();
      closeWindow(id);
    };
    closeBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
    closeBtn.addEventListener("mousedown", (e) => e.stopPropagation());
    closeBtn.addEventListener("click", handleClose);
  }

  // Wire footer navigation buttons
  const prevBtn = win.querySelector(".btn-prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const target = prevBtn.dataset.target;
      if (target) openWindow(target);
    });
  }

  const nextBtn = win.querySelector(".btn-next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const target = nextBtn.dataset.target;
      if (target) openWindow(target);
    });
  }

  // Clicking window raises it to front (ignore clicks on window control buttons)
  win.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".window-btn")) return;
    focusWindow(id);
  });

  // Make every opened window draggable across laptop, desktop, and touch screens
  makeDraggable(win);

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

  // If resume, initialize interactive tabs & print
  if (id === "resume") {
    initResumeTabs(win);
  }

  // If contact, wire copy email button & interactive console
  if (id === "contact") {
    initContactConsole(win);
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

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxLeft = Math.max(10, window.innerWidth - win.offsetWidth - 10);
    const maxTop = Math.max(10, window.innerHeight - 110);

    const newLeft = Math.max(10, Math.min(maxLeft, initLeft + dx));
    const newTop = Math.max(10, Math.min(maxTop, initTop + dy));

    win.style.left = `${newLeft}px`;
    win.style.top = `${newTop}px`;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    win.classList.remove("is-dragging");
    titlebar.style.cursor = "";
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  };

  titlebar.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".window-btn")) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initLeft = win.offsetLeft;
    initTop = win.offsetTop;
    win.classList.add("is-dragging");
    titlebar.style.cursor = "grabbing";

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  });
}

function initResumeTabs(win) {
  // Download button pickup sound
  const downloadBtn = win.querySelector("#resumeDownloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => playPickup());
  }

  // Inject sprites
  const avatarImg = win.querySelector("#resumeHeroAvatar");
  if (avatarImg) avatarImg.src = sprite("hero", 7);

  const mapGround = win.querySelector("#resumeMapGround");
  if (mapGround) mapGround.style.backgroundImage = `url(${sprite("brick", 3)})`;

  win.querySelectorAll(".resume-coin-img").forEach((img) => {
    img.src = sprite("coin", 2);
  });

  const heroMarker = win.querySelector(".resume-hero-img");
  if (heroMarker) heroMarker.src = sprite("hero", 3);

  const nodeAmrita = win.querySelector('.resume-node[data-n="amrita"] .resume-node-img');
  if (nodeAmrita) nodeAmrita.src = sprite("used", 4);
  const nodeTensor = win.querySelector('.resume-node[data-n="tensor"] .resume-node-img');
  if (nodeTensor) nodeTensor.src = sprite("used", 4);
  const nodePed = win.querySelector('.resume-node[data-n="ped"] .resume-node-img');
  if (nodePed) nodePed.src = sprite("used", 4);
  const nodeNext = win.querySelector('.resume-node[data-n="next"] .resume-node-img');
  if (nodeNext) nodeNext.src = sprite("q", 4);

  const medal1 = win.querySelector("#resumeMedal1");
  if (medal1) medal1.src = sprite("medal", 4);
  const medal2 = win.querySelector("#resumeMedal2");
  if (medal2) medal2.src = sprite("medalB", 4);
  const termIcon = win.querySelector("#resumeTermIcon");
  if (termIcon) termIcon.src = sprite("term", 4);

  // Career Map Stops
  const STOPS = [
    {
      id: "amrita",
      title: "Amrita Vishwa Vidyapeetham",
      meta: "B.Tech Computer Science and Engineering · Aug 2024 – May 2028 · CGPA 8.85 / 10",
      bullets: [
        "Coimbatore, Tamil Nadu",
        "Key Coursework: Data Structures & Algorithms, Object-Oriented Programming, Operating Systems, Database Management Systems, Computer Networks, Distributed Systems."
      ]
    },
    {
      id: "tensor",
      title: "Web Developer · Tensor Club",
      meta: "Amrita student club · Jul 2025 – Apr 2026",
      bullets: [
        "Built the Featured and All Projects pages in React and Tailwind: 99 Lighthouse performance, 0.3s first contentful paint.",
        "Terminal-style cards that look the same on phones and desktops: 98 accessibility, 100 SEO."
      ]
    },
    {
      id: "ped",
      title: "Automation Intern · The Pedagogy Community",
      meta: "Apr 2026 – Jun 2026",
      bullets: [
        "Webinar-to-course AI pipeline: 8 hours down to under 15 minutes.",
        "Audio split into 20-minute chunks run in parallel, timestamps aligned; 5 scenario quizzes per lesson."
      ]
    },
    {
      id: "next",
      title: "SDE Internship · Looking for an internship",
      meta: "Backend, distributed systems, LLM agents",
      bullets: [
        "Looking for a summer internship team to build high-scale systems with.",
        "Open to backend, distributed engineering, and AI agent roles. Email or LinkedIn is the fastest way to reach me."
      ]
    }
  ];

  const dp = win.querySelector("#resumeDp");
  function pickStop(id) {
    const s = STOPS.find((x) => x.id === id);
    if (!s || !dp) return;
    dp.innerHTML = `
      <h4>${s.title}</h4>
      <small>${s.meta}</small>
      <ul>${s.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
    `;
    win.querySelectorAll(".resume-node").forEach((btn) => {
      btn.classList.toggle("sel", btn.dataset.n === id);
    });
  }

  win.querySelectorAll(".resume-node").forEach((btn) => {
    btn.addEventListener("click", () => {
      playPickup();
      pickStop(btn.dataset.n);
    });
  });

  // Default selection: Pedagogy
  pickStop("ped");

  // Inventory Hotbar Slots
  const SKILLS = [
    ["GO", "Go", "GoCDC change-data-capture engine"],
    ["PY", "Python", "Archivist and the automation pipeline"],
    ["TS", "TypeScript", "Dayta front end & SkillUp"],
    ["API", "FastAPI", "Dayta backend & REST services"],
    ["SQL", "PostgreSQL", "GoCDC, WAL logical decoding"],
    ["KFK", "Kafka / Redpanda", "GoCDC event stream"],
    ["RDS", "Redis", "GoCDC fan-out & cache"],
    ["DKR", "Docker", "GoCDC 6-service stack, 20 MB images"],
    ["LG", "LangGraph", "Archivist PR reviewer"]
  ];

  const invContainer = win.querySelector("#resumeInv");
  const tipEl = win.querySelector("#resumeTip");

  if (invContainer) {
    invContainer.innerHTML = SKILLS.map(
      (s, i) => `<button type="button" class="resume-slot" data-s="${i}" aria-label="${s[1]}">${s[0]}</button>`
    ).join("");

    invContainer.addEventListener("mouseover", (e) => {
      const slot = e.target.closest(".resume-slot");
      if (slot && tipEl) {
        const item = SKILLS[+slot.dataset.s];
        if (item) tipEl.textContent = `${item[1]} · ${item[2]}`;
      }
    });

    invContainer.addEventListener("click", (e) => {
      const slot = e.target.closest(".resume-slot");
      if (slot) {
        playPickup();
        const item = SKILLS[+slot.dataset.s];
        if (item && tipEl) tipEl.textContent = `${item[1]} · ${item[2]}`;
        invContainer.querySelectorAll(".resume-slot").forEach((s) => s.classList.toggle("on", s === slot));
      }
    });
  }
}

function initContactConsole(win) {
  const topicChips = win.querySelectorAll(".contact-topic-chip");
  const msgInput = win.querySelector("#contactMessageInput");
  const mailtoLink = win.querySelector("#contactMailtoLink");
  const copyMsgBtn = win.querySelector("#copyMsgBtn");
  const copyEmailBtn = win.querySelector("#copyEmailBtn");

  const TEMPLATES = {
    internship: {
      subj: "SDE Internship Inquiry",
      msg: "Hi Nithin, I saw your portfolio and would like to talk about an SDE internship for Summer 2027."
    },
    project: {
      subj: "Engineering Project Collaboration",
      msg: "Hey Nithin, I came across your GoCDC and Archivist projects and would love to discuss a project collaboration."
    },
    sayhi: {
      subj: "Hello from your portfolio visitor",
      msg: "Loved the NES world and clean retro OS setup of your portfolio! Wanted to drop a quick hello."
    }
  };

  let currentSubj = "SDE Internship Inquiry";

  function syncMailto() {
    if (!mailtoLink || !msgInput) return;
    const body = encodeURIComponent(msgInput.value);
    const subj = encodeURIComponent(currentSubj);
    mailtoLink.href = `mailto:nithin.p.m2006@gmail.com?subject=${subj}&body=${body}`;
  }

  topicChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      playPickup();
      topicChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");

      const topic = chip.dataset.topic || "internship";
      const t = TEMPLATES[topic] || TEMPLATES.internship;
      currentSubj = t.subj;
      if (msgInput) {
        msgInput.value = t.msg;
      }
      syncMailto();
    });
  });

  if (msgInput) {
    msgInput.addEventListener("input", syncMailto);
  }

  if (copyMsgBtn && msgInput) {
    copyMsgBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(msgInput.value).then(() => {
        playPickup();
        const orig = copyMsgBtn.textContent;
        copyMsgBtn.textContent = "✓ Copied!";
        setTimeout(() => { copyMsgBtn.textContent = orig; }, 2000);
      });
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = copyEmailBtn.dataset.email || "nithin.p.m2006@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        playPickup();
        const orig = copyEmailBtn.textContent;
        copyEmailBtn.textContent = "✓ copied!";
        setTimeout(() => { copyEmailBtn.textContent = orig; }, 2000);
      });
    });
  }
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
  if (containerEl && win.parentElement === containerEl && containerEl.lastElementChild !== win) {
    containerEl.appendChild(win);
  }

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

// Master-detail interactive handler for Projects Window
const PROJECTS_DATA = {
  gocdc: {
    title: "GOCDC · HIGH-THROUGHPUT CDC ENGINE",
    status: "SHIPPED",
    statusColor: "green",
    shot: "assets/shots/gocdc.png",
    desc: "A change data capture engine written in Go. Reads the PostgreSQL write-ahead log directly via the pgoutput logical replication plugin, decodes row-level insert/update/delete events, and streams them into Kafka topics with sub-150ms replication lag. Built to understand how production pipelines handle crash recovery and backpressure.",
    metrics: [
      { val: "1,400 ev/s", lbl: "THROUGHPUT" },
      { val: "<150ms", lbl: "SYNC LAG" },
      { val: "0", lbl: "LOST EVENTS" }
    ],
    stack: ["Go (Golang)", "PostgreSQL WAL", "Kafka", "Docker"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/Nithin0306/gocdc" }
    ]
  },
  archivist: {
    title: "ARCHIVIST · AI PR REVIEWER",
    status: "ACTIVE",
    statusColor: "green",
    shot: "assets/shots/archivist.png",
    desc: "A GitHub Action that catches architectural drift before merge. When a pull request is opened, Archivist parses the diff, queries the repo ADRs using LangGraph, checks whether the change violates team conventions (or leaks secrets), and posts inline review comments within 60 seconds.",
    metrics: [
      { val: "<60s", lbl: "FEEDBACK" },
      { val: "100%", lbl: "ADR REVIEWS" },
      { val: "0", lbl: "SECRET LEAKS" }
    ],
    stack: ["Python", "LangGraph", "GitHub Actions", "OpenAI API"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/Nithin0306/archivist" }
    ]
  },
  dayta: {
    title: "DAYTA · AI DOCUMENT ASSISTANT",
    status: "LIVE",
    statusColor: "gold",
    shot: "assets/shots/dayta.png",
    desc: "A retrieval-augmented generation app that indexes documents into Pinecone, performs hybrid search, and answers questions with direct citations. Built with conversational memory so follow-up questions stay in context.",
    metrics: [
      { val: "<1s", lbl: "QUERY TIME" },
      { val: "Pinecone", lbl: "VECTOR DATABASE" },
      { val: "100%", lbl: "SOURCED CITATIONS" }
    ],
    stack: ["FastAPI", "Pinecone", "LangChain", "React"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/Nithin0306/dayta" }
    ]
  },
  skillup: {
    title: "SKILLUP · CAREER PATH NAVIGATOR",
    status: "AWARDED",
    statusColor: "gold",
    shot: "assets/shots/skillup.png",
    desc: "Parses job descriptions, compares required skills against what you already know, and generates a sequenced learning path. Won 2nd place out of 30+ teams at Hack101.",
    metrics: [
      { val: "2ND", lbl: "HACK101 RUNNER-UP" },
      { val: "30+", lbl: "COMPETING TEAMS" },
      { val: "36H", lbl: "HACKATHON SPRINT" }
    ],
    stack: ["TypeScript", "Next.js", "Gemini API", "Tailwind CSS"],
    links: [
      { label: "Source Code ↗", href: "https://github.com/Nithin0306/skillup" }
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
