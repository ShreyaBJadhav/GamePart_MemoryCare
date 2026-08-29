# MemoryCare NER — Cognitive Games Module

Patient-side cognitive gaming module for **MemoryCare NER**, an offline-first Progressive Web App (PWA) built for elderly dementia patients in the North Eastern Region of India — Smart India Hackathon 2026.

This repo covers the **patient-side games, adaptive difficulty engine, local storage, and voice assistance**. Nurse/Family dashboards, backend sync, and the reminder system are separate, later-stage modules that will read from the same local data layer.

---

## Getting started

```bash
git clone https://github.com/ShreyaBJadhav/GamePart_MemoryCare.git
cd memorycare-ner
npm install
npm run dev
```

The dev server will print a local URL (typically `http://localhost:5173`) — open it in Chrome for the best PWA/DevTools support.

**Note:** the service worker is intentionally disabled in dev mode to avoid stale-cache issues while developing — it only activates in a production build (`npm run build`).

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend / build | Vite |
| Local storage | Dexie.js (wrapper over IndexedDB) |
| Voice output | Web Speech API (`SpeechSynthesisUtterance`) — English + Hindi |
| PWA | Web App Manifest, Service Worker, Cache API |
| Offline support | Fully offline after first load — no network calls at runtime |

Everything here is client-side only. No backend, API, or server database is part of this module — that's a separate future piece (Flask + PostgreSQL, per the team architecture doc).

---

## The 4 games

1. **Pattern Matching** — classic card-flip memory match
2. **Shape Sort** — rule-based selective attention task (e.g. "Tap all the circles" / "Find all the red objects"); not a sort-into-bins game
3. **Face-Name Recall** — shown an unlabeled photo, patient picks the correct person from 4 choices formatted as "Name (Relationship)"
4. **My Daily Routine** — patient reorders a shuffled set of their actual daily activities into the correct sequence

Each game has 5 difficulty levels, implemented as presets along continuous dimensions (pair count, sequence length, distractor count, time pressure) rather than a fixed "complete and you're done" ladder.

---

## Adaptive difficulty engine

Rule-based (not ML) — tracks accuracy, reaction time, mistakes, and attempts per session, shared across all 4 games:

- High accuracy + fast + few mistakes → level up by exactly 1
- Low accuracy + slow + many mistakes → level down by exactly 1
- Never more than one level change at a time
- A `manualLevelOverride` field on each patient/game record can cap or fix the level (caregiver-facing UI for this comes later)

---

## Voice assistance

Text-to-speech only — the app reads rules, questions, instructions, and feedback aloud in **English or Hindi**. This is not speech recognition; the patient does not speak back to control the app (that's a separate future feature).

A **"🔊 Repeat"** button on every game screen re-reads the last spoken content.

**Known gap:** NER regional languages (Assamese, Bodo, Manipuri, Khasi, Mizo, etc.) are not yet supported — browser TTS voices don't reliably cover them. Flagged as a future addition requiring a dedicated Indic TTS model.

---

## Testing offline behavior (important for this project)

1. Open the app once with internet on, so the service worker can install and cache assets
2. Open Chrome DevTools → **Application** tab → **Service Workers** — confirm one is registered and "activated"
3. In the **Network** tab, check **Offline**, then refresh the page — confirm the games still load and play with zero internet
4. Check **Application → IndexedDB** to inspect stored `game_results` — confirm each record has the correct `gameType` and starts with `sync_status: "PENDING"`

---

## Out of scope for this module

- Nurse and Family dashboards
- Backend / sync engine (only the `sync_status` data field is in place, not the actual sync logic)
- Speech-to-text / voice commands (planned future feature via Whisper-tiny)
- Face authentication/login (MobileFaceNet) — unrelated to the Face-Name Recall *game*
- Reminder system
- SQLite/wa-sqlite/OPFS storage (noted in the architecture doc as a future production target; this module uses IndexedDB via Dexie.js)

---

## Design principles

- Elderly-friendly UI: large buttons, high contrast, minimal navigation, few choices per screen
- No diagnostic language anywhere in patient-facing text (feedback describes the activity, never the patient's cognitive state)
- Cream `#FDF6EC` / terracotta `#D85A30` palette
