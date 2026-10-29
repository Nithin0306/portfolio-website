// Projects Module: mounts interactive themed mini-worlds (Dayta, Archivist, GoCDC, SkillUp)

import { sprite } from "./sprites.js?v=7";

export function mountProjectWorld(projectId, cardEl) {
  const existingBand = cardEl.querySelector(".world-band");
  if (existingBand) existingBand.remove();

  const band = document.createElement("div");
  band.className = `world-band theme-${getProjectTheme(projectId)}`;

  switch (projectId) {
    case "dayta":
      renderDaytaBand(band);
      break;
    case "archivist":
      renderArchivistBand(band);
      break;
    case "gocdc":
      renderGoCdcBand(band);
      break;
    case "skillup":
      renderSkillUpBand(band);
      break;
    default:
      renderDefaultBand(band);
  }

  // Prepend world band before first element of the card
  cardEl.insertBefore(band, cardEl.firstChild);
}

function getProjectTheme(id) {
  const themes = {
    dayta: "study",
    archivist: "cinema",
    gocdc: "water",
    skillup: "gap"
  };
  return themes[id] || "study";
}

function renderDaytaBand(band) {
  band.innerHTML = `
    <div class="study-floor"></div>
    <div class="doc-node n1">PDF: Timetable.pdf</div>
    <div class="doc-node n2">Pinecone 768-d</div>
    <div class="doc-node n3">Gemini RAG</div>
    <img class="band-hero" src="${sprite("hero", 4)}" alt="Developer hero">
  `;
}

function renderArchivistBand(band) {
  band.innerHTML = `
    <div class="curtain-left"></div>
    <div class="curtain-right"></div>
    <div class="cinema-screen">
      <span style="color:#7a1f2b; margin-bottom:4px;">[LangGraph MCP Agent]</span>
      <span>PARSING PR DIFF #42</span>
      <span style="color:#10b981; margin-top:4px;">100% ADR ENFORCED</span>
    </div>
    <div class="seats-row"></div>
    <img class="band-hero" src="${sprite("hero", 4)}" alt="Developer hero" style="bottom:12px; left:20px;">
  `;
}

function renderGoCdcBand(band) {
  band.innerHTML = `
    <div class="water-band w1">
      <span class="stream-arrow">PostgreSQL WAL >>> Logical Decoding >>></span>
    </div>
    <div class="water-band w2">
      <span class="stream-arrow">Apache Kafka >>> 1,400 events/sec sustained >>></span>
    </div>
    <div class="water-band w3">
      <span class="stream-arrow">Polyglot Sink >>> Redis Cache + MongoDB Document Store >>></span>
    </div>
    <img class="band-hero" src="${sprite("hero", 4)}" alt="Developer hero" style="bottom:8px; left:24px;">
  `;
}

function renderSkillUpBand(band) {
  band.innerHTML = `
    <div class="ledge left-ledge">
      <span class="ledge-tag">YOU ARE HERE</span>
    </div>
    <div class="stepping-blocks">
      <span class="step-block">Python</span>
      <span class="step-block">Systems</span>
      <span class="step-block">FastAPI</span>
    </div>
    <div class="ledge right-ledge">
      <span class="ledge-tag">TARGET ROLE</span>
    </div>
    <button class="cross-gap-btn">Cross the gap ▸</button>
    <img class="band-hero" id="gapHero" src="${sprite("hero", 4)}" alt="Developer hero">
  `;

  const btn = band.querySelector(".cross-gap-btn");
  const hero = band.querySelector("#gapHero");

  if (btn && hero) {
    btn.addEventListener("click", () => {
      btn.disabled = true;
      btn.textContent = "Crossing...";
      hero.style.transform = "translate(160px, -36px)";
      setTimeout(() => {
        hero.style.transform = "translate(340px, -40px)";
      }, 500);
      setTimeout(() => {
        hero.style.transform = "translate(520px, 0px)";
        btn.textContent = "Goal reached!";
      }, 1000);
      setTimeout(() => {
        hero.style.transform = "translate(0px, 0px)";
        btn.disabled = false;
        btn.textContent = "Cross the gap ▸";
      }, 3500);
    });
  }
}

function renderDefaultBand(band) {
  band.innerHTML = `
    <img class="band-hero" src="${sprite("hero", 4)}" alt="Developer hero">
  `;
}
