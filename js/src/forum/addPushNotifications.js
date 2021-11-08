import { extend } from 'flarum/common/extend';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import Alert from 'flarum/common/components/Alert';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import Page from 'flarum/common/components/Page';
import icon from 'flarum/common/helpers/icon';

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

  extend(NotificationGrid.prototype, 'notificationMethods', function (items) {
    if (!pushConfigured()) return;

    items.add('push', {
      name: 'push',
      icon: 'fas fa-mobile',
      label: app.translator.trans('askvortsov-pwa.forum.settings.push_header'),
    });
  });

  extend(SettingsPage.prototype, 'notificationsItems', function (items) {
    if (!pushConfigured()) return;

    if (!('Notification' in window)) {
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
          [icon('fas fa-exclamation-triangle'), app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.no_browser_support')]
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
          [icon('fas fa-exclamation-circle'), app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_default')]
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
          [icon('fas fa-exclamation-triangle'), app.translator.trans('askvortsov-pwa.forum.settings.pwa_notifications.access_denied')]
        ),
        10
      );
    }
  });
};
