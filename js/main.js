// Main Bootloader: initializes world, windows, router

import { initWorld } from "./world.js?v=26";
import { initWindows, openWindow } from "./windows.js?v=26";
import { initRouter } from "./router.js?v=26";

document.addEventListener("DOMContentLoaded", () => {
  // Boot sequence: world -> windows -> router
  initWorld();
  initWindows();
  initRouter();

  // Handle clicks on sign chips and buttons that link to sections
  document.addEventListener("click", (e) => {
    const btnSign = e.target.closest(".btn-sign");
    if (btnSign) {
      const href = btnSign.getAttribute("href") || "";
      if (href.startsWith("#")) {
        const id = href.replace(/^#\/?/, "");
        if (id && id !== "/") {
          e.preventDefault();
          openWindow(id);
        }
      }
      return;
    }

    const chip = e.target.closest(".chip");
    if (chip) {
      const href = chip.getAttribute("href") || "";
      const id = href.replace(/^#\/?/, "");
      if (id) {
        e.preventDefault();
        openWindow(id);
      }
      return;
    }
  });
});
