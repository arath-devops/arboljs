const CM_TO_PX = 96 / 2.54;
const HEART_ADD_WIDTH_CM = 7;
const HEART_ADD_HEIGHT_CM = 4;
const HEART_ADD_WIDTH_PX = HEART_ADD_WIDTH_CM * CM_TO_PX;
const HEART_ADD_HEIGHT_PX = HEART_ADD_HEIGHT_CM * CM_TO_PX;
const HEART_NORM_WIDTH = 2.6;
const HEART_NORM_HEIGHT = 2.35;
const HEART_BASE_SCALE = 112;

const HEART_SHAPE = {
  centerX: 210,
  centerY: 208,
  scaleX: HEART_BASE_SCALE + HEART_ADD_WIDTH_PX / HEART_NORM_WIDTH,
  scaleY: HEART_BASE_SCALE + HEART_ADD_HEIGHT_PX / HEART_NORM_HEIGHT,
};

const HEART_Y_OFFSET = 0.16;
const HEART_TOP_EXTENT = 1.12;
const HEART_BOTTOM_EXTENT = 1.14;

const TARGET_HEARTS = 580;
const INITIAL_FILL_MS = 2000;
const CHAIN_INTERVAL_MS = 42;

const DESIGN_W = 420;
const DESIGN_H = 580;

function updateSceneScale() {
  const paddingX = 24;
  const paddingY = window.innerWidth <= 480 ? 72 : 88;
  const scaleX = (window.innerWidth - paddingX) / DESIGN_W;
  const scaleY = (window.innerHeight - paddingY) / DESIGN_H;
  const scale = Math.min(1, scaleX, scaleY);
  document.documentElement.style.setProperty("--scene-scale", String(scale));
}

function getPerformanceProfile() {
  const narrow = window.innerWidth <= 480;
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
  return narrow || lowMemory ? "mobile" : "desktop";
}

let performanceProfile = getPerformanceProfile();

function refreshPerformanceProfile() {
  performanceProfile = getPerformanceProfile();
  if (performanceProfile === "mobile") {
    document.documentElement.classList.add("mobile");
  } else {
    document.documentElement.classList.remove("mobile");
  }
}

updateSceneScale();
refreshPerformanceProfile();
window.addEventListener("resize", () => {
  updateSceneScale();
  refreshPerformanceProfile();
});
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    updateSceneScale();
    refreshPerformanceProfile();
  }, 150);
});

const BOUNDS = {
  minX: HEART_SHAPE.centerX - HEART_SHAPE.scaleX * 1.06,
  maxX: HEART_SHAPE.centerX + HEART_SHAPE.scaleX * 1.06,
  minY: HEART_SHAPE.centerY - HEART_SHAPE.scaleY * HEART_TOP_EXTENT,
  maxY: HEART_SHAPE.centerY + HEART_SHAPE.scaleY * HEART_BOTTOM_EXTENT,
};

const layer = document.getElementById("heartsLayer");
const activeHearts = [];

function isInsideHeart(px, py) {
  const x = (px - HEART_SHAPE.centerX) / HEART_SHAPE.scaleX;
  const y = -(py - HEART_SHAPE.centerY) / HEART_SHAPE.scaleY + HEART_Y_OFFSET;
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
}

function randomPosition() {
  for (let i = 0; i < 80; i++) {
    const left = BOUNDS.minX + Math.random() * (BOUNDS.maxX - BOUNDS.minX);
    const top = BOUNDS.minY + Math.random() * (BOUNDS.maxY - BOUNDS.minY);

    if (!isInsideHeart(left, top)) {
      continue;
    }

    const dx = left - HEART_SHAPE.centerX;
    const dy = top - HEART_SHAPE.centerY;
    const angle = Math.atan2(dy, dx);
    const flyDist = 50 + Math.random() * 85;

    return {
      top: Math.round(top),
      left: Math.round(left),
      tx: Math.round(Math.cos(angle) * flyDist),
      ty: Math.round(Math.sin(angle) * flyDist - 40),
      rot: Math.round(-35 + Math.random() * 70) + "deg",
      scale: 0.75 + Math.random() * 0.28,
    };
  }

  return {
    top: HEART_SHAPE.centerY,
    left: HEART_SHAPE.centerX,
    tx: 0,
    ty: -80,
    rot: "0deg",
    scale: 0.85,
  };
}

function buildInitialPositions() {
  const positions = [];
  let attempts = 0;

  while (positions.length < TARGET_HEARTS && attempts < TARGET_HEARTS * 40) {
    attempts++;
    const pos = randomPosition();
    if (isInsideHeart(pos.left, pos.top)) {
      positions.push(pos);
    }
  }

  return positions;
}

const HEART_COLORS = ["#FE5F6A", "#FF3046", "#FF0022"];

function pickHeartColors() {
  const a = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  let b = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
  if (a === b) {
    b = HEART_COLORS[(HEART_COLORS.indexOf(a) + 1) % HEART_COLORS.length];
  }
  return { a, b };
}

function mountHeart(pos) {
  const el = document.createElement("div");
  const colors = pickHeartColors();
  el.className = "heart appear";
  el.style.top = pos.top + "px";
  el.style.left = pos.left + "px";
  el.style.setProperty("--tx", pos.tx + "px");
  el.style.setProperty("--ty", pos.ty + "px");
  el.style.setProperty("--rot", pos.rot);
  el.style.setProperty("--scale", pos.scale);
  el.style.setProperty("--heart-a", colors.a);
  el.style.setProperty("--heart-b", colors.b);
  layer.appendChild(el);
  return { el, pos };
}

function flyHeart(entry) {
  entry.el.classList.remove("appear");
  entry.el.classList.add("fly");
  entry.el.addEventListener(
    "animationend",
    () => {
      entry.el.remove();
    },
    { once: true }
  );
}

function spawnHeart(pos) {
  const entry = mountHeart(pos);
  activeHearts.push(entry);
  return entry;
}

async function fillHeartCompletely() {
  const positions = buildInitialPositions();

  await Promise.all(
    positions.map(
      (pos) =>
        new Promise((resolve) => {
          setTimeout(() => {
            spawnHeart(pos);
            resolve();
          }, Math.random() * INITIAL_FILL_MS);
        })
    )
  );

  await new Promise((r) => setTimeout(r, 500));
}

function startInfiniteChain() {
  const tick = () => {
    if (activeHearts.length === 0) {
      spawnHeart(randomPosition());
      setTimeout(tick, CHAIN_INTERVAL_MS);
      return;
    }

    const index = Math.floor(Math.random() * activeHearts.length);
    const departing = activeHearts.splice(index, 1)[0];

    flyHeart(departing);
    spawnHeart(randomPosition());

    const jitter = Math.random() * 18 - 9;
    setTimeout(tick, CHAIN_INTERVAL_MS + jitter);
  };

  tick();
}

async function start() {
  updateSceneScale();
  await fillHeartCompletely();
  startInfiniteChain();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
