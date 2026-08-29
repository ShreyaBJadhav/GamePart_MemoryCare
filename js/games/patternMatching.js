import { el, clear, header, summaryView } from "../ui.js";
import { t } from "../i18n.js";
import { speak } from "../voice.js";
import { applyAdaptiveAndSave, GAME_TYPES } from "../db.js";
import { clampLevel } from "../adaptive.js";

const DIFFICULTY_LEVELS = {
  1: { pairs: 2, columns: 2 },
  2: { pairs: 3, columns: 3 },
  3: { pairs: 4, columns: 4 },
  4: { pairs: 6, columns: 4 },
  5: { pairs: 8, columns: 4 },
};

const CARD_CONTENT_POOL = [
  "🍎", "🍌", "🐘", "🐄", "🌸", "🥭", "🐐", "🦚",
  "🍊", "🍇", "🐓", "🦋",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(level) {
  const { pairs } = DIFFICULTY_LEVELS[level];
  const chosen = shuffle(CARD_CONTENT_POOL).slice(0, pairs);
  const pairContent = shuffle([...chosen, ...chosen]);
  return pairContent.map((content, i) => ({
    id: `card_${i}`,
    content,
    isFlipped: false,
    isMatched: false,
  }));
}

export function mountPatternMatching(root, { lang, level, onHome }) {
  const activeLevel = clampLevel(level);
  let cards = buildDeck(activeLevel);
  let flipped = [];
  let busy = false;
  let attempts = 0;
  let correctMatches = 0;
  const sessionStart = Date.now();
  let lastFlipTime = null;
  const responseTimes = [];
  let resumeLevel = activeLevel;

  function restart() {
    mountPatternMatching(root, { lang, level: resumeLevel, onHome });
  }

  speak(t(lang, "patternHelp"));
  render();

  function render(complete = false, summary = null) {
    clear(root);
    root.append(
      header(lang, {
        title: t(lang, "patternName"),
        subtitle: `${t(lang, "level")} ${activeLevel}`,
        onBack: onHome,
      }),
    );
    if (complete) {
      root.append(summaryView(lang, summary, { onRestart: restart, onHome }));
      return;
    }

    const { columns } = DIFFICULTY_LEVELS[activeLevel];
    const grid = el("div", { className: "grid", style: { gridTemplateColumns: `repeat(${columns}, 1fr)` } });
    cards.forEach((card, index) => {
      const show = card.isFlipped || card.isMatched;
      const btn = el("button", {
        className: `card-btn${show ? " face" : ""}${card.isMatched ? " matched" : ""}`,
        type: "button",
        "aria-label": show ? `Card showing ${card.content}` : "Face-down card",
        onClick: () => handleTap(index),
      }, show ? el("span", { className: "card-emoji" }, card.content) : "?");
      grid.append(btn);
    });

    root.append(
      el("main", { className: "screen" },
        el("p", { className: "instruction" }, t(lang, "patternHelp")),
        grid,
      ),
    );
  }

  function handleTap(index) {
    if (busy) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flipped.length === 2) return;
    if (!lastFlipTime) lastFlipTime = Date.now();

    cards = cards.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
    flipped = [...flipped, index];
    render();

    if (flipped.length === 2) {
      attempts += 1;
      checkMatch();
    }
  }

  function checkMatch() {
    busy = true;
    const [i1, i2] = flipped;
    const isMatch = cards[i1].content === cards[i2].content;
    if (lastFlipTime) {
      responseTimes.push(Date.now() - lastFlipTime);
      lastFlipTime = null;
    }

    if (isMatch) {
      setTimeout(() => {
        cards = cards.map((c, i) =>
          i === i1 || i === i2 ? { ...c, isMatched: true } : c,
        );
        correctMatches += 1;
        flipped = [];
        busy = false;
        if (cards.every((c) => c.isMatched)) finish();
        else render();
      }, 500);
    } else {
      setTimeout(() => {
        cards = cards.map((c, i) =>
          i === i1 || i === i2 ? { ...c, isFlipped: false } : c,
        );
        flipped = [];
        busy = false;
        render();
      }, 1100);
    }
  }

  async function finish() {
    const times = responseTimes;
    const avgResponseMs = times.length === 0 ? 0 : Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const accuracyPercent = attempts === 0 ? 0 : Number(((correctMatches / attempts) * 100).toFixed(1));
    const mistakes = attempts - correctMatches;
    const totalTimeSeconds = Math.round((Date.now() - sessionStart) / 1000);
    const { nextPlayLevel } = await applyAdaptiveAndSave(GAME_TYPES.pattern_matching, {
      level: activeLevel,
      attempts,
      mistakes,
      accuracyPercent,
      avgResponseMs,
      totalTimeSeconds,
      extra: { grid_size: cards.length, correct_matches: correctMatches },
    });
    resumeLevel = nextPlayLevel;
    speak(t(lang, "wellDone"));
    render(true, {
      level: activeLevel,
      accuracyPercent,
      totalTimeSeconds,
      attempts,
      mistakes,
      nextPlayLevel,
    });
  }
}
