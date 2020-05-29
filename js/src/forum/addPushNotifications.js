import { extend } from "flarum/extend";
import NotificationGrid from "flarum/components/NotificationGrid";

export default () => {
  extend(NotificationGrid.prototype, "notificationMethods", function (items) {
    items.add("push", {
      name: "push",
      icon: "fas fa-bullhorn",
      label: app.translator.trans("askvortsov-pwa.forum.settings.push"),
    });
  });
};
