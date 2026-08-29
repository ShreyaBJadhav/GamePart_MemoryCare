import { clampLevel, describeAdaptive } from "./adaptive.js";

const DEFAULT_PATIENT_ID = 1;

export const GAME_TYPES = {
  pattern_matching: "pattern_matching",
  shape_sort: "shape_sort",
  face_name_recall: "face_name_recall",
  daily_routine: "daily_routine",
};

if (typeof Dexie === "undefined") {
  throw new Error("Dexie did not load. Serve this folder over http://, not file://.");
}

export const db = new Dexie("MemoryCareNER");

db.version(1).stores({
  patients: "++id",
  gameProgress: "++id, patientId, gameType, [patientId+gameType]",
  game_results: "++id, gameType, timestamp, sync_status",
});

export async function ensurePatient() {
  const existing = await db.patients.get(DEFAULT_PATIENT_ID);
  if (!existing) {
    await db.patients.put({
      id: DEFAULT_PATIENT_ID,
      language: "en",
    });
  }

  for (const gameType of Object.values(GAME_TYPES)) {
    const row = await db.gameProgress
      .where("[patientId+gameType]")
      .equals([DEFAULT_PATIENT_ID, gameType])
      .first();
    if (!row) {
      await db.gameProgress.add({
        patientId: DEFAULT_PATIENT_ID,
        gameType,
        currentLevel: 1,
        manualLevelOverride: null,
      });
    }
  }
}

export async function getLanguage() {
  const patient = await db.patients.get(DEFAULT_PATIENT_ID);
  return patient?.language === "hi" ? "hi" : "en";
}

export async function setLanguage(language) {
  await db.patients.update(DEFAULT_PATIENT_ID, {
    language: language === "hi" ? "hi" : "en",
  });
}

export async function getProgress(gameType) {
  return db.gameProgress
    .where("[patientId+gameType]")
    .equals([DEFAULT_PATIENT_ID, gameType])
    .first();
}

export async function getPlayLevel(gameType) {
  const progress = await getProgress(gameType);
  if (!progress) return 1;
  if (progress.manualLevelOverride != null) {
    return clampLevel(progress.manualLevelOverride);
  }
  return clampLevel(progress.currentLevel);
}

export async function saveGameResult(record) {
  return db.game_results.add({
    ...record,
    patientId: DEFAULT_PATIENT_ID,
    sync_status: "PENDING",
    timestamp: new Date().toISOString(),
  });
}

export async function applyAdaptiveAndSave(gameType, metrics) {
  let progress = await getProgress(gameType);
  if (!progress) {
    await ensurePatient();
    progress = await getProgress(gameType);
  }

  const playedLevel = clampLevel(metrics.level);
  const override = progress?.manualLevelOverride ?? null;
  const snapshot = describeAdaptive(playedLevel, metrics);
  const proposed = snapshot.nextLevel;

  console.info("[adaptive]", { gameType, override, ...snapshot });

  let storedLevel = progress ? clampLevel(progress.currentLevel) : playedLevel;
  if (override == null) {
    storedLevel = proposed;
    if (progress && progress.id != null) {
      await db.gameProgress.update(progress.id, { currentLevel: storedLevel });
    } else {
      await db.gameProgress.add({
        patientId: DEFAULT_PATIENT_ID,
        gameType,
        currentLevel: storedLevel,
        manualLevelOverride: null,
      });
    }
  } else {
    storedLevel = clampLevel(override);
  }

  await saveGameResult({
    gameType,
    game: gameType,
    level: playedLevel,
    attempts: metrics.attempts,
    mistakes: metrics.mistakes,
    accuracy_percent: String(metrics.accuracyPercent),
    avg_response_ms: metrics.avgResponseMs,
    total_time_seconds: metrics.totalTimeSeconds,
    extra: metrics.extra || null,
  });

  return { nextPlayLevel: storedLevel };
}
