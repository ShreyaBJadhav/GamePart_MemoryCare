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
| Voice output | Web Speech API (`SpeechSynthesisUtterance`) — English + Hindi |
| PWA | Hand-written `manifest.json` + `sw.js` |

After the first load, the app makes no network calls at runtime.

---

## The 4 games

1. **Pattern Matching** — card-flip memory match
2. **Shape Sort** — selective-attention task ("tap all the circles" / "tap all the orange shapes")
3. **Face-Name Recall** — unlabeled face, pick `"Name (Relationship)"` from 4 choices
4. **My Daily Routine** — reorder shuffled daily activities (tap Up / Down, not drag)

Each game has 5 difficulty levels along pair count, sequence length, distractor count, and time pressure.

---

## Adaptive difficulty

Rule-based (not ML). Tracks accuracy, reaction time, mistakes, and attempts:

- High accuracy + fast + few mistakes → level up by exactly 1
- Low accuracy + slow + many mistakes → level down by exactly 1
- Never more than one level change at a time
- `manualLevelOverride` is stored on each patient/game record (caregiver UI is later work)

New `game_results` rows always start with `sync_status: "PENDING"`. Nothing in this module sets `"SYNCED"`.

---

## Testing offline behavior

1. Open the app once over `http://` so the service worker can install
2. DevTools → Application → Service Workers — one worker, **activated**
3. Network → Offline, then refresh — all 4 games still load
4. Application → IndexedDB → `game_results` — each record has `sync_status: "PENDING"`
5. Application → Manifest — cream `#FDF6EC` / terracotta `#D85A30`, icons present

---

## Out of scope for this module

- Nurse and Family dashboards
- SQLite backend and the sync engine
- Speech-to-text
- Face authentication
- Reminder system
- Switching storage away from Dexie/IndexedDB
