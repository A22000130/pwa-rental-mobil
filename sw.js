var GHPATH = '/pwa-rental-mobil';
var APP_PREFIX = 'rmspwa_';
var VERSION = 'version_006';
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/css/styles.css`,
  `${GHPATH}/img/rental_icon.png`,
  `${GHPATH}/js/app.js`
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i]);
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})


// const CACHE_NAME = 'SW-001';
// const toCache = [
//   '/',
//   'manifest.webmanifest',
//   'js/app.js',
//   'img/rental_icon.png',
// ];
// self.addEventListener("beforeinstallprompt", (e) => {
//   e.preventDefault();
//   deferredPrompt = e;

//   showInstallPromotion();
// });
// self.addEventListener('install', function (event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function (cache) {
//         return cache.addAll(toCache)
//       })
//       .then(self.skipWaiting())
//   )
// })
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//       .catch(() => {
//         return caches.open(CACHE_NAME)
//           .then((cache) => {
//             return cache.match(event.request)
//           })
//       })
//   )
// })
// self.addEventListener('activate', function (event) {
//   event.waitUntil(
//     caches.keys()
//       .then((keyList) => {
//         return Promise.all(keyList.map((key) => {
//           if (key !== CACHE_NAME) {
//             console.log('[ServiceWorker] Hapus cache lama',
//               key)
//             return caches.delete(key)
//           }
//         }))
//       })
//       .then(() => self.clients.claim())
//   )
// })
