const SHAPES = ["circle", "square", "triangle", "star", "rectangle"];
const COLORS = ["red", "blue", "terracotta"];

const LEVEL_DIMS = {
  1: {
    count: 6,
    targetCount: 3,
    shapes: ["circle", "square"],
    colors: ["red", "terracotta"],
    allowColorRule: false,
    timeLimitMs: null,
  },
  2: {
    count: 8,
    targetCount: 3,
    shapes: ["circle", "square", "triangle"],
    colors: ["red", "blue", "terracotta"],
    allowColorRule: true,
    timeLimitMs: null,
  },
  3: {
    count: 9,
    targetCount: 3,
    shapes: ["circle", "square", "triangle", "star"],
    colors: ["red", "blue", "terracotta"],
    allowColorRule: true,
    timeLimitMs: null,
  },
  4: {
    count: 12,
    targetCount: 4,
    shapes: SHAPES,
    colors: COLORS,
    allowColorRule: true,
    timeLimitMs: null,
  },
  5: {
    count: 16,
    targetCount: 5,
    shapes: SHAPES,
    colors: COLORS,
    allowColorRule: true,
    timeLimitMs: 25000,
  },
};

const SHAPE_INSTRUCTIONS = {
  circle: { en: "Tap all the circles", hi: "सभी गोल आकार छुएँ" },
  square: { en: "Tap all the squares", hi: "सभी वर्ग छुएँ" },
  triangle: { en: "Tap all the triangles", hi: "सभी त्रिभुज छुएँ" },
  star: { en: "Tap all the stars", hi: "सभी तारे छुएँ" },
  rectangle: { en: "Tap all the rectangles", hi: "सभी आयत छुएँ" },
};

const COLOR_INSTRUCTIONS = {
  red: { en: "Find all the red objects", hi: "सभी लाल चीज़ें ढूँढें" },
  blue: { en: "Find all the blue shapes", hi: "सभी नीले आकार ढूँढें" },
  terracotta: { en: "Tap all the orange shapes", hi: "सभी नारंगी आकार छुएँ" },
};

export function matchesRule(item, rule) {
  if (rule.kind === "shape") return item.shape === rule.value;
  if (rule.kind === "color") return item.color === rule.value;
  return false;
}

export function buildShapeSortRound(level) {
  const dim = LEVEL_DIMS[level] || LEVEL_DIMS[1];
  const rule = pickRule(dim);
  const raw = [];

  for (let i = 0; i < dim.targetCount; i += 1) {
    raw.push(makeTargetItem(dim, rule));
  }
  while (raw.length < dim.count) {
    raw.push(makeDistractorItem(dim, rule));
  }

  const items = shuffle(raw).map((item, i) => ({ ...item, id: `item_${i}` }));
  const targetIds = items.filter((item) => matchesRule(item, rule)).map((item) => item.id);

  const spec = {
    level,
    rule,
    timeLimitMs: dim.timeLimitMs,
    instruction: rule.instruction,
    targetCount: targetIds.length,
  };

  return { spec, items, targetIds };
}

function makeTargetItem(dim, rule) {
  if (rule.kind === "shape") {
    return { shape: rule.value, color: pick(dim.colors) };
  }
  return { shape: pick(dim.shapes), color: rule.value };
}

function makeDistractorItem(dim, rule) {
  let candidate = randomItem(dim);
  let guard = 0;
  while (matchesRule(candidate, rule) && guard < 40) {
    candidate = randomItem(dim);
    guard += 1;
  }
  if (matchesRule(candidate, rule)) {
    if (rule.kind === "shape") {
      const other = dim.shapes.find((s) => s !== rule.value) || "square";
      return { shape: other, color: pick(dim.colors) };
    }
    const other = dim.colors.find((c) => c !== rule.value) || "terracotta";
    return { shape: pick(dim.shapes), color: other };
  }
  return candidate;
}

function pickRule(dim) {
  const colorRule = dim.allowColorRule && Math.random() < 0.5;
  if (colorRule) {
    const value = pick(dim.colors);
    return { kind: "color", value, instruction: COLOR_INSTRUCTIONS[value] };
  }
  const value = pick(dim.shapes);
  return { kind: "shape", value, instruction: SHAPE_INSTRUCTIONS[value] };
}

function randomItem(dim) {
  return {
    shape: pick(dim.shapes),
    color: pick(dim.colors),
  };
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
