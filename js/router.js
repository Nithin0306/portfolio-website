/**
 * WORLD//CLI: Hash Router (Phase 8)
 * Handles client-side hash routing, document titles,
 * deep linking, and transitions between surface and underground.
 */

import { show, up } from "./room.js";

export const PAGES = new Set([
  "about",
  "projects",
  "awards",
  "experience",
  "resume",
  "contact",
  "skillup",
  "groupflix",
  "fishglob",
  "neoflash",
  "help",
  "map"
]);

const TITLES = {
  about: "About",
  projects: "Projects",
  skillup: "SkillUp (Level 1-1)",
  groupflix: "GroupFlix (Level 1-2)",
  fishglob: "FishGlob (Level 1-3)",
  neoflash: "NeoFlash (Level 2-1)",
  awards: "Awards",
  experience: "Experience",
  resume: "Resume",
  contact: "Contact",
  help: "Terminal Help",
  map: "World Map",
  error: "Command Not Found"
};

const DEFAULT_TITLE = "Nithin · Software engineer in the making";

export function parse(hash) {
  const p = hash.replace(/^#\/?/, "").split("/");
  return { page: p[0] || "", sub: p[1] || "" };
}

export function titleFor(id) {
  return TITLES[id] || "Terminal";
}

export function route() {
  const { page, sub } = parse(location.hash);
  const sceneEl = document.getElementById("world");

  if (!page) {
    up();
    document.title = DEFAULT_TITLE;
    return;
  }

  const id = sub || page;
  const targetId = PAGES.has(id) ? id : "error";

  show(targetId);

  if (sceneEl) {
    sceneEl.classList.add("down");
  }

  document.title = `${titleFor(targetId)} · Nithin`;
}

export function initRouter() {
  window.addEventListener("hashchange", route);
  // Execute route immediately to support direct deep linking
  route();
}
