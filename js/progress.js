import { el, header, levelSubtitle } from "./ui.js";
import { t, tf } from "./i18n.js";
import { GAME_TYPES, getPlayLevel, listGameResults, listBreathingSessions } from "./db.js";

const GAME_KEYS = [
  [GAME_TYPES.pattern_matching, "patternName"],
  [GAME_TYPES.shape_sort, "shapeName"],
  [GAME_TYPES.face_name_recall, "faceName"],
  [GAME_TYPES.remember_my_story, "storyName"],
];
const RANGES = { day: 1, week: 7, month: 30 };
const CHART_COLORS = ["#D85A30", "#3B3B3F"];

export async function mountProgress(root, { lang, onBack }) {
  const results = await listGameResults();
  const breathingSessions = await listBreathingSessions();
  const screen = el("main", { className: "screen progress-screen" });
  const dashboard = el("section", { className: "progress-dashboard" });
  const rangeTabs = el("div", { className: "progress-range-tabs", role: "tablist", "aria-label": t(lang, "progressRange") });
  const dashboardContent = el("div", {});
  for (const range of Object.keys(RANGES)) {
    rangeTabs.append(el("button", {
      className: "progress-range-tab",
      type: "button",
      role: "tab",
      "aria-selected": range === "week" ? "true" : "false",
      onClick: () => renderDashboard(range),
    }, t(lang, `progress${range[0].toUpperCase()}${range.slice(1)}`)));
  }
  dashboard.append(rangeTabs, dashboardContent);
  screen.append(dashboard, el("h3", { className: "progress-section-title" }, t(lang, "progressRecentActivity")));

  function renderDashboard(range) {
    const data = aggregate(results, breathingSessions, range);
    rangeTabs.querySelectorAll("button").forEach((button, index) => {
      button.setAttribute("aria-selected", String(Object.keys(RANGES)[index] === range));
    });
    dashboardContent.replaceChildren(
      el("div", { className: "progress-summary" },
        summaryItem(t(lang, "progressTotalActivities"), data.totalActivities),
        summaryItem(tf(lang, "progressTotalTime", { range: t(lang, `progress${range[0].toUpperCase()}${range.slice(1)}`).toLowerCase() }), formatDuration(data.totalSeconds)),
      ),
      chartPanel(t(lang, "progressSessionsByGame"), "progress-sessions-chart"),
      chartPanel(t(lang, "progressAccuracyTrend"), "progress-accuracy-chart"),
    );
    drawCharts(dashboardContent, data, lang);
  }

  renderDashboard("week");

  const recentResults = results.filter((result) => isInRange(result.timestamp, "week"));
  const averageAccuracy = recentResults.length ? recentResults.reduce((sum, result) => sum + accuracy(result), 0) / recentResults.length : 0;
  const stars = recentResults.length ? Math.max(1, Math.min(5, Math.round(averageAccuracy / 20))) : 0;
  screen.prepend(el("section", { className: "progress-intro" },
    el("div", { className: "progress-stars", role: "img", "aria-label": tf(lang, "progressStars", { n: stars }) }, stars ? "★".repeat(stars) + "☆".repeat(5 - stars) : "☆☆☆☆☆"),
    el("h2", {}, t(lang, stars ? "progressGreatWeek" : "progressFreshStart")),
    el("p", {}, t(lang, "progressHelp")),
  ));

  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

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

function aggregate(results, breathingSessions, range) {
  const days = RANGES[range];
  const labels = Array.from({ length: days }, (_, index) => dateKey(Date.now() - (days - 1 - index) * 86400000));
  const gameResults = results.filter((result) => isInRange(result.timestamp, range));
  const breathing = breathingSessions.filter((session) => isInRange(session.timestamp, range));
  return {
    totalActivities: gameResults.length + breathing.length,
    totalSeconds: gameResults.reduce((sum, result) => sum + duration(result), 0) + breathing.reduce((sum, session) => sum + duration(session), 0),
    counts: GAME_KEYS.map(([gameType]) => gameResults.filter((result) => result.gameType === gameType).length),
    labels,
    accuracy: labels.map((day) => {
      const daily = gameResults.filter((result) => dateKey(result.timestamp) === day);
      return daily.length ? daily.reduce((sum, result) => sum + accuracy(result), 0) / daily.length : null;
    }),
  };
}

function drawCharts(container, data, lang) {
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#3B3B3F", font: { size: 16 } } } }, scales: { x: { ticks: { color: "#3B3B3F", font: { size: 15 } }, grid: { color: "#eadfd3" } }, y: { beginAtZero: true, ticks: { color: "#3B3B3F", font: { size: 15 } }, grid: { color: "#eadfd3" } } } };
  new Chart(container.querySelector("#progress-sessions-chart"), { type: "bar", data: { labels: GAME_KEYS.map(([, key]) => t(lang, key)), datasets: [{ label: t(lang, "progressSessions"), data: data.counts, backgroundColor: CHART_COLORS[0], borderColor: CHART_COLORS[0], borderWidth: 1 }] }, options: chartOptions });
  new Chart(container.querySelector("#progress-accuracy-chart"), { type: "line", data: { labels: data.labels.map((label) => label.slice(5)), datasets: [{ label: t(lang, "progressAverageAccuracy"), data: data.accuracy, borderColor: CHART_COLORS[0], backgroundColor: "rgba(216, 90, 48, 0.18)", pointBackgroundColor: CHART_COLORS[0], fill: true, tension: 0.25, spanGaps: true }] }, options: { ...chartOptions, scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, max: 100, ticks: { ...chartOptions.scales.y.ticks, callback: (value) => `${value}%` } } } } });
}

function chartPanel(title, canvasId) {
  const canvas = document.createElement("canvas");
  canvas.id = canvasId;
  return el("section", { className: "progress-chart-panel" }, el("h3", {}, title), el("div", { className: "progress-chart-wrap" }, canvas));
}

function summaryItem(label, value) {
  return el("div", { className: "progress-summary-item" }, el("strong", {}, String(value)), el("span", {}, label));
}

function isInRange(timestamp, range) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (RANGES[range] - 1));
  return Date.parse(timestamp) >= start.getTime();
}

function dateKey(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function duration(record) {
  const value = Number(record.totalTimeSeconds ?? record.total_time_seconds);
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  return minutes ? `${minutes}m ${Math.round(seconds % 60)}s` : `${Math.round(seconds)}s`;
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