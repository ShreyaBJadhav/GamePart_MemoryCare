// PatternMatchingGame.jsx
//
// Memory-Flip Matching Game — Cognitive Care Companion (Web)
// -------------------------------------------------------------
// Classic "flip two cards, find the matching pair" game.
// Supports 5 difficulty levels via the `level` prop — pair count
// and grid layout scale automatically (see difficulty spec).
//
// Colors match the team's finalized palette:
//   Background        #FDF6EC (warm cream)
//   Primary/Accent     #D85A30 (terracotta orange)
//   Card background     #FAECE7 (very light peach)
//   Borders             #D9D3C7 (soft warm gray)
//   Main text           #3B3B3F (dark charcoal)
//   Secondary text      #59595D (medium charcoal)
//   White               #FFFFFF
//   Light accent/hover  #E28364 (lighter terracotta)
//   Soft divider        #E4DDD2 (warm light gray)
//
// SELF-CONTAINED: no backend/auth dependency, no external UI
// library needed. Drop into: /src/games/PatternMatchingGame.jsx
//
// Usage:
//   import PatternMatchingGame from "./games/PatternMatchingGame";
//   <PatternMatchingGame level={1} />   // level defaults to 1 if omitted

import React, { useState, useRef, useCallback, useEffect } from "react";

// ---- Difficulty levels (matches the team's difficulty-scaling spec) ----
const DIFFICULTY_LEVELS = {
  1: { pairs: 2, columns: 2 }, // 2x2 — Starter
  2: { pairs: 3, columns: 3 }, // 2x3
  3: { pairs: 4, columns: 4 }, // 2x4
  4: { pairs: 6, columns: 4 }, // 3x4
  5: { pairs: 8, columns: 4 }, // 4x4 — Hardest
};
const MIN_LEVEL = 1;
const MAX_LEVEL = 5;

// ---- Placeholder content pool ----
// Swap for real regional imagery later (image URLs / imported assets).
const CARD_CONTENT_POOL = [
  "🍎", "🍌", "🐘", "🐄", "🌸", "🥭", "🐐", "🦚",
  "🍊", "🍇", "🐓", "🦋",
];

function clampLevel(level) {
  const n = Number(level);
  if (!Number.isFinite(n)) return MIN_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(n)));
}

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

export default function PatternMatchingGame({ level = 1 }) {
  const activeLevel = clampLevel(level);
  const { columns } = DIFFICULTY_LEVELS[activeLevel];

  const [cards, setCards] = useState(() => buildDeck(activeLevel));
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const [attempts, setAttempts] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);
  const sessionStartRef = useRef(Date.now());
  const lastFlipTimeRef = useRef(null);
  const responseTimesRef = useRef([]);

  useEffect(() => {
    resetSession(activeLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLevel]);

  const resetSession = (lvl) => {
    setCards(buildDeck(lvl));
    setFlippedIndices([]);
    setIsBusy(false);
    setSessionComplete(false);
    setAttempts(0);
    setCorrectMatches(0);
    sessionStartRef.current = Date.now();
    lastFlipTimeRef.current = null;
    responseTimesRef.current = [];
  };

  const handleCardTap = useCallback(
    (index) => {
      if (isBusy) return;
      if (cards[index].isFlipped || cards[index].isMatched) return;
      if (flippedIndices.length === 2) return;

      if (!lastFlipTimeRef.current) lastFlipTimeRef.current = Date.now();

      const updated = [...cards];
      updated[index] = { ...updated[index], isFlipped: true };
      setCards(updated);

      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        setAttempts((a) => a + 1);
        checkForMatch(updated, newFlipped);
      }
    },
    [cards, flippedIndices, isBusy]
  );

  const checkForMatch = (currentCards, [i1, i2]) => {
    setIsBusy(true);
    const isMatch = currentCards[i1].content === currentCards[i2].content;

    if (lastFlipTimeRef.current) {
      responseTimesRef.current.push(Date.now() - lastFlipTimeRef.current);
      lastFlipTimeRef.current = null;
    }

    if (isMatch) {
      setTimeout(() => {
        setCards((prev) => {
          const next = [...prev];
          next[i1] = { ...next[i1], isMatched: true };
          next[i2] = { ...next[i2], isMatched: true };
          return next;
        });
        setCorrectMatches((c) => c + 1);
        setFlippedIndices([]);
        setIsBusy(false);
        checkSessionComplete(currentCards, i1, i2);
      }, 500);
    } else {
      setTimeout(() => {
        setCards((prev) => {
          const next = [...prev];
          next[i1] = { ...next[i1], isFlipped: false };
          next[i2] = { ...next[i2], isFlipped: false };
          return next;
        });
        setFlippedIndices([]);
        setIsBusy(false);
      }, 1100);
    }
  };

  const checkSessionComplete = (currentCards, i1, i2) => {
    const willAllMatch = currentCards.every(
      (c, idx) => c.isMatched || idx === i1 || idx === i2
    );
    if (willAllMatch) setSessionComplete(true);
  };

  const buildSessionResult = () => {
    const totalTimeSeconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
    const times = responseTimesRef.current;
    const avgResponseMs =
      times.length === 0 ? 0 : Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const accuracy = attempts === 0 ? 0 : ((correctMatches / attempts) * 100).toFixed(1);
    const mistakes = attempts - correctMatches;

    return {
      game: "pattern_matching",
      level: activeLevel,
      grid_size: cards.length,
      attempts,
      correct_matches: correctMatches,
      mistakes,
      accuracy_percent: accuracy,
      total_time_seconds: totalTimeSeconds,
      avg_response_ms: avgResponseMs,
      timestamp: new Date().toISOString(),
    };
  };

  const restart = () => resetSession(activeLevel);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Find the Match</h1>
        <p style={styles.levelBadge}>Level {activeLevel}</p>
      </header>

      <main style={styles.main}>
        {sessionComplete ? (
          <SummaryView result={buildSessionResult()} onRestart={restart} />
        ) : (
          <GameView cards={cards} columns={columns} onCardTap={handleCardTap} />
        )}
      </main>
    </div>
  );
}

