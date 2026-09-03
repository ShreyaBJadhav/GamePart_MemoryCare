const LANG_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  as: "as-IN",
  bn: "bn-IN",
  mni: "mni-IN",
};

let currentLang = "en";
let lastSpokenText = "";
let speakGeneration = 0;
let activeUtterance = null;
let speakTimer = 0;
let resumeWatch = 0;

export function setVoiceLang(lang) {
  currentLang = Object.prototype.hasOwnProperty.call(LANG_MAP, lang) ? lang : "en";
}

export function getVoiceLang() {
  return currentLang;
}

function ensureResumeWatch() {
  if (resumeWatch || !("speechSynthesis" in window)) return;
  resumeWatch = window.setInterval(() => {
    try {
      if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      /* ignore */
    }
  }, 250);
}

function pickVoice() {
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;
  const wanted = LANG_MAP[currentLang];
  const prefix = currentLang.slice(0, 2);
  return (
    voices.find((v) => v.lang === wanted)
    || voices.find((v) => (v.lang || "").toLowerCase().startsWith(prefix))
    || null
  );
}

function startUtterance(text, generation) {
  if (generation !== speakGeneration) return;
  if (!("speechSynthesis" in window)) return;

  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) {
    window.setTimeout(() => startUtterance(text, generation), 250);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_MAP[currentLang];
  utterance.rate = currentLang === "hi" ? 0.85 : 0.9;
  utterance.pitch = currentLang === "hi" ? 1.05 : 1;
  utterance.volume = 1;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    if (activeUtterance === utterance) activeUtterance = null;
  };
  utterance.onerror = () => {
    if (activeUtterance === utterance) activeUtterance = null;
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  try {
    window.speechSynthesis.resume();
  } catch {
    /* ignore */
  }
}

export function speak(text) {
  if (text == null) return;
  const next = String(text).trim();
  if (!next) return;

  lastSpokenText = next;
  if (!("speechSynthesis" in window)) return;

  ensureResumeWatch();
  const generation = ++speakGeneration;
  if (speakTimer) {
    window.clearTimeout(speakTimer);
    speakTimer = 0;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  activeUtterance = null;

  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isiOS) {
    startUtterance(lastSpokenText, generation);
    return;
  }

  speakTimer = window.setTimeout(() => {
    speakTimer = 0;
    startUtterance(lastSpokenText, generation);
  }, 80);
}

export function speakSequence(texts) {
  const sequence = texts
    .filter((text) => text != null)
    .map((text) => String(text).trim())
    .filter(Boolean)
    .join(" ");
  if (sequence) speak(sequence);
}

export function repeatLast() {
  if (!lastSpokenText) return;
  speak(lastSpokenText);
}
