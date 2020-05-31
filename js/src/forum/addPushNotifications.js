import { extend } from "flarum/extend";
import NotificationGrid from "flarum/components/NotificationGrid";
import SettingsPage from "flarum/components/SettingsPage";
import Alert from "flarum/components/Alert";
import Button from "flarum/components/Button";
import Page from "flarum/components/Page";
import icon from "flarum/helpers/icon";

const subscribeUser = (save) => {
  return app.sw.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: app.forum.attribute("vapidPublicKey"),
    })
    .then((subscription) => {
      if (!save) return;

      app.request({
        method: "POST",
        url: app.forum.attribute("apiUrl") + "/pwa/push",
        data: { subscription },
      });
    });
};

const pushEnabled = () => {
  if (!app.session.user) return false;

  const obj = app.session.user.preferences();
  let key;

  for (key in obj) {
    if (
      (typeof key === "string" || key instanceof String) &&
      key.startsWith("notify_") &&
      key.endsWith("_push") &&
      obj[key]
    ) {
      return true;
    }
  }

  return false;
};

export const refreshSubscription = async (sw) => {
  if (
    !app.cache.pwaRefreshed &&
    "Notification" in window &&
    window.Notification.permission === "granted" &&
    pushEnabled()
  )
    try {
      await subscribeUser(true);
    } catch (e) {
      console.log(e);
      sw.pushManager
        .getSubscription()
        .then((s) => s.unsubscribe().then(subscribeUser.bind(this, true)));
    }
  app.cache.pwaRefreshed = true;
};

const pushConfigured = () => {
  return app.forum.attribute("vapidPublicKey");
};

export default () => {
  extend(Page.prototype, "config", (res, isInitialized) => {
    if (isInitialized) return;
    if (!pushConfigured()) return;

    app.alerts.dismiss(app.cache.pwaNotifsAlert);

    const pwaAlertDismissed = () => {
      const obj = JSON.parse(
        localStorage.getItem("askvortov-pwa.notif-alert.dismissed")
      );

      if (!obj) return false;

      const timestamp = new Date(obj.timestamp);
      const currentTime = new Date();
      currentTime.setDate(currentTime.getDate() - 7);

      return timestamp > currentTime;
    };

    if (
      !pwaAlertDismissed() &&
      "Notification" in window &&
      window.Notification.permission === "default" &&
      pushEnabled()
    ) {
      app.alerts.show(
        (app.cache.pwaNotifsAlert = new Alert({
          children: app.translator.trans("askvortsov-pwa.forum.alerts.optin"),
          controls: [
            <a
              class="Button Button--link"
              href={app.route("settings")}
              config={m.route}
            >
              {app.translator.trans("askvortsov-pwa.forum.alerts.optin_button")}
            </a>,
          ],
          ondismiss: () => {
            localStorage.setItem(
              "askvortov-pwa.notif-alert.dismissed",
              JSON.stringify({ timestamp: new Date().getTime() })
            );
            app.cache.pwaNotifsAlertDismissed = true;
          },
        }))
      );
    }
  });

  extend(NotificationGrid.prototype, "notificationMethods", function (items) {
    if (!pushConfigured()) return;

    items.add("push", {
      name: "push",
      icon: "fas fa-mobile",
      label: app.translator.trans("askvortsov-pwa.forum.settings.push_header"),
    });
  });

  extend(SettingsPage.prototype, "notificationsItems", function (items) {
    if (!pushConfigured()) return;

    if (!("Notification" in window)) {
      items.add(
        "push-no-browser-support",
        Alert.component({
          dismissible: false,
          children: [
            icon("fas fa-exclamation-triangle"),
            app.translator.trans(
              "askvortsov-pwa.forum.settings.pwa_notifications.no_browser_support"
            ),
          ],
          controls: [
            <a
              class="Button Button--link"
              href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API"
            >
              {app.translator.trans(
                "askvortsov-pwa.forum.settings.pwa_notifications.no_browser_support_button"
              )}
            </a>,
          ],
        }),
        10
      );
      return;
    }

    if (window.Notification.permission === "default") {
      if (!pushConfigured()) return;

      items.add(
        "push-optin-default",
        Alert.component({
          itemClassName: "pwa-setting-alert",
          dismissible: false,
          children: [
            icon("fas fa-exclamation-circle"),
            app.translator.trans(
              "askvortsov-pwa.forum.settings.pwa_notifications.access_default"
            ),
          ],
          controls: [
            Button.component({
              className: "Button Button--link",
              children: app.translator.trans(
                "askvortsov-pwa.forum.settings.pwa_notifications.access_default_button"
              ),
              onclick: () => {
                window.Notification.requestPermission((res) => {
                  m.redraw();

                  if (res === "granted") {
                    subscribeUser(true);
                  }
                });
              },
            }),
          ],
        }),
        10
      );
    } else if (window.Notification.permission === "denied") {
      items.add(
        "push-optin-denied",
        Alert.component({
          itemClassName: "pwa-setting-alert",
          dismissible: false,
          type: "error",
          children: [
            icon("fas fa-exclamation-triangle"),
            app.translator.trans(
              "askvortsov-pwa.forum.settings.pwa_notifications.access_denied"
            ),
          ],
          controls: [
            <a
              class="Button Button--link"
              href="https://support.humblebundle.com/hc/en-us/articles/360008513933-Enabling-and-Disabling-Browser-Notifications-in-Various-Browsers"
            >
              {app.translator.trans(
                "askvortsov-pwa.forum.settings.pwa_notifications.access_denied_button"
              )}
            </a>,
          ],
        }),
        10
      );
    }
  });
};
