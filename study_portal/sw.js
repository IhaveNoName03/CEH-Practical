const CACHE = 'ceh-portal-v4';
const ASSETS = [
  './',
  './index.html',
  './cheat_sheet.html',
  './practice.html',
  './exam_checklist.html',
  './module_02.html',
  './module_03.html',
  './module_04.html',
  './module_05.html',
  './module_06.html',
  './module_07.html',
  './module_08.html',
  './module_09.html',
  './module_10.html',
  './module_11.html',
  './module_12.html',
  './module_13.html',
  './module_14.html',
  './module_15.html',
  './module_16.html',
  './module_17.html',
  './module_18.html',
  './module_19.html',
  './module_20.html',
  './style.css',
  './app.js',
  './manifest.json'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const accept = e.request.headers.get('accept') || '';
  const isHTML = e.request.mode === 'navigate' || accept.includes('text/html');
  if (isHTML) {
    // Network-first for pages: always try fresh, fall back to cache offline
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        return res;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }
  // Cache-first for static assets, with background revalidation
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
