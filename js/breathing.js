import { el, header } from "./ui.js";
import { t } from "./i18n.js";
import { speak, stopSpeaking } from "./voice.js";
import { saveBreathingSession } from "./db.js";

const INHALE_SECONDS = 4;
const EXHALE_SECONDS = 6;
const TOTAL_CYCLES = 5;

export function mountBreathing(root, { lang, onHome }) {
  let phase = "in";
  let cyclesCompleted = 0;
  let phaseTimer = 0;
  const startedAt = Date.now();
  let finished = false;

  const screen = el("main", { className: "screen breathing-screen" });
  const phaseText = el("p", { className: "breathing-phase", "aria-live": "polite" });
  const circle = el("div", { className: "breathing-circle", role: "img" }, phaseText);
  const instruction = el("p", { className: "instruction" }, t(lang, "breathingHelp"));
  const stopButton = el("button", { className: "btn btn-stop breathing-stop", type: "button", onClick: finish }, t(lang, "stop"));

  function updatePhase(nextPhase) {
    phase = nextPhase;
    circle.className = `breathing-circle ${phase === "in" ? "breathing-in" : "breathing-out"}`;
    phaseText.textContent = t(lang, phase === "in" ? "breatheIn" : "breatheOut");
    speak(t(lang, phase === "in" ? "breatheIn" : "breatheOut"));
  }

  function schedulePhase() {
    phaseTimer = window.setTimeout(() => {
      if (finished) return;
      if (phase === "in") {
        updatePhase("out");
        schedulePhase();
      } else {
        cyclesCompleted += 1;
        if (cyclesCompleted >= TOTAL_CYCLES) finish();
        else {
          updatePhase("in");
          schedulePhase();
        }
      }
    }, (phase === "in" ? INHALE_SECONDS : EXHALE_SECONDS) * 1000);
  }

  async function finish() {
    if (finished) return;
    finished = true;
    window.clearTimeout(phaseTimer);
    stopSpeaking();
    stopButton.disabled = true;
    const totalTimeSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    await saveBreathingSession({ cyclesCompleted, totalTimeSeconds });
    screen.replaceChildren(el("div", { className: "breathing-complete" },
      el("div", { className: "breathing-rest-icon", "aria-hidden": "true" }, "○"),
      el("h2", {}, t(lang, "breathingComplete")),
      el("p", {}, t(lang, "breathingClosing")),
      el("button", { className: "btn", type: "button", onClick: onHome }, t(lang, "home")),
    ));
    speak(t(lang, "breathingClosing"));
  }

  updatePhase("in");
  screen.append(circle, instruction, stopButton);
  root.replaceChildren(header(lang, { title: t(lang, "breathingName") }), screen);
  schedulePhase();
}