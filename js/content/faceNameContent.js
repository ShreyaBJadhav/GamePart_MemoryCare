export const PEOPLE = [
  { id: "rajesh", name: "Rajesh", relationship: { en: "Son", hi: "बेटा" }, hue: "#D85A30", hair: "#3B3B3F" },
  { id: "meena", name: "Meena", relationship: { en: "Daughter", hi: "बेटी" }, hue: "#E28364", hair: "#59595D" },
  { id: "anita", name: "Anita", relationship: { en: "Nurse", hi: "नर्स" }, hue: "#C0432E", hair: "#3B3B3F" },
  { id: "suresh", name: "Suresh", relationship: { en: "Neighbour", hi: "पड़ोसी" }, hue: "#8A4A32", hair: "#2C2C30" },
  { id: "lata", name: "Lata", relationship: { en: "Sister", hi: "बहन" }, hue: "#B85C38", hair: "#4A3B32" },
  { id: "kamal", name: "Kamal", relationship: { en: "Doctor", hi: "डॉक्टर" }, hue: "#9C5A2C", hair: "#1F1F22" },
  { id: "priya", name: "Priya", relationship: { en: "Granddaughter", hi: "पोती" }, hue: "#D97A4A", hair: "#3B3B3F" },
  { id: "ravi", name: "Ravi", relationship: { en: "Grandson", hi: "पोता" }, hue: "#A65A28", hair: "#2A2A2E" },
];

const LEVEL_ROUNDS = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
};

export function choiceLabel(person, lang) {
  const rel = person.relationship[lang] || person.relationship.en;
  return `${person.name} (${rel})`;
}

export function buildFaceNameRound(level, lang) {
  const pool = PEOPLE.slice(0, Math.min(PEOPLE.length, 3 + level));
  const target = pool[Math.floor(Math.random() * pool.length)];
  const others = shuffle(pool.filter((p) => p.id !== target.id)).slice(0, 3);
  const choices = shuffle([target, ...others]);
  return {
    target,
    choices,
    rounds: LEVEL_ROUNDS[level],
    prompt: lang === "hi" ? "यह कौन हैं?" : "Who is this?",
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
