self.addEventListener('install', e => {
  e.waitUntil(caches.open('clearcoin-v1').then(cache => cache.addAll(['/', '/style.css'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
