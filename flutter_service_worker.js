'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "b7cb313c933fd218fa8d663cc4023a99",
"assets/AssetManifest.json": "4d2fc5c922c671797af3162d3f53790a",
"assets/assets/fonts/Dystopia-Alternate-Bold.ttf": "f590472d78ab082ab587ea927839d21f",
"assets/assets/fonts/HardGrunge.ttf": "0c58e8ad18a14b02b2d4a9ee85fc6d4f",
"assets/assets/fonts/TechnicznaPomoc.ttf": "f4ff2dd3275fbc7e3361b9a23f871a3f",
"assets/assets/images/audience_vote.png": "1a9e628e5508646f4d57d1c55e7dd01a",
"assets/assets/images/bg1.png": "292e958ed950062bcef8e71c4ace9171",
"assets/assets/images/button.png": "7cc33a480caeaee23b1430902e4dc5f4",
"assets/assets/images/cover.png": "15667e457ce25e9c0e92313b8b9128d2",
"assets/assets/images/FRIENDOFGASLANDS-1.webp": "d9fcc7c92eb731dd9655a9d951bbb0c7",
"assets/assets/images/icons/audience_vote.png": "8185245bdb064f68c4f2ae28619c4ce5",
"assets/assets/images/icons/bullet.png": "98e9bf05cb6ba0c5311ca6617a851ddf",
"assets/assets/images/icons/checkmark.png": "5fd00c2389689891deb9d96fa0b92cc4",
"assets/assets/images/icons/fire.png": "cd53c5eeba8becb9e729d4a6291dc969",
"assets/assets/images/icons/ghost_rider.png": "b7a06e73eaf798a4d88ad396d6d6b0ac",
"assets/assets/images/icons/hazard.png": "e74e64c4716718d456dbafedbbb5a7de",
"assets/assets/images/icons/icons8-petrol-24.png": "11b013ac6326aacfc88c071c7c199311",
"assets/assets/images/icons/icons8-petrol-48.png": "db38c404c929f73d277f1590fa34e0a9",
"assets/assets/images/icons/icons8-petrol-96.png": "00f6c3b09b4141ac59fb59f61b30a901",
"assets/assets/images/icons/showing_off.png": "80167821c2d7f522f43d770471c47de0",
"assets/assets/images/icons/soul.png": "5289059c615ddd04873a9d87651544a4",
"assets/assets/images/Logo_A_Dark.webp": "95ba1e2434d45c42507d67cfbdd85717",
"assets/assets/images/screw.png": "6f8dfb87aa77573dda49900aedf63f3c",
"assets/FontManifest.json": "1fe3fa39f2270b51501e8a9737de4594",
"assets/fonts/MaterialIcons-Regular.otf": "54de89fa78f7c6854aa5fa3f1343410f",
"assets/NOTICES": "8c2bccd09c48c6809d00896628b3df07",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "ed4436c7b2ef1a4df128e1ccbfbd5516",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "8b11e1bf41156b43fe1b8ea97e63dd8b",
"icons/Icon-512.png": "117386fb1aeb15476ebfb564ff1e8906",
"icons/Icon-maskable-192.png": "8b11e1bf41156b43fe1b8ea97e63dd8b",
"icons/Icon-maskable-512.png": "117386fb1aeb15476ebfb564ff1e8906",
"index.html": "4548d79994c76623454db6fd2e568227",
"/": "4548d79994c76623454db6fd2e568227",
"main.dart.js": "69afa9af6412a9fbc4d35a69e1cf054d",
"manifest.json": "4b6938843f8cb21291a17e4de0fbc102",
"version.json": "b748dc40e0b7f6310ebaf82b5477e00d"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
