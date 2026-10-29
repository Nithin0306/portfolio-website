// Main Bootloader: initializes world, room, router

import { initWorld, visit } from "./world.js?v=8";
import { initRoom } from "./room.js?v=8";
import { initRouter } from "./router.js?v=8";

document.addEventListener("DOMContentLoaded", () => {
  // Boot sequence: sprites -> world -> room -> router
  initWorld();
  initRoom();
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
});
