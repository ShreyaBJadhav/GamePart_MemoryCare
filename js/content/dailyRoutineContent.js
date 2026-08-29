export const ROUTINE_POOL = [
  { id: "wake", en: "Wake up", hi: "जागना" },
  { id: "wash", en: "Wash face", hi: "चेहरा धोना" },
  { id: "tea", en: "Have tea", hi: "चाय पीना" },
  { id: "walk", en: "Morning walk", hi: "सुबह की सैर" },
  { id: "lunch", en: "Eat lunch", hi: "दोपहर का खाना" },
  { id: "rest", en: "Afternoon rest", hi: "दोपहर आराम" },
  { id: "medicine", en: "Take medicine", hi: "दवाई लेना" },
  { id: "dinner", en: "Eat dinner", hi: "रात का खाना" },
  { id: "sleep", en: "Go to sleep", hi: "सोना" },
];

const LENGTHS = { 1: 3, 2: 4, 3: 5, 4: 6, 5: 8 };

export function buildDailyRoutine(level) {
  const length = LENGTHS[level];
  const correct = ROUTINE_POOL.slice(0, length);
  let shuffled = shuffle(correct);
  let guard = 0;
  while (sameOrder(shuffled, correct) && guard < 20) {
    shuffled = shuffle(correct);
    guard += 1;
  }
  return { correct, items: shuffled };
}

export function sameOrder(a, b) {
  return a.length === b.length && a.every((item, i) => item.id === b[i].id);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
