// Familia Elizabeth — Service Worker
// Lengo: kuruhusu app "iwe installable" kama PWA, na kuhifadhi ganda (shell) la app
// ili ifunguke haraka hata kama mtandao ni dhaifu. Data halisi bado inatoka Firebase moja kwa moja.

const CACHE_NAME = 'familia-elizabeth-v1';
const SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first kwa kila kitu (data ya Firebase haiathiriwi na huduma hii kwa sababu
// maombi yake huenda moja kwa moja kwa firestore.googleapis.com, si kwa faili za tovuti).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(()=>{});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
