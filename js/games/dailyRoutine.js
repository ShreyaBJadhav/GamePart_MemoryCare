import { el, clear, header, summaryView, levelSubtitle } from "../ui.js";
import { t } from "../i18n.js";
import { speak } from "../voice.js";
import { applyAdaptiveAndSave, GAME_TYPES } from "../db.js";
import { clampLevel } from "../adaptive.js";
import { buildDailyRoutine, sameOrder } from "../content/dailyRoutineContent.js";

export function mountDailyRoutine(root, { lang, level, onHome }) {
  const activeLevel = clampLevel(level);
  const { correct, items: startItems } = buildDailyRoutine(activeLevel);
  let items = startItems;
  let attempts = 0;
  let mistakes = 0;
  const sessionStart = Date.now();
  const responseTimes = [];
  let attemptStart = Date.now();
  let resumeLevel = activeLevel;

  function restart() {
    mountDailyRoutine(root, { lang, level: resumeLevel, onHome });
  }

  speak(t(lang, "routineHelp"));
  render();

  function render(complete = false, summary = null) {
    clear(root);
    root.append(
      header(lang, {
        title: t(lang, "routineName"),
        subtitle: levelSubtitle(lang, activeLevel),
        onBack: onHome,
      }),
    );
    if (complete) {
      root.append(summaryView(lang, summary, { onRestart: restart, onHome }));
      return;
    }

    const list = el("div", { className: "routine-list" });
    items.forEach((item, index) => {
      const label = lang === "hi" ? item.hi : item.en;
      list.append(
        el("div", { className: "routine-row" },
          el("div", { className: "routine-label" }, `${index + 1}. ${label}`),
          el("div", { className: "move-btns" },
            el("button", {
              className: "btn",
              type: "button",
              disabled: index === 0 ? "disabled" : null,
              onClick: () => move(index, -1),
            }, t(lang, "moveUp")),
            el("button", {
              className: "btn",
              type: "button",
              disabled: index === items.length - 1 ? "disabled" : null,
              onClick: () => move(index, 1),
            }, t(lang, "moveDown")),
          ),
        ),
      );
    });

    root.append(
      el("main", { className: "screen" },
        el("p", { className: "instruction" }, t(lang, "routineHelp")),
        list,
        el("button", {
          className: "btn",
          type: "button",
          style: { width: "100%", marginTop: "18px" },
          onClick: submit,
        }, t(lang, "done")),
      ),
    );
  }

  function move(index, dir) {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    [copy[index], copy[next]] = [copy[next], copy[index]];
    items = copy;
    render();
  }

  async function submit() {
    attempts += 1;
    responseTimes.push(Date.now() - attemptStart);
    attemptStart = Date.now();
    if (!sameOrder(items, correct)) {
      mistakes += 1;
      speak(t(lang, "checkOrder"));
      render();
      return;
    }
    const times = responseTimes;
    const avgResponseMs = times.length === 0 ? 0 : Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const accuracyPercent = attempts === 0 ? 0 : Number((( (attempts - mistakes) / attempts ) * 100).toFixed(1));
    const totalTimeSeconds = Math.round((Date.now() - sessionStart) / 1000);
    const { nextPlayLevel } = await applyAdaptiveAndSave(GAME_TYPES.daily_routine, {
      level: activeLevel,
      attempts,
      mistakes,
      accuracyPercent,
      avgResponseMs,
      totalTimeSeconds,
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
