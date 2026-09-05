# MemoryCare NER — Cognitive Games Module

Patient-side cognitive gaming module for **MemoryCare NER**, an offline-first Progressive Web App for elderly patients in the North Eastern Region of India — Smart India Hackathon 2026, team Elite's Alliance.

This folder is **static files only** (plus a tiny Flask app that serves them). There is no Node.js, npm, Vite, or build step.

---

## Getting started

```bash
pip install -r requirements.txt
python app.py
```

Then open `http://localhost:5000` in Chrome.

Service workers need `http://` or `https://`. Opening `index.html` via `file://` is a known limitation.

Flask only serves the existing static files. It does not add a database or API yet.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Native ES modules (plain `.js` files, no bundler) |
| Local storage | Dexie.js over IndexedDB (UMD file in `vendor/`) |
| Charts | Chart.js (UMD file in `vendor/`, same locally-vendored pattern as Dexie — not loaded from a CDN, since the service worker only caches same-origin requests) |
| Voice output | Web Speech API (`SpeechSynthesisUtterance`) — English + Hindi work reliably via live browser voices; Assamese, Bengali, and Manipuri text is fully supported everywhere, but spoken voice output for these three depends on the device/browser having a matching voice installed, which isn't guaranteed (known limitation, see below) |
| PWA | Hand-written `manifest.json` + `sw.js` |

After the first load, the app makes no network calls at runtime.

---

## Language support

The app supports **5 languages**: English, Hindi, Assamese, Bengali, Manipuri (Meitei script).

- On first launch, a dedicated language-selection screen is shown before anything else. Once a language is picked, it's stored and the entire app — home screen and all 4 games — renders only in that language. It can be changed later from Settings.
- All patient-facing text (instructions, questions, options, feedback) is fully translated across all 5 languages via `js/i18n.js`.
- The `t()` lookup function falls back to English (with a console warning) if a translation is missing or still a placeholder, so a content gap never shows raw broken text to a patient.

---

## The 4 games

1. **Pattern Matching** — card-flip memory match
2. **Shape Sort** — selective-attention task ("tap all the circles" / "find all the red objects"), rule and distractor pool randomized each round
3. **Face-Name Recall** — unlabeled face, pick `"Name (Relationship)"` from 4 choices; both the prompt and every answer option are read aloud
4. **Remember My Story** — the story text stays visible on screen throughout; the current question and its options are shown below it and only advance to the next question once answered correctly, so a story session is only ever marked complete once every question has been answered correctly. Stories play in a fixed, repeatable order per level (not randomized), so narration always matches the story shown.

Each game has **4 difficulty levels** (Level 1 & 2 = Easy, Level 3 = Medium, Level 4 = Hard), scaled along pair count, sequence length, distractor count, and time pressure rather than a fixed "complete and you're done" ladder.

Every game screen has "🔊 Repeat" and "⏹️ Stop" controls for voice playback — these appear only inside the 4 games, not on the home screen or other utility screens.

---

## Beyond the 4 games

Two additional activities sit alongside the games on the home screen (not counted among the "4 games," similar to Family Photos):

- **My Progress** — a Day / Week / Month activity dashboard with charts (sessions per game, accuracy trend) built with Chart.js, plus a summary of total activities and time spent. Reads from the same `game_results` and breathing-session data used elsewhere — no duplicate storage.
- **Breathing Exercise** — an unscored, guided calming activity: 4-second inhale, 4-second hold, 8-second exhale, repeated for either a quick 1-minute reset or a longer 3-5 minute session. Instructions are shown and spoken before starting. Logs a lightweight session record (cycles completed, duration) to its own Dexie table, separate from `game_results`, since it has no accuracy/level/scoring.

---

## Adaptive difficulty

Rule-based (not ML). Tracks accuracy, reaction time, mistakes, and attempts, independently per game:

- High accuracy + fast + few mistakes → level up by exactly 1
- Low accuracy + slow + many mistakes → level down by exactly 1
- Never more than one level change at a time
- `manualLevelOverride` is stored on each patient/game record (caregiver UI is later work, built separately as the Nurse dashboard)

New `game_results` rows always start with `sync_status: "PENDING"`. Nothing in this module sets `"SYNCED"`.

---

## Testing offline behavior

1. Open the app once over `http://` so the service worker can install
2. DevTools → Application → Service Workers — one worker, **activated**
3. Application → Cache Storage / the precache list — confirm `vendor/dexie.min.js` **and** `vendor/chart.min.js` are both present (both must be local files, never a CDN URL)
4. Network → Offline, then refresh — all 4 games, My Progress (including its charts), and the Breathing Exercise all still load and function
5. Application → IndexedDB → `game_results` — each record has `sync_status: "PENDING"`
6. Application → Manifest — cream `#FDF6EC` / terracotta `#D85A30`, icons present

---

## Known limitations

- **Voice output for Assamese, Bengali, and Manipuri is not guaranteed** — these languages are fully supported in text, but spoken TTS depends on whether the patient's device/browser has a matching voice available, which most don't by default. A dedicated pre-recorded-audio pipeline for these three languages (via Bhashini or similar) is planned but not yet fully populated with production audio.
- Speech recognition / voice commands are not implemented — this app only speaks to the patient, it does not listen.

---

## Out of scope for this module

- Nurse and Family dashboards (built separately by another team member; they read from this module's `game_results` and breathing-session data)
- SQLite backend and the sync engine
- Speech-to-text
- Face authentication
- Reminder system
- Switching storage away from Dexie/IndexedDB
