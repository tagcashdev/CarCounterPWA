const CACHE_NAME = 'tally-up-cache';
const urlsToCache = [
  './',
  './index.html',
  './dist/styles.css',
  './src/js/app.js',
];


self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
          return cache.addAll(FILES_TO_CACHE);
      }).then(() => {
          self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
      caches.match(event.request).then(response => {
          return response || fetch(event.request).then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                  caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, networkResponse.clone());
                  });
              }
              return networkResponse;
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});