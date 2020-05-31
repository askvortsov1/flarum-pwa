importScripts('assets/extensions/askvortsov-pwa/idb.js');

const dbPromise = idb.openDB('keyval-store', 1, {
  upgrade(db) {
    db.createObjectStore('keyval');
  },
});

const idbKeyval = {
  async get(key) {
    return (await dbPromise).get('keyval', key);
  },
  async set(key, val) {
    return (await dbPromise).put('keyval', val, key);
  },
  async delete(key) {
    return (await dbPromise).delete('keyval', key);
  },
  async clear() {
    return (await dbPromise).clear('keyval');
  },
  async keys() {
    return (await dbPromise).getAllKeys('keyval');
  },
};

const CACHE = "pwa-page";

const forumPayload = {};

// Replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline";
const offlineFallbackPage = "/offline";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
    console.log("[PWA] Install event processing...");

    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            console.log("[PWA] Cached offline page during install.");

            if (offlineFallbackPage === "ToDo-replace-this-name.html") {
                return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
            }

            return cache.add(offlineFallbackPage);
        })
    );

  const receiveInfo = async () => {
    const payload = await idbKeyval.get('flarum.forumPayload');
    Object.assign(forumPayload, payload);
  }

  receiveInfo();
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request).catch(function (error) {
            // The following validates that the request was for a navigation to a new document
            if (
                event.request.destination !== "document" ||
                event.request.mode !== "navigate"
            ) {
                return;
            }

            console.error("[PWA] Network request failed. Serving offline page " + error);
            return caches.open(CACHE).then(function (cache) {
                return cache.match(offlineFallbackPage);
            });
        })
    );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
    const offlinePageRequest = new Request(offlineFallbackPage);

    return fetch(offlineFallbackPage).then(function (response) {
        return caches.open(CACHE).then(function (cache) {
            console.log("[PWA] Offline page updated from refreshOffline event: " + response.url);
            return cache.put(offlinePageRequest, response);
        });
    });
});

self.addEventListener('push', function (event) {
  function isJSON(str) {
    try {
      return (JSON.parse(str) && !!str);
    } catch (e) {
      return false;
    }
  }

  if (isJSON(event.data.text())) {
    const options = {
      body: event.data.json().content,
      data: {
        link: event.data.json().link
      }
    };

    if (forumPayload.faviconUrl) {
      options.icon = forumPayload.faviconUrl;
    }

    const promiseChain = self.registration.showNotification(event.data.json().title, options);

    event.waitUntil(promiseChain);
  } else {
    console.log('This push event has no data.');
  }
});

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close();

  if (event.notification.data && event.notification.data.link) {
    const promiseChain = clients.openWindow(event.notification.data.link);
    event.waitUntil(promiseChain);
  }
});
