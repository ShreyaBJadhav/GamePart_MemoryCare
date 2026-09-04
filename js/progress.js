import { el, header, levelSubtitle } from "./ui.js";
import { t, tf } from "./i18n.js";
import { GAME_TYPES, getPlayLevel, listGameResults, listBreathingSessions } from "./db.js";

const RECENT_DAYS = 7;
const GAME_KEYS = [
  [GAME_TYPES.pattern_matching, "patternName"],
  [GAME_TYPES.shape_sort, "shapeName"],
  [GAME_TYPES.face_name_recall, "faceName"],
  [GAME_TYPES.remember_my_story, "storyName"],
];

export async function mountProgress(root, { lang, onBack }) {
  const results = await listGameResults();
  const breathingSessions = await listBreathingSessions();
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const recentResults = results.filter((result) => Date.parse(result.timestamp) >= cutoff);
  const averageAccuracy = recentResults.length
    ? recentResults.reduce((sum, result) => sum + accuracy(result), 0) / recentResults.length
    : 0;
  const stars = recentResults.length ? Math.max(1, Math.min(5, Math.round(averageAccuracy / 20))) : 0;

  const screen = el("main", { className: "screen progress-screen" });
  screen.append(
    el("section", { className: "progress-intro" },
      el("div", { className: "progress-stars", role: "img", "aria-label": tf(lang, "progressStars", { n: stars }) }, stars ? "★".repeat(stars) + "☆".repeat(5 - stars) : "☆☆☆☆☆"),
      el("h2", {}, t(lang, stars ? "progressGreatWeek" : "progressFreshStart")),
      el("p", {}, t(lang, "progressHelp")),
    ),
    el("h3", { className: "progress-section-title" }, t(lang, "progressRecentActivity")),
  );

  for (const [gameType, nameKey] of GAME_KEYS) {
    const level = await getPlayLevel(gameType);
    const allGameResults = results
      .filter((result) => result.gameType === gameType)
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    const recentGameResults = recentResults
      .filter((result) => result.gameType === gameType)
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
    const latest = allGameResults[0];
    screen.append(el("section", { className: "progress-game-card" },
      el("h3", {}, t(lang, nameKey)),
      el("div", { className: "progress-game-row" },
        el("span", {}, t(lang, "progressLastPlayed")),
        el("strong", {}, latest ? relativeDay(lang, latest.timestamp) : t(lang, "progressNotPlayed")),
      ),
      el("div", { className: "progress-game-row" },
        el("span", {}, recentGameResults.length ? tf(lang, "progressPlayed", { n: recentGameResults.length }) : t(lang, "progressNoRecentPlays")),
        el("strong", {}, levelSubtitle(lang, level)),
      ),
    ));
  }

  const recentBreathing = breathingSessions.filter((session) => Date.parse(session.timestamp) >= cutoff);
  const latestBreathing = breathingSessions.slice().sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))[0];
  screen.append(el("section", { className: "progress-activity-card" },
    el("h3", {}, t(lang, "breathingName")),
    el("div", { className: "progress-game-row" },
      el("span", {}, t(lang, "progressLastPlayed")),
      el("strong", {}, latestBreathing ? relativeDay(lang, latestBreathing.timestamp) : t(lang, "progressNotPlayed")),
    ),
    el("div", { className: "progress-game-row" },
      el("span", {}, recentBreathing.length ? tf(lang, "breathingSessionsThisWeek", { n: recentBreathing.length }) : t(lang, "breathingNoSessions")),
      el("strong", {}, t(lang, "calmingActivity")),
    ),
  ));

  root.replaceChildren(header(lang, { title: t(lang, "progressTitle"), onBack }), screen);
}

function accuracy(result) {
  const value = Number(result.accuracy ?? result.accuracy_percent);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

function relativeDay(lang, timestamp) {
  const today = new Date();
  const played = new Date(timestamp);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const playedStart = new Date(played.getFullYear(), played.getMonth(), played.getDate());
  const days = Math.round((todayStart - playedStart) / (24 * 60 * 60 * 1000));
  if (days <= 0) return t(lang, "progressToday");
  if (days === 1) return t(lang, "progressYesterday");
  return tf(lang, "progressDaysAgo", { n: days });
}