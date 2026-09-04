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
let pausedByUser = false;
let resumeFallbackTimer = 0;

export function setVoiceLang(lang) {
  currentLang = Object.prototype.hasOwnProperty.call(LANG_MAP, lang) ? lang : "en";
}

export function getVoiceLang() {
  return currentLang;
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

function startUtterance(text, generation, onend) {
  if (generation !== speakGeneration) return;
  if (!("speechSynthesis" in window)) {
    if (onend) onend();
    return;
  }

  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) {
    window.setTimeout(() => startUtterance(text, generation, onend), 250);
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
    if (generation === speakGeneration && onend) onend();
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

export function speak(text, onend = null) {
  if (text == null) return;
  const next = String(text).trim();
  if (!next) return;

  lastSpokenText = next;
  if (!("speechSynthesis" in window)) {
    if (onend) onend();
    return;
  }

  const generation = ++speakGeneration;
  pausedByUser = false;
  if (resumeFallbackTimer) {
    window.clearTimeout(resumeFallbackTimer);
    resumeFallbackTimer = 0;
  }
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
    startUtterance(lastSpokenText, generation, onend);
    return;
  }

  speakTimer = window.setTimeout(() => {
    speakTimer = 0;
    startUtterance(lastSpokenText, generation, onend);
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

export function isSpeechPaused() {
  return pausedByUser;
}

export function toggleSpeaking() {
  if (!("speechSynthesis" in window)) return false;
  if (pausedByUser) {
    pausedByUser = false;
    try {
      window.speechSynthesis.resume();
    } catch {
      /* ignore */
    }
    if (resumeFallbackTimer) window.clearTimeout(resumeFallbackTimer);
    const phrase = lastSpokenText;
    // Some Chrome versions accept resume() but stay silent; restart the phrase if that happens.
    resumeFallbackTimer = window.setTimeout(() => {
      resumeFallbackTimer = 0;
      if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) speak(phrase);
    }, 1500);
    return false;
  }

  pausedByUser = true;
  try {
    window.speechSynthesis.pause();
  } catch {
    /* ignore */
  }
  return true;
}

export function stopSpeaking() {
  ++speakGeneration;
  pausedByUser = false;
  if (speakTimer) {
    window.clearTimeout(speakTimer);
    speakTimer = 0;
  }
  if (resumeFallbackTimer) {
    window.clearTimeout(resumeFallbackTimer);
    resumeFallbackTimer = 0;
  }
  activeUtterance = null;

  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}
