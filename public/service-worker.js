/**
 * Service Worker for Sri Chakra Eye Clinic Website
 * Provides offline support and performance caching
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `sri-chakra-clinic-${CACHE_VERSION}`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/pages/homepage.html',
  '/pages/about_sri_chakra_eye_clinic.html',
  '/pages/services_overview.html',
  '/css/main.css',
  '/public/manifest.json',
  '/public/favicon.ico'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching essential assets');
        return cache.addAll(ASSETS_TO_CACHE).catch(err => {
          console.warn('Some assets failed to cache:', err);
          // Don't fail the install if some assets can't be cached
        });
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch event - cache-first strategy for assets, network-first for HTML
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // HTML pages - network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            // Cache successful response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
            return response;
          }
          // Return cached version if network fails
          return caches.match(request);
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Assets (CSS, JS, images) - cache first
  if (request.url.includes('/css/') ||
      request.url.includes('/js/') ||
      request.url.includes('/pages/images/') ||
      request.url.includes('.webp') ||
      request.url.includes('.png') ||
      request.url.includes('.jpg')) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
        .then(response => {
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Return placeholder for failed images
          if (request.destination === 'image') {
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                <rect fill="#f3f4f6" width="200" height="200"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af">
                  Offline
                </text>
              </svg>`,
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          return caches.match(request);
        })
    );
    return;
  }

  // Default strategy
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker loaded');
