/* Qur'anLearn service worker — offline-first app shell + dataset + audio */
const VERSION = "quranlearn-v1";
const SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon.svg"];
const AUDIO_MAX = 250; // on-demand recitation cache cap (entries)

self.addEventListener("install", (e) => {
  // No skipWaiting here: a new version politely waits until the learner
  // taps "Update" in the UI — never mid-recitation.
  e.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() =>
        self.clients.matchAll({ type: "window" }).then((clients) => {
          clients.forEach((c) => c.postMessage({ type: "NOOR_SW_ACTIVATED", version: VERSION }));
        })
      )
  );
});

// UI may request an immediate takeover after the user taps "Update"
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

async function trimAudioCache(cache) {
  const keys = await cache.keys();
  const audioKeys = keys.filter((k) => new URL(k.url).hostname.endsWith("everyayah.com"));
  if (audioKeys.length > AUDIO_MAX) {
    const overflow = audioKeys.slice(0, audioKeys.length - AUDIO_MAX);
    await Promise.all(overflow.map((k) => cache.delete(k)));
  }
}

async function cacheFirstWithFill(request, { audio = false } = {}) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok) {
    const copy = res.clone();
    cache.put(request, copy);
    if (audio) trimAudioCache(cache);
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // App navigation — network-first so updates land, cached shell when offline
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put("/index.html", copy));
          return res;
        })
        .catch(() =>
          caches.match("/index.html").then((hit) => hit || caches.match("/"))
        )
    );
    return;
  }

  // Same-origin assets (hashed JS/CSS, icons, manifest)
  if (url.origin === self.location.origin) {
    e.respondWith(cacheFirstWithFill(req));
    return;
  }

  // Validated Qur'an dataset — cache-first so the mushaf opens offline
  if (url.hostname === "api.alquran.cloud") {
    e.respondWith(cacheFirstWithFill(req));
    return;
  }

  // Recitation audio — cached on first listen, bounded
  if (url.hostname.endsWith("everyayah.com")) {
    e.respondWith(cacheFirstWithFill(req, { audio: true }));
    return;
  }
});
