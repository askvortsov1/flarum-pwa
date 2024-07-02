import { extend } from 'flarum/common/extend';
import { openDB, deleteDB } from 'idb';

import Page from 'flarum/common/components/Page';
import LinkButton from 'flarum/common/components/LinkButton';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import addShareButtons from './addShareButtons';
import addPushNotifications, { refreshSubscription } from './addPushNotifications';
import addNetworkAndInstallAlerts, { updateAlert } from './addNetworkAndInstallAlerts';

app.initializers.add('askvortsov/flarum-pwa', () => {
  const isInStandaloneMode = () =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');

  extend(Page.prototype, 'oninit', () => {
    const basePath = app.forum.attribute('basePath').trimRight('/');

    const registerSW = async () => {
      const dbPromise = openDB('keyval-store', 1, {
        upgrade(db) {
          db.createObjectStore('keyval');
        },
      });
      (await dbPromise).put('keyval', app.forum.data.attributes, 'flarum.forumPayload');

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener("controllerchange", updateAlert);        
        navigator.serviceWorker
          .register(basePath + '/sw', {
            scope: basePath + '/',
          })
          .then((sw) => {
            navigator.serviceWorker.ready.then(async () => {
              if (app.forum.attribute("swKillSwitch")) {
                sw.unregister();
                deleteDB('images-store');
                caches.delete('pwa-page');
                caches.delete("key-files");
                sw.pushManager.getSubscription().then((s) => s ? s.unsubscribe() : null);
                return;
              }
              app.sw = sw;
              refreshSubscription(sw);
            });
          });
      }

      if (!app.forum.attribute("swKillSwitch")) {
        const imgDB = await openDB('images-store', 1, {
          upgrade(db) {
            db.createObjectStore('images');
          }
        });
        const lastDBDate = imgDB.get('images', 'date');
        if (!lastDBDate || parseInt(new Date() - lastDBDate) / 1000 / 60 / 60 / 24 > 30) {
          await imgDB.clear('images');
          await imgDB.put('images', 'date', new Date());
        };
      }
    };

    const clearAppBadge = async () => {
      const dbPromise = openDB('keyval-store', 1, {
        upgrade(db) {
          db.createObjectStore('keyval');
        },
      });
      (await dbPromise).put('keyval', 0, 'Badges');
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge();
      };
    }

    registerSW();
    clearAppBadge();
  });

  extend(SessionDropdown.prototype, 'items', (items) => {
    if (isInStandaloneMode() && items.has('administration')) {
      items.replace(
        'administration',
        LinkButton.component(
          {
            icon: 'fas fa-wrench',
            href: app.forum.attribute('adminUrl'),
            target: '_self',
            external: true,
          },
          app.translator.trans('core.forum.header.admin_button')
        )
      );
    }
  });

  addShareButtons();
  addPushNotifications();
  addNetworkAndInstallAlerts();
});