function GameView({ cards, columns, onCardTap }) {
  return (
    <div style={styles.gameWrap}>
      <p style={styles.instruction}>Tap two cards to find a matching pair</p>
      <div style={{ ...styles.grid, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {cards.map((card, index) => (
          <Card key={card.id} card={card} onTap={() => onCardTap(index)} />
        ))}
      </div>
    </div>
  );
}

function Card({ card, onTap }) {
  const showFace = card.isFlipped || card.isMatched;
  return (
    <button
      onClick={onTap}
      aria-label={showFace ? `Card showing ${card.content}` : "Face-down card"}
      style={{
        ...styles.card,
        backgroundColor: card.isMatched
          ? "#E28364" // light accent/hover — matched, warm not flashy
          : showFace
          ? "#FAECE7" // card background — very light peach
          : "#D85A30", // primary/accent — terracotta card back
        borderColor: card.isMatched ? "#D85A30" : "#D9D3C7",
      }}
    >
      {showFace ? (
        <span style={styles.cardEmoji}>{card.content}</span>
      ) : (
        <span style={styles.cardBack}>?</span>
      )}
    </button>
  );
}

function SummaryView({ result, onRestart }) {
  return (
    <div style={styles.summaryWrap}>
      <div style={styles.star}>⭐</div>
      <h2 style={styles.summaryTitle}>Well done!</h2>
      <SummaryRow label="Level" value={`${result.level}`} />
      <SummaryRow label="Accuracy" value={`${result.accuracy_percent}%`} />
      <SummaryRow label="Time taken" value={`${result.total_time_seconds}s`} />
      <SummaryRow label="Attempts" value={`${result.attempts}`} />
      <SummaryRow label="Mistakes" value={`${result.mistakes}`} />
      <button
        onClick={onRestart}
        style={styles.playAgainBtn}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E28364")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#D85A30")}
      >
        Play Again
      </button>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={styles.summaryRow}>
      <span style={styles.summaryLabel}>{label}</span>
      <span style={styles.summaryValue}>{value}</span>
    </div>
  );
}

// ---- Team palette applied throughout ----
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#FDF6EC", // background — warm cream
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    backgroundColor: "#D85A30", // primary/accent — terracotta orange
    padding: "20px 16px",
    textAlign: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: 600,
    margin: 0,
  },
  levelBadge: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    margin: "6px 0 0 0",
  },
  main: {
    maxWidth: "520px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  gameWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  instruction: {
    fontSize: "18px",
    color: "#59595D", // secondary text — medium charcoal
    textAlign: "center",
    marginBottom: "32px",
  },
  grid: {
    display: "grid",
    gap: "16px",
    width: "100%",
  },
  card: {
    aspectRatio: "1 / 1",
    borderRadius: "16px",
    border: "2px solid",
    boxShadow: "0 2px 4px rgba(59,59,63,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
    padding: 0,
  },
  cardEmoji: {
    fontSize: "44px",
  },
  cardBack: {
    fontSize: "28px",
    color: "rgba(255,255,255,0.75)",
    fontWeight: 700,
  },
  summaryWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    paddingTop: "24px",
  },
  star: {
    fontSize: "56px",
    marginBottom: "8px",
  },
  summaryTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#3B3B3F", // main text — dark charcoal
    margin: "0 0 24px 0",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 0",
    borderBottom: "1px solid #E4DDD2", // soft divider
  },
  summaryLabel: {
    fontSize: "18px",
    color: "#59595D", // secondary text
  },
  summaryValue: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#3B3B3F", // main text
  },
  playAgainBtn: {
    marginTop: "32px",
    backgroundColor: "#D85A30", // primary/accent
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "16px 40px",
    fontSize: "18px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};
