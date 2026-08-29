import { el, clear, header } from "./ui.js";
import { t } from "./i18n.js";
import { speak, setVoiceLang } from "./voice.js";
import { ensurePatient, getLanguage, setLanguage, getPlayLevel, GAME_TYPES } from "./db.js";
import { mountPatternMatching } from "./games/patternMatching.js";
import { mountShapeSort } from "./games/shapeSort.js";
import { mountFaceNameRecall } from "./games/faceNameRecall.js";
import { mountDailyRoutine } from "./games/dailyRoutine.js";

const GAMES = [
  { id: GAME_TYPES.pattern_matching, nameKey: "patternName", blurbKey: "patternBlurb", mount: mountPatternMatching },
  { id: GAME_TYPES.shape_sort, nameKey: "shapeName", blurbKey: "shapeBlurb", mount: mountShapeSort },
  { id: GAME_TYPES.face_name_recall, nameKey: "faceName", blurbKey: "faceBlurb", mount: mountFaceNameRecall },
  { id: GAME_TYPES.daily_routine, nameKey: "routineName", blurbKey: "routineBlurb", mount: mountDailyRoutine },
];

let homeIntroSpoken = false;

export async function startApp(root) {
  await ensurePatient();
  await showHome(root);
}

async function showHome(root) {
  const lang = await getLanguage();
  setVoiceLang(lang);
  if (!homeIntroSpoken) {
    speak(t(lang, "appTag"));
    homeIntroSpoken = true;
  }

  clear(root);
  root.append(
    header(lang, { title: t(lang, "appTitle"), subtitle: t(lang, "appTag") }),
  );

  const langRow = el("div", { className: "lang-row" },
    el("button", {
      className: `btn${lang === "en" ? " active" : ""}`,
      type: "button",
      onClick: async () => {
        await setLanguage("en");
        await showHome(root);
      },
    }, t(lang, "english")),
    el("button", {
      className: `btn${lang === "hi" ? " active" : ""}`,
      type: "button",
      onClick: async () => {
        await setLanguage("hi");
        await showHome(root);
      },
    }, t(lang, "hindi")),
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
        el("span", { style: { display: "block", marginTop: "8px", color: "#59595D" } }, `${t(lang, "level")} ${level}`),
      ),
    );
  }

  root.append(el("main", { className: "screen" }, langRow, grid));
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
