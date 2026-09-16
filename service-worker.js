/* ============================================================
   Familia Elizabeth — Service Worker
   IMPORTANT: bump CACHE_VERSION on every deploy. This is what
   forces every phone/PC to drop the old cached app and fetch
   the new index.html instead of silently reusing a stale copy
   (this was the cause of "Chart is not defined" persisting
   after the fix, and data looking out of sync on other devices).
   ============================================================ */
const CACHE_VERSION = 'v3';
const CACHE_NAME = 'familia-elizabeth-' + CACHE_VERSION;

/* Only truly static, rarely-changing files go here. The main
   index.html is NOT pre-cached — it is always fetched fresh
   from the network first (see fetch handler below), so a new
   deploy is picked up immediately instead of being masked by
   an old cached page. */
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting(); // activate the new SW immediately, don't wait for old tabs to close
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME) // delete every OLD versioned cache
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control of any already-open tabs right away
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Navigation requests (the app page itself, index.html): network-first.
  // This is the key fix — always try to get the latest deployed HTML/JS;
  // only fall back to a cached copy if there is truly no network at all.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Everything else (icons, manifest): cache-first, network fallback.
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
