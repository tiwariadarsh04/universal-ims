const CACHE_NAME = "ims-v3"; // Bump version to force refresh
const OFFLINE_URL = '/offline.html';

// Only cache essential files that are guaranteed to exist
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html', // Make sure this file exists
  '/favicon.ico'
];

// Install event handler with improved error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service worker cache opened');
        
        // First check which assets exist before trying to cache them all
        return Promise.all(
          ASSETS_TO_CACHE.map(url => 
            fetch(url, { cache: 'no-store' })
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
                console.log(`Failed to fetch: ${url}`);
                return Promise.resolve(); // Continue even if one asset fails
              })
              .catch(err => {
                console.log(`Error caching ${url}:`, err);
                return Promise.resolve(); // Continue even if one asset fails
              })
          )
        );
      })
      .catch(err => console.error('Cache initialization error:', err))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and browser extensions
  if (
    event.request.method !== 'GET' || 
    event.request.url.startsWith('chrome-extension:') ||
    event.request.url.includes('__')
  ) {
    return;
  }

  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses from our origin
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache))
            .catch(err => console.log('Cache put error:', err));
        }
        return response;
      })
      .catch(() => {
        // For HTML documents, return offline page
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match(OFFLINE_URL).then(response => 
            response || new Response('You are offline and the offline page is not available.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html'
              })
            })
          );
        }
        // For other assets, try cache
        return caches.match(event.request).then(response => 
          response || Promise.reject('Not found in cache')
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => 
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      )
    ).then(() => {
      console.log('Service worker activated, cache purged');
    })
  );
  self.clients.claim();
});