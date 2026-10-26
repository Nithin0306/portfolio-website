/**
 * WORLD//CLI: Sprite Engine
 * Draws crisp pixel art from character text maps via HTML5 Canvas.
 * No external image libraries, pure vanilla JavaScript.
 */

export const PAL = {
  k: "#1a1208", // ink
  K: "#0e1f14", // dark monitor screen
  g: "#8be28b", // bright terminal green
  r: "#ff5c5c", // red
  n: "#3a5bd9", // blue
  y: "#f5c451", // gold/yellow
  w: "#fff1b8", // pale highlight
  o: "#b5542a", // question block border orange
  c: "#a8742f", // wood / used block
  C: "#6e4817", // dark wood / used outline
  b: "#c84c0c", // brick
  B: "#7a2a00", // brick dark
  d: "#5a1d00", // earth dark
  u: "#1d4fd8", // underground blue brick
  U: "#0b2570", // underground dark
  s: "#b4b4b8", // castle stone
  S: "#7a7a80", // stone dark
  G: "#8d8f94", // metal / chain grey
  W: "#f2f0e8", // paper white
  D: "#5a1420"  // curtain dark (for cinema seats)
};

export const MAPS = {
  brick: [
    "bbbbBbbb",
    "bbbbBbbb",
    "BBBBBBBB",
    "bBbbbbbb",
    "bBbbbbbb",
    "BBBBBBBB",
    "bbbbBbbb",
    "bbbbBbbb"
  ],
  earth: [
    "BBBBdBBB",
    "BBBBdBBB",
    "dddddddd",
    "BdBBBBBB",
    "BdBBBBBB",
    "dddddddd",
    "BBBBdBBB",
    "BBBBdBBB"
  ],
  ubrick: [
    "uuuuUuuu",
    "uuuuUuuu",
    "UUUUUUUU",
    "uUuuuuuu",
    "uUuuuuuu",
    "UUUUUUUU",
    "uuuuUuuu",
    "uuuuUuuu"
  ],
  q: [
    "kooooook",
    "oyykkyyo",
    "oykyykyo",
    "oyyyykyo",
    "oyyykyyo",
    "oyyyyyyo",
    "oyyykyyo",
    "kooooook"
  ],
  used: [
    "CCCCCCCC",
    "CccccccC",
    "CccccccC",
    "CccccccC",
    "CccccccC",
    "CccccccC",
    "CccccccC",
    "CCCCCCCC"
  ],
  hero: [
    "kkkkkkkkkk",
    "kKKKKKKKKk",
    "kKgKKKKKKk",
    "kKKgKKKKKk",
    "kKgKKggKKk",
    "kkkkkkkkkk",
    "..rrrrrr..",
    ".rrrrrrrr.",
    ".rrrrrrrr.",
    "..nnnnnn..",
    "..nn..nn..",
    ".kkk..kkk."
  ],
  bulb: [
    "..kkkk..",
    ".kyyyyk.",
    ".kywyyk.",
    ".kyyyyk.",
    "..kyyk..",
    "..kkkk..",
    "..kGGk..",
    "...kk..."
  ],
  term: [
    "kkkkkkkk",
    "kKKKKKKk",
    "kKgKKKKk",
    "kKKgKKKk",
    "kKgKKggk",
    "kKKKKKKk",
    "kkkkkkkk",
    "........"
  ],
  trophy: [
    "kyyyyyyk",
    "kywyyyyk",
    ".kyyyyk.",
    "..kyyk..",
    "...kk...",
    "...yy...",
    "..kyyk..",
    ".kkkkkk."
  ],
  gear: [
    "...GG...",
    ".G.GG.G.",
    "..GGGG..",
    "GGG..GGG",
    "GGG..GGG",
    "..GGGG..",
    ".G.GG.G.",
    "...GG..."
  ],
  doc: [
    ".kkkkkk.",
    ".kWWWWk.",
    ".kWkkWk.",
    ".kWWWWk.",
    ".kWkkkk.",
    ".kWWWWk.",
    ".kWkkWk.",
    ".kkkkkk."
  ],
  castle: [
    "s.s.s..s.s.s",
    "ssssssssssss",
    "ssSSssssSSss",
    "ssssssssssss",
    "ssssskksssss",
    "ssssskksssss",
    "ssssskksssss"
  ],
  flag: [
    "kggggg..",
    "kgggggg.",
    "kggggg..",
    "kgggg...",
    "k.......",
    "k.......",
    "k.......",
    "k.......",
    "k......."
  ],
  pipe: [
    "kkkkkkkkkkkk",
    "kggggggggggk",
    "kggKggggggggk",
    "kkkkkkkkkkkk",
    ".kggggggggk.",
    ".kggKgggggk.",
    ".kggKgggggk.",
    ".kggKgggggk."
  ],
  fish: [
    "..kkoo...",
    ".koooook.",
    "kooowkoko",
    "koooooook",
    ".kkooook.",
    "...kkk..."
  ],
  seat: [
    "..DDDD..",
    ".DDDDDD.",
    ".DDDDDD.",
    ".DDDDDD.",
    "DDDDDDDD",
    "D.DDDD.D",
    "D......D"
  ],
  card: [
    "kkkkkkkk",
    "kWWWWWWk",
    "kWkkkkWk",
    "kWWWWWWk",
    "kWkkkkWk",
    "kWWWWWWk",
    "kkkkkkkk"
  ],
  chain: [
    "..GG..",
    "..GG..",
    ".G..G.",
    ".G..G.",
    "..GG..",
    "..GG.."
  ]
};

const cache = new Map();

export function dataURL(rows, scale) {
  const key = `${rows.join("|")}@${scale}`;
  if (cache.has(key)) return cache.get(key);

  const c = document.createElement("canvas");
  c.width = rows[0].length * scale;
  c.height = rows.length * scale;
  const ctx = c.getContext("2d");
  
  rows.forEach((r, y) => {
    [...r].forEach((ch, x) => {
      if (PAL[ch]) {
        ctx.fillStyle = PAL[ch];
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    });
  });

  const url = c.toDataURL();
  cache.set(key, url);
  return url;
}

export const sprite = (name, scale = 4) => {
  if (!MAPS[name]) {
    console.error(`Sprite "${name}" not found in MAPS`);
    return "";
  }
  return dataURL(MAPS[name], scale);
};

export const tile = (name, scale = 3) => `url(${sprite(name, scale)})`;
