/**
 * WORLD//CLI: Hash Router
 * Handles client-side hash routing and deep linking.
 * Pages now open as retro OS windows over the Mario surface world.
 */

import { openWindow } from "./windows.js?v=24";

export const PAGES = new Set([
  "about",
  "projects",
  "awards",
  "experience",
  "resume",
  "contact"
]);

const TITLES = {
  about: "About",
  projects: "Projects",
  awards: "Awards",
  experience: "Experience",
  resume: "Resume",
  contact: "Contact",
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
  const { page } = parse(location.hash);

  if (!page) {
    // Root — no window to open, world stays visible
    document.title = DEFAULT_TITLE;
    return;
  }

  const id = PAGES.has(page) ? page : null;
  if (!id) return;

  openWindow(id);
  document.title = `${titleFor(id)} · Nithin`;
}

export function initRouter() {
  window.addEventListener("hashchange", route);
  // Execute route immediately to support direct deep linking
  route();
}
