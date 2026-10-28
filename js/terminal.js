// Terminal Parser: command runner, history, tab completion, toast notices

import { visit } from "./world.js";

const ALIASES = {
  achievements: "awards",
  exp: "experience",
  castle: "contact",
  cv: "resume",
  bio: "about",
  work: "experience"
};

const COMMANDS = [
  "help",
  "about",
  "projects",
  "awards",
  "experience",
  "resume",
  "contact",
  "dayta",
  "archivist",
  "gocdc",
  "skillup",
  "whoami",
  "hire",
  "map",
  "clear",
  "exit",
  "surface"
];

const history = [];
let historyIndex = -1;

export function run(raw) {
  let c = raw.trim().toLowerCase()
    .replace(/^(cd|cat|open|ls|goto)\s+/, "")
    .replace(/^projects\//, "")
    .replace(/\/$/, "")
    .replace(/\.(md|pdf)$/, "");

  if (!c) return;

  // Add to history
  if (history[history.length - 1] !== raw) {
    history.push(raw);
  }
  historyIndex = history.length;

  // Check aliases
  c = ALIASES[c] || c;

  const isUnderground = Boolean(document.getElementById("world")?.classList.contains("down"));

  if (["exit", "..", "back", "up", "surface"].includes(c)) {
    location.hash = "#/";
    return;
  }

  if (c === "clear") {
    clearToast();
    return;
  }

  if (c === "whoami") {
    toast("nithin: CSE student @ Amrita, SDE intern, Hack101 runner-up");
    return;
  }

  if (c === "hire") {
    toast("permission granted. opening contact...");
    setTimeout(() => {
      if (isUnderground) {
        location.hash = "#/contact";
      } else {
        visit("contact");
      }
    }, 400);
    return;
  }

  if (c === "resume") {
    toast("opening resume.pdf...");
    window.open("assets/resume.pdf", "_blank");
    return;
  }

  if (["dayta", "archivist", "gocdc", "skillup"].includes(c)) {
    location.hash = `#/projects/${c}`;
    return;
  }

  if (["about", "projects", "awards", "experience", "contact", "help", "map"].includes(c)) {
    if (isUnderground) {
      location.hash = `#/${c}`;
    } else {
      visit(c);
    }
    return;
  }

  // Unknown command
  toast(`command not found: "${raw}". Type "help"`);
  location.hash = `#/error`;
}

export function toast(msg) {
  clearToast();

  const scene = document.getElementById("world");
  if (!scene) return;

  const toastEl = document.createElement("div");
  toastEl.className = "toast-notice";
  toastEl.setAttribute("role", "status");
  toastEl.textContent = msg;

  scene.appendChild(toastEl);

  setTimeout(() => {
    if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
  }, 3200);
}

function clearToast() {
  const existing = document.querySelector(".toast-notice");
  if (existing) existing.remove();
}

export function initTerminal() {
  const inputs = document.querySelectorAll(".prompt input");

  inputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      // Arrow Up: Previous history
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length > 0 && historyIndex > 0) {
          historyIndex--;
          input.value = history[historyIndex];
        }
      }
      // Arrow Down: Next history
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          historyIndex++;
          input.value = history[historyIndex];
        } else {
          historyIndex = history.length;
          input.value = "";
        }
      }
      // Tab: Autocomplete
      else if (e.key === "Tab") {
        e.preventDefault();
        const cur = input.value.trim().toLowerCase();
        if (!cur) return;
        const match = COMMANDS.find((cmd) => cmd.startsWith(cur));
        if (match) {
          input.value = match;
        }
      }
    });
  });

  // Global '/' key triggers prompt focus
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      const isUnderground = document.getElementById("world")?.classList.contains("down");
      const activePrompt = isUnderground
        ? document.querySelector("#f2 input")
        : document.querySelector("#f1 input");
      if (activePrompt) activePrompt.focus();
    }
  });
}
