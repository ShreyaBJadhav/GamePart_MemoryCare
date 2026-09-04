import { el, header } from "./ui.js";
import { t } from "./i18n.js";
import { speak, stopSpeaking, setVoiceLang } from "./voice.js";
import { saveBreathingSession } from "./db.js";

const INHALE_SECONDS = 4;
const HOLD_SECONDS = 4;
const EXHALE_SECONDS = 8;
const QUICK_DURATION_SECONDS = 60;
const GENTLE_DURATION_SECONDS = 300;

export function mountBreathing(root, { lang, onHome }) {
  let phase = "in";
  let cyclesCompleted = 0;
  let phaseTimer = 0;
  let lastTickAt = 0;
  let sessionRemainingMs = 0;
  let phaseRemainingMs = 0;
  let startedAt = 0;
  let paused = false;
  let finished = false;
  let active = false;

  setVoiceLang(lang);

  function instructionText() {
    return t(lang, "breathingInstruction");
  }

  function instructionLines() {
    return instructionText().split("\n").map((line) => el("p", { className: "instruction breathing-instruction" }, line));
  }

  function chooseSession(durationSeconds) {
    if (active || finished) return;
    active = true;
    paused = false;
    phase = "in";
    sessionRemainingMs = durationSeconds * 1000;
    startedAt = Date.now();
    phaseRemainingMs = INHALE_SECONDS * 1000;
    cyclesCompleted = 0;
    renderExercise();
    updatePhase(true);
    startTimer();
  }

  function renderStart() {
    const screen = el("main", { className: "screen breathing-screen" },
      ...instructionLines(),
      el("p", { className: "instruction breathing-instruction" }, t(lang, "breathingSafety")),
      el("div", { className: "breathing-session-options" },
        el("button", { className: "btn", type: "button", onClick: () => chooseSession(QUICK_DURATION_SECONDS) }, t(lang, "breathingQuick")),
        el("button", { className: "btn", type: "button", onClick: () => chooseSession(GENTLE_DURATION_SECONDS) }, t(lang, "breathingLong")),
      ),
    );
    root.replaceChildren(header(lang, { title: t(lang, "breathingName"), onBack: leaveExercise }), screen);
    speak(instructionText());
  }

  let phaseText;
  let circle;
  let instruction;
  let pauseButton;

  function renderExercise() {
    phaseText = el("p", { className: "breathing-phase", "aria-live": "polite" });
    circle = el("div", { className: "breathing-circle", role: "img" }, phaseText);
    instruction = el("p", { className: "instruction breathing-instruction" });
    pauseButton = el("button", { className: "btn", type: "button", onClick: togglePause }, t(lang, "pause"));
    const stopButton = el("button", { className: "btn breathing-stop", type: "button", onClick: finish }, t(lang, "stopExercise"));
    const controls = el("div", { className: "breathing-controls" }, pauseButton, stopButton);
    const screen = el("main", { className: "screen breathing-screen" }, circle, instruction, controls);
    root.replaceChildren(header(lang, { title: t(lang, "breathingName"), onBack: onHome }), screen);
  }

  function togglePause() {
    if (!active || finished) return;
    if (paused) {
      paused = false;
      pauseButton.textContent = t(lang, "pause");
      lastTickAt = Date.now();
      startTimer();
      updatePhase();
    } else {
      const now = Date.now();
      phaseRemainingMs -= now - lastTickAt;
      sessionRemainingMs -= now - lastTickAt;
      paused = true;
      pauseButton.textContent = t(lang, "resume");
      window.clearInterval(phaseTimer);
      phaseText.replaceChildren(el("span", {}, t(lang, "breathingPaused")), el("span", {}, t(lang, "breathingPausedHelp")));
      instruction.textContent = t(lang, "breathingPace");
    }
  }

  function updatePhase(announce = false) {
    const phaseKey = phase === "in" ? "breatheIn" : phase === "hold" ? "breatheHold" : "breatheOut";
    circle.className = `breathing-circle breathing-${phase}`;
    phaseText.textContent = t(lang, phaseKey);
    instruction.textContent = t(lang, "breathingPace");
    if (announce && !paused) speak(t(lang, phaseKey));
  }

  function startTimer() {
    window.clearInterval(phaseTimer);
    lastTickAt = Date.now();
    phaseTimer = window.setInterval(tick, 250);
  }

  function tick() {
    if (!active || paused || finished) return;
    const now = Date.now();
    const elapsedMs = now - lastTickAt;
    lastTickAt = now;
    phaseRemainingMs -= elapsedMs;
    sessionRemainingMs -= elapsedMs;
    if (sessionRemainingMs <= 0) return finish();
    if (phaseRemainingMs <= 0) {
      if (phase === "out") cyclesCompleted += 1;
      phase = phase === "in" ? "hold" : phase === "hold" ? "out" : "in";
      const phaseDuration = phase === "in" ? INHALE_SECONDS : phase === "hold" ? HOLD_SECONDS : EXHALE_SECONDS;
      phaseRemainingMs = phaseDuration * 1000;
      updatePhase(true);
      return;
    }
    updatePhase();
  }

  function leaveExercise() {
    window.clearInterval(phaseTimer);
    stopSpeaking();
    onHome();
  }

  async function finish() {
    if (finished) return;
    finished = true;
    active = false;
    window.clearInterval(phaseTimer);
    stopSpeaking();
    const totalTimeSeconds = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0;
    await saveBreathingSession({ cyclesCompleted, totalTimeSeconds });
    root.replaceChildren(header(lang, { title: t(lang, "breathingName"), onBack: onHome }), el("div", { className: "breathing-complete screen" },
      el("div", { className: "breathing-rest-icon", "aria-hidden": "true" }, "○"),
      el("h2", {}, t(lang, "breathingComplete")),
      el("p", {}, t(lang, "breathingCompletedMessage")),
      el("p", {}, t(lang, "breathingClosing")),
      el("button", { className: "btn", type: "button", onClick: () => { finished = false; renderStart(); } }, t(lang, "startAgain")),
    ));
    speak(t(lang, "breathingCompletedMessage"));
  }

  renderStart();
}