import { el, clear, header, summaryView } from "../ui.js";
import { t } from "../i18n.js";
import { speak } from "../voice.js";
import { applyAdaptiveAndSave, GAME_TYPES } from "../db.js";
import { clampLevel } from "../adaptive.js";
import { buildFaceNameRound, choiceLabel } from "../content/faceNameContent.js";

function avatarSvg(person) {
  const box = el("div");
  box.innerHTML = `
    <svg width="140" height="140" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="${person.hue}" />
      <circle cx="50" cy="38" r="18" fill="#FAECE7" />
      <ellipse cx="50" cy="78" rx="28" ry="22" fill="#FAECE7" />
      <path d="M32 30 Q50 8 68 30" fill="${person.hair}" />
      <circle cx="43" cy="38" r="3" fill="#3B3B3F" />
      <circle cx="57" cy="38" r="3" fill="#3B3B3F" />
    </svg>`;
  return box.firstElementChild;
}

export function mountFaceNameRecall(root, { lang, level, onHome }) {
  const activeLevel = clampLevel(level);
  let roundIndex = 0;
  let attempts = 0;
  let correctCount = 0;
  const sessionStart = Date.now();
  const responseTimes = [];
  let roundStart = Date.now();
  let current = buildFaceNameRound(activeLevel, lang);
  const totalRounds = current.rounds;
  let resumeLevel = activeLevel;

  function restart() {
    mountFaceNameRecall(root, { lang, level: resumeLevel, onHome });
  }

  speak(t(lang, "faceHelp"));
  render();

  function render(complete = false, summary = null) {
    clear(root);
    root.append(
      header(lang, {
        title: t(lang, "faceName"),
        subtitle: `${t(lang, "level")} ${activeLevel} · ${roundIndex + (complete ? 0 : 1)} / ${totalRounds}`,
        onBack: onHome,
      }),
    );
    if (complete) {
      root.append(summaryView(lang, summary, { onRestart: restart, onHome }));
      return;
    }

    const choices = el("div", { className: "choice-col" });
    current.choices.forEach((person) => {
      choices.append(
        el("button", {
          className: "btn",
          type: "button",
          onClick: () => handleChoice(person),
        }, choiceLabel(person, lang)),
      );
    });

    root.append(
      el("main", { className: "screen" },
        el("p", { className: "instruction" }, t(lang, "faceHelp")),
        el("div", { className: "face-stage" }, avatarSvg(current.target)),
        choices,
      ),
    );
  }

  function handleChoice(person) {
    attempts += 1;
    responseTimes.push(Date.now() - roundStart);
    if (person.id === current.target.id) {
      correctCount += 1;
      speak(t(lang, "nice"));
    } else {
      speak(t(lang, "tryAgain"));
    }
    roundIndex += 1;
    if (roundIndex >= totalRounds) {
      finish();
      return;
    }
    current = buildFaceNameRound(activeLevel, lang);
    roundStart = Date.now();
    speak(t(lang, "faceHelp"));
    render();
  }

  async function finish() {
    const times = responseTimes;
    const avgResponseMs = times.length === 0 ? 0 : Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const mistakes = attempts - correctCount;
    const accuracyPercent = attempts === 0 ? 0 : Number(((correctCount / attempts) * 100).toFixed(1));
    const totalTimeSeconds = Math.round((Date.now() - sessionStart) / 1000);
    const { nextPlayLevel } = await applyAdaptiveAndSave(GAME_TYPES.face_name_recall, {
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
