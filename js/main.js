/**
 * WORLD//CLI: Main Entry Point
 * Initializes sprites, world scene, and event listeners.
 */

import { initWorld, visit } from "./world.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize surface world scene (Phases 4 - 6)
  initWorld();

  // Handle direct sign chip & button clicks with hero movement
  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) {
      const href = chip.getAttribute("href") || "";
      const id = href.replace(/^#\/?/, "");
      if (id) {
        e.preventDefault();
        visit(id);
      }
      return;
    }

    const btnSign = e.target.closest(".btn-sign");
    if (btnSign) {
      const href = btnSign.getAttribute("href") || "";
      if (href.startsWith("#")) {
        const id = href.replace(/^#\/?/, "");
        if (id) {
          e.preventDefault();
          visit(id);
        }
      }
      return;
    }
  });

  // Handle form prompt enter on surface
  const form1 = document.getElementById("f1");
  if (form1) {
    form1.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form1.querySelector("input");
      if (!input) return;
      const val = input.value.trim().toLowerCase();
      input.value = "";
      if (val) {
        const cleaned = val.replace(/^(cd|cat|open|ls|goto)\s+/, "").replace(/^projects\//, "");
        visit(cleaned);
      }
    });
  }
});
