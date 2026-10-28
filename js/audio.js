let ctx = null;
let soundEnabled = false;

try {
  soundEnabled = localStorage.getItem("world_sfx") === "1";
} catch {
  soundEnabled = false;
}

function getAudioContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem("world_sfx", soundEnabled ? "1" : "0");
  } catch {}
  if (soundEnabled) {
    getAudioContext();
    playPickup();
  }
  updateSoundButton();
  return soundEnabled;
}

export function updateSoundButton() {
  const btn = document.getElementById("soundToggle");
  if (btn) {
    btn.textContent = soundEnabled ? "SFX: ON" : "SFX: OFF";
    btn.setAttribute("aria-pressed", String(soundEnabled));
    btn.classList.toggle("on", soundEnabled);
  }
}

function tone(freq, start, duration, type = "square", endFreq = null, vol = 0.12) {
  const ac = getAudioContext();
  if (!ac) return;
  const now = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + duration);
}

export function playBump() {
  if (!soundEnabled) return;
  tone(140, 0, 0.1, "square", 320, 0.12);
}

export function playPickup() {
  if (!soundEnabled) return;
  tone(988, 0, 0.08, "square", null, 0.12);
  tone(1319, 0.08, 0.28, "square", null, 0.12);
}

export function playVictory() {
  if (!soundEnabled) return;
  [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => tone(f, i * 0.11, 0.2, "square", null, 0.14));
}

