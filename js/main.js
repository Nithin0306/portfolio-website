// Main Bootloader: initializes world, room, terminal, router

import { initWorld, visit } from "./world.js";
import { initRoom } from "./room.js";
import { initRouter } from "./router.js";
import { initTerminal, run } from "./terminal.js";

document.addEventListener("DOMContentLoaded", () => {
  // Boot sequence: sprites -> world -> room -> terminal -> router
  initWorld();
  initRoom();
  initTerminal();
  initRouter();

  // Handle clicks on sign chips and buttons
  document.addEventListener("click", (e) => {
    // Check if click is on surface layer (don't intercept underground links)
    const isUnderground = Boolean(e.target.closest("#under"));

    const chip = e.target.closest(".chip");
    if (chip && !isUnderground) {
      const href = chip.getAttribute("href") || "";
      const id = href.replace(/^#\/?/, "");
      if (id) {
        e.preventDefault();
        visit(id);
      }
      return;
    }

    const btnSign = e.target.closest(".btn-sign");
    if (btnSign && !isUnderground) {
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

  // Handle surface prompt submission #f1 via unified terminal runner
  const form1 = document.getElementById("f1");
  if (form1) {
    form1.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form1.querySelector("input");
      if (!input) return;
      const val = input.value;
      input.value = "";
      if (val.trim()) {
        run(val);
      }
    });
  }
});
