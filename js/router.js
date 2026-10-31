/**
 * WORLD//CLI: Hash Router (Phase 8)
 * Handles client-side hash routing, document titles,
 * deep linking, and transitions between surface and underground.
 */

import { show, up } from "./room.js?v=14";

export const PAGES = new Set([
  "about",
  "projects",
  "awards",
  "experience",
  "resume",
  "contact",
  "map"
]);

const TITLES = {
  about: "About",
  projects: "Projects",
  awards: "Awards",
  experience: "Experience",
  resume: "Resume",
  contact: "Contact",
  map: "World Map",
  error: "Page Not Found"
};

const DEFAULT_TITLE = "Nithin · Software engineer in the making";

export function parse(hash) {
  const p = hash.replace(/^#\/?/, "").split("/");
  return { page: p[0] || "", sub: p[1] || "" };
}

export function titleFor(id) {
  return TITLES[id] || "Portfolio";
}

export function route() {
  const { page, sub } = parse(location.hash);
  const sceneEl = document.getElementById("world");

  if (!page) {
    up();
    document.title = DEFAULT_TITLE;
    return;
  }

  // Route to the section (all projects live under single 'projects' page)
  const id = page === "projects" ? "projects" : (PAGES.has(page) ? page : (PAGES.has(sub) ? sub : "error"));
  const targetId = PAGES.has(id) ? id : "error";

  show(targetId);

  if (sub && page === "projects") {
    // If anchored to a specific project like #/projects/dayta, scroll to it
    setTimeout(() => {
      const targetCard = document.getElementById(`proj-${sub}`);
      if (targetCard) targetCard.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }

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
