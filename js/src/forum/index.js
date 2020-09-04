import { extend } from "flarum/extend";
import { openDB } from "idb";

import Page from "flarum/components/Page";
import LinkButton from "flarum/components/LinkButton";
import SessionDropdown from "flarum/components/SessionDropdown";
import addShareButtons from "./addShareButtons";
import addPushNotifications, {
  refreshSubscription,
} from "./addPushNotifications";

app.initializers.add("askvortsov/flarum-pwa", () => {
  extend(Page.prototype, "oninit", () => {
    const basePath = app.forum.attribute("basePath").trimRight("/");

    const registerSW = async () => {
      const dbPromise = openDB("keyval-store", 1, {
        upgrade(db) {
          db.createObjectStore("keyval");
        },
      });
      (await dbPromise).put(
        "keyval",
        app.forum.data.attributes,
        "flarum.forumPayload"
      );

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register(basePath + "/sw", {
            scope: basePath + "/",
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

  extend(SessionDropdown.prototype, "items", (items) => {
    const isInStandaloneMode = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://");
    if (isInStandaloneMode() && items.has("administration")) {
      items.replace(
        "administration",
        LinkButton.component(
          {
            icon: "fas fa-wrench",
            href: app.forum.attribute("adminUrl"),
            target: "_self",
          },
          app.translator.trans("core.forum.header.admin_button")
        )
      );
    }
  });

  addShareButtons();
  addPushNotifications();
});
