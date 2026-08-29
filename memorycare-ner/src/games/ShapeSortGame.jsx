// ShapeSortGame.jsx
//
// Shape Sort — Cognitive Care Companion (Web)
// -------------------------------------------------------------
// Tap-to-categorize game: patient sees one item at a time, taps
// the correct bin it belongs to. Deliberately NOT drag-based —
// drag gestures are harder for elderly users with reduced fine
// motor control; tap-tap is more accessible.
//
// Levels 1-2: abstract geometric shapes (no content sourcing
//             needed, ships immediately).
// Level 3:    culturally-themed placeholder pack (Kitchen vs Farm
//             items) — see shapeSortContentPacks.js for the content
//             review note before this ships in a real demo/deploy.
//
// Colors match the team's finalized palette (same as PatternMatchingGame).
//
// SELF-CONTAINED: no backend/auth dependency. Drop into:
//   /src/roles/patient/games/ShapeSortGame.jsx
// and the content pack file into:
//   /src/roles/patient/content-packs/shapeSortContentPacks.js
//
// Usage:
//   import ShapeSortGame from "./games/ShapeSortGame";
//   <ShapeSortGame level={1} />   // level defaults to 1 if omitted

import React, { useState, useRef, useEffect } from "react";
import { getPackForLevel } from "../content-packs/shapeSortContentPacks";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ShapeSortGame({ level = 1 }) {
  const pack = getPackForLevel(level);

  const [roundOrder, setRoundOrder] = useState(() => shuffle(pack.items));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null); // "correct" | "incorrect" | null
  const [isBusy, setIsBusy] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  // ---- Scoring / performance tracking ----
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const sessionStartRef = useRef(Date.now());
  const roundStartRef = useRef(Date.now());
  const responseTimesRef = useRef([]);

  useEffect(() => {
    resetSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack.packId]);

  const resetSession = () => {
    setRoundOrder(shuffle(pack.items));
    setCurrentIndex(0);
    setFeedback(null);
    setIsBusy(false);
    setSessionComplete(false);
    setAttempts(0);
    setCorrectCount(0);
    sessionStartRef.current = Date.now();
    roundStartRef.current = Date.now();
    responseTimesRef.current = [];
  };

  const currentItem = roundOrder[currentIndex];

  const handleBinTap = (binId) => {
    if (isBusy || !currentItem) return;
    setIsBusy(true);
    setAttempts((a) => a + 1);

    responseTimesRef.current.push(Date.now() - roundStartRef.current);

    const isCorrect = binId === currentItem.correctBin;
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setCorrectCount((c) => c + 1);

    // Gentle pause so the patient sees the feedback before moving on —
    // same calm, non-jarring timing as the other games.
    setTimeout(() => {
      setFeedback(null);
      setIsBusy(false);
      if (currentIndex + 1 >= roundOrder.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
        roundStartRef.current = Date.now();
      }
    }, isCorrect ? 700 : 1100);
  };

  const buildSessionResult = () => {
    const totalTimeSeconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
    const times = responseTimesRef.current;
    const avgResponseMs =
      times.length === 0 ? 0 : Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const accuracy = attempts === 0 ? 0 : ((correctCount / attempts) * 100).toFixed(1);
    const mistakes = attempts - correctCount;

    return {
      game: "shape_sort",
      level: pack.level,
      content_pack_id: pack.packId,
      attempts,
      correct_count: correctCount,
      mistakes,
      accuracy_percent: accuracy,
      total_time_seconds: totalTimeSeconds,
      avg_response_ms: avgResponseMs,
      timestamp: new Date().toISOString(),
    };
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Sort It Out</h1>
        <p style={styles.levelBadge}>
          Level {pack.level} · {pack.packLabel}
        </p>
      </header>

      <main style={styles.main}>
        {sessionComplete ? (
          <SummaryView result={buildSessionResult()} onRestart={resetSession} />
        ) : (
          <GameView
            item={currentItem}
            bins={pack.bins}
            feedback={feedback}
            onBinTap={handleBinTap}
            roundNumber={currentIndex + 1}
            totalRounds={roundOrder.length}
          />
        )}
      </main>
    </div>
  );
}

function GameView({ item, bins, feedback, onBinTap, roundNumber, totalRounds }) {
  return (
    <div style={styles.gameWrap}>
      <p style={styles.instruction}>
        Which group does this belong to? ({roundNumber} of {totalRounds})
      </p>

      <div style={styles.itemStage}>
        <ItemDisplay item={item} feedback={feedback} />
      </div>

      <div style={styles.binRow}>
        {bins.map((bin) => (
          <button
            key={bin.id}
            onClick={() => onBinTap(bin.id)}
            style={styles.binButton}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E28364")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#D85A30")}
          >
            {bin.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ItemDisplay({ item, feedback }) {
  if (!item) return null;

  const ringColor =
    feedback === "correct" ? "#3E9C5C" : feedback === "incorrect" ? "#C0432E" : "#D9D3C7";

  return (
    <div style={{ ...styles.itemCircle, borderColor: ringColor }}>
      {item.type === "emoji" ? (
        <span style={styles.itemEmoji}>{item.value}</span>
      ) : (
        <ShapeSvg shape={item.value} />
      )}
    </div>
  );
}

function ShapeSvg({ shape }) {
  const fill = "#D85A30"; // primary/accent
  const size = 90;

  if (shape === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill={fill} />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" rx="6" fill={fill} />
      </svg>
    );
  }
  if (shape === "rectangle") {
    return (
      <svg width={size} height={size * 0.65} viewBox="0 0 100 65">
        <rect x="5" y="5" width="90" height="55" rx="6" fill={fill} />
      </svg>
    );
  }
  if (shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,8 92,88 8,88" fill={fill} />
      </svg>
    );
  }
  return null;
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

// ---- Team palette applied throughout (same as PatternMatchingGame) ----
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#FDF6EC",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    backgroundColor: "#D85A30",
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
    color: "#59595D",
    textAlign: "center",
    marginBottom: "28px",
  },
  itemStage: {
    marginBottom: "36px",
  },
  itemCircle: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    backgroundColor: "#FAECE7",
    border: "4px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "border-color 0.3s ease",
  },
  itemEmoji: {
    fontSize: "72px",
  },
  binRow: {
    display: "flex",
    gap: "16px",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  binButton: {
    backgroundColor: "#D85A30",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "14px",
    padding: "20px 28px",
    fontSize: "18px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    minWidth: "140px",
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
    color: "#3B3B3F",
    margin: "0 0 24px 0",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "8px 0",
    borderBottom: "1px solid #E4DDD2",
  },
  summaryLabel: {
    fontSize: "18px",
    color: "#59595D",
  },
  summaryValue: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#3B3B3F",
  },
  playAgainBtn: {
    marginTop: "32px",
    backgroundColor: "#D85A30",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "16px 40px",
    fontSize: "18px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};
