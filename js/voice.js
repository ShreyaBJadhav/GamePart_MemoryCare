const LANG_MAP = {
  en: "en-IN",
  hi: "hi-IN",
};

let currentLang = "en";
let lastText = "";

export function setVoiceLang(lang) {
  currentLang = lang === "hi" ? "hi" : "en";
}

export function getVoiceLang() {
  return currentLang;
}

export function speak(text) {
  if (!text) return;
  lastText = text;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG_MAP[currentLang];
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function repeatLast() {
  if (lastText) speak(lastText);
}
