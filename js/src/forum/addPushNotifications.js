import { extend } from 'flarum/common/extend';
import Alert from 'flarum/common/components/Alert';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import Page from 'flarum/common/components/Page';
import Icon from 'flarum/common/components/Icon';
import { usingAppleWebview, requestPushPermissions, requestPushPermissionState, requestPushToken, usePWABuilder } from './use-pwa-builder';

const subscribeUser = (save) => {
  return app.sw.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: app.forum.attribute('vapidPublicKey'),
    })
    .then((subscription) => {
      if (!save) return;

      app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/pwa/push',
        body: { subscription },
      });
    });
};

const pushEnabled = () => {
  if (!app.session.user) return false;

  const obj = app.session.user.preferences();
  let key;

  for (key in obj) {
    if ((typeof key === 'string' || key instanceof String) && key.startsWith('notify_') && key.endsWith('_push') && obj[key]) {
      return true;
    }
  }

  return false;
};

const supportsBrowserNotifications = () => 'Notification' in window;

export const refreshSubscription = async (sw) => {
  if (!app.cache.pwaRefreshed && 'Notification' in window && window.Notification.permission === 'granted' && pushEnabled())
    try {
      await subscribeUser(true);
    } catch (e) {
      if (!sw.pushManager) {
        return;
      }
      sw.pushManager.getSubscription().then((s) => s.unsubscribe().then(subscribeUser.bind(this, true)));
    }
  app.cache.pwaRefreshed = true;
};

const pushConfigured = () => {
  return app.forum.attribute('vapidPublicKey');
};

let { registerFirebasePushNotificationListeners, removeFirebasePushNotificationListeners, firebasePushNotificationState, hasFirebasePushState } =
  usePWABuilder();

export default () => {
  extend(Page.prototype, 'oncreate', () => {
    if (!pushConfigured()) return;

    const dismissAlert = () => {
      localStorage.setItem('askvortov-pwa.notif-alert.dismissed', JSON.stringify({ timestamp: new Date().getTime() }));
    };

    app.alerts.dismiss(app.cache.pwaNotifsAlert);

    if (
      !localStorage.getItem('askvortov-pwa.notif-alert.dismissed') &&
      'Notification' in window &&
      window.Notification.permission === 'default' &&
      pushEnabled()
    ) {
      app.cache.pwaNotifsAlert = app.alerts.show(
        {
          controls: [
            <Link class="Button Button--link" href={app.route('settings')} onclick={() => dismissAlert()}>
              {app.translator.trans('askvortsov-pwa.forum.alerts.optin_button')}
            </Link>,
          ],
          ondismiss: dismissAlert,
        },
        app.translator.trans('askvortsov-pwa.forum.alerts.optin')
      );
    }
  });

  extend('flarum/forum/components/NotificationGrid', 'notificationMethods', function (items) {
    if (!pushConfigured()) return;

    items.add('push', {
      name: 'push',
      icon: 'fas fa-mobile',
      label: app.translator.trans('askvortsov-pwa.forum.settings.push_header'),
    });
  });

  extend('flarum/forum/components/SettingsPage', 'notificationsItems', function (items) {
    if (usingAppleWebview()) return;

    if (!pushConfigured()) return;

    if (!supportsBrowserNotifications()) {
      items.add(
        'push-no-browser-support',
        Alert.component(
          {
            dismissible: false,
            controls: [
              <a class="Button Button--link" href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API">
                {app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.no_browser_support_button')}
              </a>,
            ],
          },
          [<Icon name="fas fa-exclamation-triangle" />, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.no_browser_support')]
        ),
        10
      );
      return;
    }

    if (window.Notification.permission === 'default') {
      if (!pushConfigured()) return;

      items.add(
        'push-optin-default',
        Alert.component(
          {
            itemClassName: 'pwa-setting-alert',
            dismissible: false,
            controls: [
              Button.component(
                {
                  className: 'Button Button--link',
                  onclick: () => {
                    window.Notification.requestPermission((res) => {
                      m.redraw();

                      if (res === 'granted') {
                        subscribeUser(true);
                      }
                    });
                  },
                },
                app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default_button')
              ),
            ],
          },
          [<Icon name="fas fa-exclamation-circle" />, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default')]
        ),
        10
      );
    } else if (window.Notification.permission === 'denied') {
      items.add(
        'push-optin-denied',
        Alert.component(
          {
            itemClassName: 'pwa-setting-alert',
            dismissible: false,
            type: 'error',
            controls: [
              <a
                class="Button Button--link"
                href="https://support.humblebundle.com/hc/en-us/articles/360008513933-Enabling-and-Disabling-Browser-Notifications-in-Various-Browsers"
              >
                {app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_denied_button')}
              </a>,
            ],
          },
          [<Icon name="fas fa-exclamation-triangle" />, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_denied')]
        ),
        10
      );
    }
  });

  extend('flarum/forum/components/SettingsPage', 'notificationsItems', function (items) {
    if (!usingAppleWebview()) return;

    if (!hasFirebasePushState('authorized')) {
      items.add(
        'firebase-push-optin-default',
        Alert.component(
          {
            itemClassName: 'pwa-setting-alert',
            dismissible: false,
            controls: [
              Button.component(
                {
                  className: 'Button Button--link',
                  onclick: () => requestPushPermissions(),
                },
                app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default_button')
              ),
            ],
          },
          [<Icon name="fas fa-exclamation-circle" />, app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default')]
        ),
        10
      );
    }
  });

  extend('flarum/forum/components/SettingsPage', 'oncreate', function () {
    registerFirebasePushNotificationListeners();
  });

  extend('flarum/forum/components/SettingsPage', 'onremove', function () {
    removeFirebasePushNotificationListeners();
  });
};
