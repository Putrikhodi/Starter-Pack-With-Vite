// sw.js

// Workbox loader & setup (biarkan kode ini apa adanya, ini boilerplate dari Workbox)
if (!self.define) {
  let registry = {};
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      new Promise(resolve => {
        if ("document" in self) {
          const script = document.createElement("script");
          script.src = uri;
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          nextDefineUri = uri;
          importScripts(uri);
          resolve();
        }
      }).then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) return;

    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = { module: { uri }, exports, require };

    registry[uri] = Promise.all(
      depsNames.map(depName => specialDeps[depName] || require(depName))
    ).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}

// =======================================================================
// KONFIGURASI SERVICE WORKER
// =======================================================================

const CACHE_NAME = 'story-images-v4'; // Naikkan versi lagi untuk memastikan update
const CORE_CACHE_NAME = 'core-cache-v4'; // Naikkan versi lagi

const assetsToCache = self.__WB_MANIFEST;
const CORE_FILES = [
  '/',
  '/index.html',
  '/images/logo.png', // Pastikan path ini benar jika gambar logo ada di root /images/
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  // Tambahkan semua file penting yang dibutuhkan untuk offline di sini
  // Ini HARUS disesuaikan dengan struktur proyek Anda
  // Contoh:
  // '/scripts/main.js', // Jika main.js ada di scripts folder
  // '/scripts/router.js',
  // '/scripts/data/api.js',
  // '/scripts/data/indexeddb.js', // Penting jika diimpor di main thread (meski SW pakai native API)
  // '/scripts/utils/offline-sync.js', // Jika ada file ini
  // '/styles/main.css',
  // '/styles/responsive.css',
  // Jika menggunakan library seperti Leaflet yang dimuat via CDN, Anda mungkin perlu meng-cachenya juga
  // 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
  // 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
];

const STORY_IMAGE_API_BASE_URL = 'https://story-api.dicoding.dev/images/stories/';
const API_BASE_URL = 'https://story-api.dicoding.dev/v1'; // Base URL untuk API utama

// Konfigurasi IndexedDB - harus cocok dengan indexeddb.js
const DB_NAME = 'story-app-db';
const OFFLINE_STORE = 'offline-stories'; // Nama store untuk antrean offline

// =======================================================================
// EVENT LISTENERS SERVICE WORKER
// =======================================================================

// Event install - cache file inti
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event triggered.');
  event.waitUntil(
    caches.open(CORE_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core files...');
      // Tambahkan precache manifest dari Workbox di sini
      cache.addAll(assetsToCache); // <--- GUNAKAN assetsToCache
      return cache.addAll(CORE_FILES).catch((error) => {
        console.error('[Service Worker] Failed to cache some CORE_FILES:', error);
      });
    })
  );
  self.skipWaiting();
});

// =======================================================================
// HELPER FUNCTIONS UNTUK INDEXEDDB DI SERVICE WORKER (Native API)
// =======================================================================

async function openDbForSw() {
  return new Promise((resolve, reject) => {
    // Versi DB harus sama dengan yang di indexeddb.js
    const request = indexedDB.open(DB_NAME, 2);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(OFFLINE_STORE)) {
        db.createObjectStore(OFFLINE_STORE, { keyPath: 'id', autoIncrement: true });
      }
      console.log('[Service Worker] IndexedDB upgrade/creation for SW complete.');
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('[Service Worker] Error opening IndexedDB for SW:', event.target.error);
      reject(event.target.error);
    };
  });
}

async function getOfflineStoriesFromDb() {
  const db = await openDbForSw();
  const tx = db.transaction(OFFLINE_STORE, 'readonly');
  const store = tx.objectStore(OFFLINE_STORE);
  return store.getAll();
}

async function deleteOfflineStoryFromDb(id) {
  const db = await openDbForSw();
  const tx = db.transaction(OFFLINE_STORE, 'readwrite');
  const store = tx.objectStore(OFFLINE_STORE);
  await store.delete(id);
  await tx.done; // Pastikan transaksi selesai
  console.log('[Service Worker] Story deleted from offline queue:', id);
}


// =======================================================================
// EVENT LISTENERS SERVICE WORKER
// =======================================================================

// Event install - cache file inti
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event triggered.');
  event.waitUntil(
    caches.open(CORE_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core files...');
      return cache.addAll(CORE_FILES).catch((error) => {
        console.error('[Service Worker] Failed to cache some CORE_FILES:', error);
        // Lanjutkan instalasi meskipun ada beberapa file yang gagal di-cache
      });
    })
  );
  self.skipWaiting(); // Memaksa service worker baru untuk aktif segera
});

// Event activate - bersihkan cache lama
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event triggered.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== CORE_CACHE_NAME && !cacheName.startsWith('api-data-cache-')) { // Tambahkan pengecualian untuk cache API
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Memastikan service worker mengklaim klien segera
});

