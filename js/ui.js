import { t } from "./i18n.js";
import { repeatLast, toggleSpeaking, isSpeechPaused } from "./voice.js";
import { clampLevel, levelTier } from "./adaptive.js";

export function levelSubtitle(lang, level) {
  const n = clampLevel(level);
  return `${t(lang, "level")} ${n} · ${t(lang, levelTier(n))}`;
}

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === "className") node.className = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "style" && typeof value === "object") {
      Object.assign(node.style, value);
    } else if (key === "innerHTML") {
      node.innerHTML = value;
    } else {
      node.setAttribute(key, value);
    }
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node) {
  node.replaceChildren();
}

export function header(lang, { title, subtitle, onBack, speechControls = false }) {
  return el("header", { className: "app-header" },
    el("h1", {}, title),
    subtitle ? el("p", {}, subtitle) : null,
    el("div", { className: "header-actions" },
      onBack
        ? el("button", { className: "btn btn-light", type: "button", onClick: onBack }, t(lang, "back"))
        : null,
      speechControls ? el("button", { className: "btn btn-light", type: "button", onClick: repeatLast }, t(lang, "repeat")) : null,
      speechControls ? speechToggle(lang) : null,
    ),
  );
}

function speechToggle(lang) {
  const button = el("button", {
    className: "btn btn-light",
    type: "button",
    onClick: () => {
      toggleSpeaking();
      button.textContent = t(lang, isSpeechPaused() ? "play" : "pause");
    },
  }, t(lang, isSpeechPaused() ? "play" : "pause"));
  return button;
}

export function summaryView(lang, result, { onRestart, onHome }) {
  return el("div", { className: "summary screen" },
    el("div", { className: "star" }, "⭐"),
    el("h2", {}, t(lang, "wellDone")),
    row(t(lang, "level"), levelSubtitle(lang, result.level)),
    row(t(lang, "accuracy"), `${result.accuracyPercent}%`),
    row(t(lang, "timeTaken"), `${result.totalTimeSeconds}s`),
    row(t(lang, "attempts"), String(result.attempts)),
    row(t(lang, "mistakes"), String(result.mistakes)),
    row(t(lang, "nextSession"), levelSubtitle(lang, result.nextPlayLevel)),
    el("button", { className: "btn", type: "button", style: { marginTop: "24px", width: "100%" }, onClick: onRestart }, t(lang, "playAgain")),
    el("button", { className: "btn", type: "button", style: { marginTop: "12px", width: "100%", background: "#3B3B3F" }, onClick: onHome }, t(lang, "home")),
  );
}

function row(label, value) {
  return el("div", { className: "summary-row" },
    el("span", {}, label),
    el("span", { style: { fontWeight: "650" } }, value),
  );
}
