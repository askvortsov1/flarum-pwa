importScripts('assets/extensions/askvortsov-pwa/idb.js');

const image = /^(https?):\/\/[^\s/$.?#].[^\s]*\.(gif|jpg|jpeg|tiff|png|svg|webp)$/;
const keyFile = /^(https?):\/\/[^\s/$.?#].[^\s]*\.(js|css)$/;

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

const imgDBPromise = idb.openDB('images-store', 1, {
  upgrade(db) {
    db.createObjectStore('images');
  },
});

const imgStore = {
  async get(key) {
    return (await imgDBPromise).get('images', key);
  },
  async set(key, val) {
    return (await imgDBPromise).put('images', val, key);
  },
  async delete(key) {
    return (await imgDBPromise).delete('images', key);
  },
  async clear() {
    return (await imgDBPromise).clear('images');
  },
  async keys() {
    return (await imgDBPromise).getAllKeys('images');
  },
};

const pageCACHE = "pwa-page";
const keyFilesCache = "key-files";

const forumPayload = {};

// Replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline";
// Code below is deprecated. Set automatically by ServiceWorkerController.php
// const offlineFallbackPage = "offline";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("[PWA] Install event processing...");

  event.waitUntil(
    caches.open(pageCACHE).then(function (cache) {
      console.log("[PWA] Cached offline page during install.");

      return cache.add(offlineFallbackPage);
    })
  );

  const receiveInfo = async () => {
    const payload = await idbKeyval.get('flarum.forumPayload');
    Object.assign(forumPayload, payload);
  }

  receiveInfo();
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
  if (image.test(event.request.url)) {
    imgStore.get(event.request.url).then(res => {
      if (!res) {
        const fetchResponse = await fetch(event.request);
        imgStore.set(event.request.url, fetchResponse.clone());
        return fetchResponse;
      }

      return res;
    }).then(res => {
      event.respondWith(res);
    }).catch(error => {
      throw error;
    });
    return;
  }
  if (keyFile.test(event.request.url)) {
    const cache = await caches.open(keyFilesCache);
    cache.match(event.request).then(res => {
      if (
        forumPayload.debug && forumPayload.clockworkEnabled
      ) {
        return fetch(event.request);
      }
      if (!res) {
        const fetchResponse = await fetch(event.request);
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      }

      return res;
    }).then(res => {
      event.respondWith(res);
    }).catch(error => {
      throw error;
    });
    return;
  };
  event.respondWith(

    (await caches.open(keyFilesCache)).match(event.request).then(res => {
      if (
        event.request.method !== 'GET' ||
        forumPayload.debug && forumPayload.clockworkEnabled ||
        !res
      ) {
        return fetch(event.request);
      }

      return res;
    }).catch(error => {
      // The following validates that the request was for a navigation to a new document
      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        throw error;
      }

      return caches.open(pageCACHE).then(function (cache) {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then(function (response) {
    return caches.open(pageCACHE).then(function (cache) {
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
    console.log(event.data.json());

    if ('clearAppBadge' in navigator) {
      const Badges = await idbKeyval.get('Badges') + 1;
      await idbKeyval.set('Badges', Badges);
      navigator.setAppBadge(Badges);
    }

    const options = {
      body: event.data.json().content,
      icon: event.data.json().icon,
      badge: event.data.json().badge,
      data: {
        link: event.data.json().link
      }
    };

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
