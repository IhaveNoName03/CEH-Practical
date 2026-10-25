const CACHE = 'ceh-portal-v1';
const ASSETS = [
  './',
  './index.html',
  './cheat_sheet.html',
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
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
