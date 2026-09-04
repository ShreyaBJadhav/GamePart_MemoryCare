import { el, clear, header, levelSubtitle } from "./ui.js";
import { t } from "./i18n.js";
import { speak, setVoiceLang } from "./voice.js";
import { ensurePatient, getLanguage, setLanguage, getPlayLevel, GAME_TYPES } from "./db.js";
import { mountPatternMatching } from "./games/patternMatching.js";
import { mountShapeSort } from "./games/shapeSort.js";
import { mountFaceNameRecall } from "./games/faceNameRecall.js";
import { mountRememberMyStory } from "./games/rememberMyStory.js";
import { mountFamilyPhotos } from "./familyPeople.js";
import { mountProgress } from "./progress.js";
import { mountBreathing } from "./breathing.js";

const GAMES = [
  { id: GAME_TYPES.pattern_matching, nameKey: "patternName", blurbKey: "patternBlurb", mount: mountPatternMatching },
  { id: GAME_TYPES.shape_sort, nameKey: "shapeName", blurbKey: "shapeBlurb", mount: mountShapeSort },
  { id: GAME_TYPES.face_name_recall, nameKey: "faceName", blurbKey: "faceBlurb", mount: mountFaceNameRecall },
  { id: GAME_TYPES.remember_my_story, nameKey: "storyName", blurbKey: "storyBlurb", mount: mountRememberMyStory },
];

const LANGUAGE_OPTIONS = [
  ["en", "English"], ["hi", "हिन्दी"], ["as", "অসমীয়া"], ["bn", "বাংলা"], ["mni", "ꯃꯤꯇꯩꯂꯣꯟ"],
];

let homeIntroSpoken = false;

export async function startApp(root) {
  await ensurePatient();
  if (await getLanguage()) await showHome(root);
  else await showLanguageGate(root);
}

async function showLanguageGate(root) {
  clear(root);
  const gate = el("main", { className: "language-gate", role: "main" });
  for (const [language, label] of LANGUAGE_OPTIONS) {
    gate.append(el("button", {
      className: "language-option", type: "button",
      onClick: async () => { await setLanguage(language); await showHome(root); },
    }, label));
  }
  root.append(gate);
}

function showLanguageSettings(root, lang) {
  clear(root);
  const options = el("div", { className: "language-gate" });
  for (const [language, label] of LANGUAGE_OPTIONS) {
    options.append(el("button", {
      className: "language-option", type: "button",
      onClick: async () => { await setLanguage(language); await showHome(root); },
    }, label));
  }
  root.append(
    header(lang, { title: t(lang, "settings"), onBack: () => showHome(root) }),
    options,
  );
}

async function showHome(root) {
  const lang = await getLanguage();
  document.documentElement.lang = lang;
  setVoiceLang(lang);
  if (!homeIntroSpoken) {
    speak(t(lang, "appTag"));
    homeIntroSpoken = true;
  }

  clear(root);
  root.append(
    header(lang, { title: t(lang, "appTitle"), subtitle: t(lang, "appTag") }),
  );

  const grid = el("div", { className: "home-grid" });
  for (const game of GAMES) {
    const level = await getPlayLevel(game.id);
    grid.append(
      el("button", {
        className: "game-card",
        type: "button",
        onClick: () => openGame(root, game),
      },
        el("strong", {}, t(lang, game.nameKey)),
        el("span", {}, t(lang, game.blurbKey)),
        el("span", { style: { display: "block", marginTop: "8px", color: "#59595D" } }, levelSubtitle(lang, level)),
      ),
    );
  }

  root.append(el("main", { className: "screen" }, grid,
    el("button", {
      className: "btn breathing-home-btn",
      type: "button",
      onClick: () => mountBreathing(root, { lang, onHome: () => showHome(root) }),
    }, t(lang, "breathingName"), el("span", { className: "home-card-detail" }, t(lang, "breathingBlurb"))),
    el("button", {
      className: "btn progress-home-btn",
      type: "button",
      onClick: () => mountProgress(root, { lang, onBack: () => showHome(root) }),
    }, t(lang, "myProgress")),
    el("button", {
      className: "btn",
      type: "button",
      style: { width: "100%", marginTop: "18px" },
      onClick: () => mountFamilyPhotos(root, { lang, onBack: () => showHome(root) }),
    }, t(lang, "familyPhotos")),
    el("button", {
      className: "btn",
      type: "button",
      style: { width: "100%", marginTop: "12px", background: "#3B3B3F" },
      onClick: () => showLanguageSettings(root, lang),
    }, t(lang, "settings")),
  ));
}

async function openGame(root, game) {
  const lang = await getLanguage();
  setVoiceLang(lang);
  const level = await getPlayLevel(game.id);
  game.mount(root, {
    lang,
    level,
    onHome: () => showHome(root),
  });
}
