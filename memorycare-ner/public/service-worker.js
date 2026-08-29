// service-worker.js
//
// Minimal offline-first service worker for MemoryCare NER.
// Caches the app shell on install, then serves from cache first
// with a network fallback — so the patient-side app keeps working
// with zero connectivity after the first successful load.
//
// This is intentionally simple (cache-first for app shell assets).
// Your team's Planning/Deployment owner (Shrikant) should extend
// this once the real backend sync API exists — this file only
// handles static asset caching, NOT data sync (that's a separate
// concern, per the architecture doc's sync_queue design).

const CACHE_NAME = "memorycare-ner-v1";

// Add every static file your app actually serves — this is a
// starter list; expand it to match your real build output
// (e.g. the hashed JS/CSS filenames Vite/CRA generates).
const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ---- Install: cache the app shell ----
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_FILES);
    })
  );
  self.skipWaiting();
});

// ---- Activate: clean up old caches on version bump ----
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ---- Fetch: cache-first, fall back to network, fall back to
// nothing gracefully if both fail (offline + not yet cached) ----
self.addEventListener("fetch", (event) => {
  // Only handle GET requests — never intercept POST/PUT (those are
  // your sync/API calls and should hit the network or your sync
  // queue logic, not this cache).
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache successful same-origin responses for next time offline
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.url.startsWith(self.location.origin)
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline and not cached — nothing sensible to return for
          // most assets. For navigation requests, fall back to the
          // cached app shell so the app still opens.
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
