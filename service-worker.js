// PERBAIKAN: Nama CACHE diubah ke 'v2' untuk memaksa update
const CACHE_NAME = 'drainmaster-v2';

// PERBAIKAN: Menambahkan script PDF ke aset yang di-cache
// Ini akan membuat fitur PDF berfungsi saat offline
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf-autotable.umd.min.js'
];

// Install - cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { 
        if (k !== CACHE_NAME) {
          console.log('Service Worker: Deleting old cache', k);
          return caches.delete(k); 
        }
      })
    ))
  );
  self.clients.claim();
});

// Fetch - cache-first strategy
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Strategi: Network first untuk file HTML, Cache first untuk lainnya
  // Ini memastikan pengguna selalu mendapat HTML terbaru jika online
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          // Jika online, simpan ke cache dan kembalikan
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return resp;
        })
        .catch(() => {
          // Jika offline, ambil dari cache
          return caches.match(event.request).then(cached => cached || caches.match('/index.html'));
        })
    );
  } else {
    // Untuk aset lain (JS, CSS, gambar), gunakan cache-first
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return resp;
        });
      })
    );
  }
});

