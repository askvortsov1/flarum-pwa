import { extend } from "flarum/extend";
import AdminNav from "flarum/components/AdminNav";
import AdminLinkButton from "flarum/components/AdminLinkButton";

import PWAPage from "./components/PWAPage";

app.initializers.add("askvortsov/flarum-pwa", () => {
  app.routes["askvortsov-pwa"] = { path: "/pwa", component: PWAPage };

  //app.extensionSettings["askvortsov-pwa"] = () => m.route.set(app.route("askvortsov-pwa"));

  extend(AdminNav.prototype, "items", (items) => {
    items.add(
      "pwa",
      <AdminLinkButton
        href={app.route("askvortsov-pwa")}
        icon="fas fa-mobile-alt"
        description={app.translator.trans("askvortsov-pwa.admin.nav.pwa_text")}
      >
        {app.translator.trans("askvortsov-pwa.admin.nav.pwa_button")}
      </AdminLinkButton>
    );
  });
});
