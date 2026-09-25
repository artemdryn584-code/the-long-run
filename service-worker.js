// The first version of this worker was cache-first with a fixed cache name and
// no update path: it stored "/" and "/style.css" on install and then answered
// every matching request from that copy forever. Anyone who had visited the
// site kept seeing the page as it was on their first visit — a reload could not
// shift it, because a service worker answers before the network is consulted.
//
// This version:
//   - names the cache after a version, and deletes every other cache on activate,
//     so upgrading clears whatever the old worker stored;
//   - takes over open pages immediately (skipWaiting + clients.claim);
//   - serves documents network-first, so a deploy is visible on the next load and
//     the cache is only a fallback when the network is unavailable;
//   - serves other assets from cache but refreshes them in the background.
//
// Bump CACHE whenever the caching rules themselves change.
const CACHE = 'clearcoin-v3';
const OFFLINE_FALLBACK = '/';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll([OFFLINE_FALLBACK])).catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(names => Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  const copy = response.clone();
  caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;

  const wantsHtml =
    request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');

  if (wantsHtml) {
    // network first: a page the visitor can actually see is worth a round trip
    event.respondWith(
      fetch(request)
        .then(response => putInCache(request, response))
        .catch(() => caches.match(request).then(hit => hit || caches.match(OFFLINE_FALLBACK)))
    );
    return;
  }

  // assets: fast from cache, but replaced in the background for the next load
  event.respondWith(
    caches.match(request).then(hit => {
      const fromNetwork = fetch(request)
        .then(response => putInCache(request, response))
        .catch(() => hit);
      return hit || fromNetwork;
    })
  );
});
