// shapeSortContentPacks.js
//
// Content packs for the Shape Sort game — separate from game logic
// so new levels/regions/languages are a data change, not a code
// change (per the team's "content-pack architecture" from the
// master doc). Drop into: /src/roles/patient/content-packs/
//
// Schema per level:
//   {
//     level: number,
//     packId: string,          // unique id for this content pack
//     packLabel: string,       // human-readable name (for dashboards/docs)
//     bins: [{ id, label }],   // the categories the patient sorts into
//     items: [{ id, type, value, correctBin }]
//       type: "svg_shape" -> value is one of: "circle","square","triangle","rectangle"
//       type: "emoji"     -> value is the emoji character itself
//
// IMPORTANT (content review note): Level 3's items are a first-draft
// placeholder set representing generic "kitchen" vs "farm" objects
// using available emoji, which are an approximation, not accurate
// regional imagery. Per the team discussion, this pack needs review
// by someone from the actual represented community before it's used
// in a real deployment or even a confident demo claim — swap the
// `value` field for real icon/image assets per item when ready,
// the game code does not need to change.

export const SHAPE_SORT_PACKS = {
  1: {
    level: 1,
    packId: "geometric_basic",
    packLabel: "Shapes — Round or Cornered",
    bins: [
      { id: "round", label: "Round" },
      { id: "cornered", label: "Cornered" },
    ],
    items: [
      { id: "s1", type: "svg_shape", value: "circle", correctBin: "round" },
      { id: "s2", type: "svg_shape", value: "square", correctBin: "cornered" },
      { id: "s3", type: "svg_shape", value: "circle", correctBin: "round" },
      { id: "s4", type: "svg_shape", value: "triangle", correctBin: "cornered" },
      { id: "s5", type: "svg_shape", value: "square", correctBin: "cornered" },
      { id: "s6", type: "svg_shape", value: "circle", correctBin: "round" },
    ],
  },

  2: {
    level: 2,
    packId: "geometric_sides",
    packLabel: "Shapes — 3 Sides or 4 Sides",
    bins: [
      { id: "three_sides", label: "3 Sides" },
      { id: "four_sides", label: "4 Sides" },
    ],
    items: [
      { id: "s1", type: "svg_shape", value: "triangle", correctBin: "three_sides" },
      { id: "s2", type: "svg_shape", value: "square", correctBin: "four_sides" },
      { id: "s3", type: "svg_shape", value: "rectangle", correctBin: "four_sides" },
      { id: "s4", type: "svg_shape", value: "triangle", correctBin: "three_sides" },
      { id: "s5", type: "svg_shape", value: "square", correctBin: "four_sides" },
      { id: "s6", type: "svg_shape", value: "triangle", correctBin: "three_sides" },
    ],
  },

  3: {
    level: 3,
    packId: "kitchen_farm_v0_placeholder",
    packLabel: "Kitchen Items or Farm Tools (placeholder — needs regional content review)",
    bins: [
      { id: "kitchen", label: "Kitchen Items" },
      { id: "farm", label: "Farm Tools" },
    ],
    items: [
      { id: "c1", type: "emoji", value: "☕", correctBin: "kitchen" }, // teacup
      { id: "c2", type: "emoji", value: "🫖", correctBin: "kitchen" }, // kettle
      { id: "c3", type: "emoji", value: "🥄", correctBin: "kitchen" }, // ladle/spoon
      { id: "c4", type: "emoji", value: "🍲", correctBin: "kitchen" }, // cooking pot
      { id: "c5", type: "emoji", value: "🌾", correctBin: "farm" }, // sheaf of rice
      { id: "c6", type: "emoji", value: "🪓", correctBin: "farm" }, // axe (generic tool stand-in)
    ],
  },
};

export const MIN_SHAPE_SORT_LEVEL = 1;
export const MAX_SHAPE_SORT_LEVEL = 3; // extend as Levels 4-5 packs are added

export function getPackForLevel(level) {
  const clamped = Math.min(
    MAX_SHAPE_SORT_LEVEL,
    Math.max(MIN_SHAPE_SORT_LEVEL, Math.round(Number(level) || MIN_SHAPE_SORT_LEVEL))
  );
  return SHAPE_SORT_PACKS[clamped];
}
