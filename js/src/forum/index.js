import { extend } from 'flarum/common/extend';
import { openDB } from 'idb';

import Page from 'flarum/common/components/Page';
import LinkButton from 'flarum/common/components/LinkButton';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import addShareButtons from './addShareButtons';
import addPushNotifications, { refreshSubscription } from './addPushNotifications';

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
        navigator.serviceWorker
          .register(basePath + '/sw', {
            scope: basePath + '/',
          })
          .then((sw) => {
            navigator.serviceWorker.ready.then(() => {
              app.sw = sw;
              refreshSubscription(sw);
            });
          });
      }
    };

    registerSW();
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
});