// Event fetch - tangani semua permintaan jaringan
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Strategi Cache-First untuk gambar dari story-api.dicoding.dev
  if (url.href.startsWith(STORY_IMAGE_API_BASE_URL)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[Service Worker] Mengembalikan gambar dari cache:', event.request.url);
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              console.warn('[Service Worker] Respon tidak valid untuk caching gambar:', event.request.url, response.status, response.type);
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              console.log('[Service Worker] Meng-cache gambar baru:', event.request.url);
              cache.put(event.request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            console.log('[Service Worker] Gagal mengambil/meng-cache gambar, menyajikan fallback:', event.request.url);
            return caches.match('/images/logo.png');
          });
      })
    );
    return;
  }

  // 2. Strategi Cache-First (dengan fallback ke Network) untuk file inti
  if (CORE_FILES.some(file => url.pathname === file || url.pathname.endsWith(file))) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).catch(() => {
          console.warn('[Service Worker] Gagal memuat file inti dari cache atau jaringan:', event.request.url);
          return new Response('Offline: Content not available', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        });
      })
    );
    return;
  }

  // 3. Strategi Network-First (dengan fallback ke Cache) untuk permintaan API data cerita
  if (url.href.startsWith(`${API_BASE_URL}/stories`)) {
      event.respondWith(
          fetch(event.request)
              .then(response => {
                  if (response.ok) {
                      const clonedResponse = response.clone();
                      caches.open('api-data-cache-v1').then(cache => {
                          cache.put(event.request, clonedResponse);
                      });
                  }
                  return response;
              })
              .catch(async () => {
                  const cachedResponse = await caches.match(event.request);
                  if (cachedResponse) {
                      console.log('[Service Worker] Mengembalikan data API dari cache:', event.request.url);
                      return cachedResponse;
                  }
                  console.error('[Service Worker] Gagal memuat data API dari jaringan maupun cache:', event.request.url);
                  return new Response('Offline: Data tidak tersedia', {
                      status: 503,
                      headers: { 'Content-Type': 'text/plain' },
                  });
              })
      );
      return;
  }

  // 4. Untuk semua permintaan lainnya (default): coba jaringan terlebih dahulu
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// =======================================================================
// BACKGROUND SYNC (UNTUK ADD STORY OFFLINE)
// =======================================================================

self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-new-stories') {
    console.log('[Service Worker] Event sync dipicu untuk cerita baru!');
    event.waitUntil(syncNewStories());
  }
});

async function syncNewStories() {
  console.log('[Service Worker] Mencoba menyinkronkan cerita baru...');
  const offlineStories = await getOfflineStoriesFromDb();

  if (offlineStories.length === 0) {
    console.log('[Service Worker] Tidak ada cerita offline yang perlu disinkronkan.');
    return;
  }

  for (const story of offlineStories) {
    try {
      console.log(`[Service Worker] Mengirim cerita ke server (ID: ${story.id})...`, story);

      const formData = new FormData();
      formData.append('description', story.description);
      // Konversi ArrayBuffer kembali ke Blob saat membuat FormData
      if (story.photoBlob instanceof ArrayBuffer) { // Pastikan ini ArrayBuffer
        formData.append('photo', new Blob([story.photoBlob], { type: story.photoType || 'image/jpeg' }), story.photoName || 'image.jpg');
      } else if (story.photoBlob instanceof Blob) { // Jika sudah Blob (antisipasi)
        formData.append('photo', story.photoBlob, story.photoName || 'image.jpg');
      } else {
        console.warn(`[Service Worker] photoBlob untuk cerita ID ${story.id} bukan Blob/ArrayBuffer. Tidak dapat mengirim gambar.`);
      }

      const response = await fetch(`${API_BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${story.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('[Service Worker] Cerita berhasil disinkronkan:', story.id);
        await deleteOfflineStoryFromDb(story.id);
      } else {
        const errorText = await response.text();
        console.error('[Service Worker] Gagal menyinkronkan cerita (status:', response.status, '):', story.id, errorText);
      }
    } catch (error) {
      console.error('[Service Worker] Error selama sinkronisasi cerita (ID:', story.id, '):', error);
    }
  }
  console.log('[Service Worker] Proses sinkronisasi cerita baru selesai.');
}


// =======================================================================
// PUSH NOTIFICATION & NOTIFICATION CLICK HANDLING
// =======================================================================

self.addEventListener('push', function(event) {
  console.log('[SW] Push event received.');

  let title = 'Notifikasi Baru';
  let options = {
    body: 'Ada notifikasi baru dari story!',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/icon-192x192.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: 'story-notification',
    renotify: true,
    data: {
      url: '/'
    }
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[SW] Payload:', payload);

      title = payload.title || title;
      options.body = payload.body || options.body;
      if (payload.icon) options.icon = payload.icon;
      if (payload.badge) options.badge = payload.badge;
      if (payload.url) options.data.url = payload.url;

    } catch (err) {
      console.warn('[SW] Gagal parse JSON payload push. Menggunakan data mentah:', err);
      options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});