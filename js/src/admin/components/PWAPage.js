import Page from "flarum/components/Page";
import Button from "flarum/components/Button";
import Alert from "flarum/components/Alert";
import LoadingIndicator from "flarum/components/LoadingIndicator";
import Switch from "flarum/components/Switch";
import saveSettings from "flarum/utils/saveSettings";

import PWALogoUploadButton from "./PWALogoUploadButton";

export default class PWAPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);

    this.saving = false;
    this.refresh();
  }

  refresh() {
    this.loading = true;
    const settings = app.data.settings;

    this.status_messages = [];
    this.manifest = {};
    this.sizes = [];
    this.values = {};

    this.fields = ["askvortsov-pwa.longName", "askvortsov-pwa.backgroundColor"];
    this.fields.forEach(
      (key) =>
        (this.values[key] = m.stream(
          settings[key] !== undefined ? settings[key] : ""
        ))
    );

    // if (Array.isArray(settings['askvortsov-pwa.categories'])) {
    //     this.values['askvortsov-pwa.categories'] = m.stream(settings['askvortsov-pwa.categories'].join(','));
    // }

    app
      .request({
        method: "GET",
        url: app.forum.attribute("apiUrl") + "/pwa/settings",
      })
      .then((response) => {
        this.manifest = response["data"]["attributes"]["manifest"];
        this.sizes = response["data"]["attributes"]["sizes"];
        this.status_messages =
          response["data"]["attributes"]["status_messages"];

        this.loading = false;
        m.redraw();
      });
  }

  checkExistence(url) {
    let http = new XMLHttpRequest();

    http.open("HEAD", url, false);
    http.send();

    return http.status != 404;
  }

  view() {
    if (this.loading || this.saving) {
      return (
        <div className="PWAPage">
          <div className="container">
            <LoadingIndicator />
          </div>
        </div>
      );
    }

    return (
      <div className="PWAPage">
        <div className="container">
          <form onsubmit={this.onsubmit.bind(this)}>
            <h2>{app.translator.trans("askvortsov-pwa.admin.pwa.heading")}</h2>
            <div className="helpText">
              {app.translator.trans("askvortsov-pwa.admin.pwa.text")}
            </div>

            <div class="statusCheck">
              <legend>
                {app.translator.trans(
                  "askvortsov-pwa.admin.pwa.status_check_heading"
                )}
              </legend>
              {this.status_messages.map((message) => (
                <Alert type={message.type} dismissible={false}>
                  {[message.message]}
                </Alert>
              ))}
            </div>

            <fieldset class="parent">
              <fieldset>
                <legend>
                  {app.translator.trans(
                    "askvortsov-pwa.admin.pwa.about.heading"
                  )}
                </legend>
                <div className="helpText">
                  {app.translator.trans(
                    "askvortsov-pwa.admin.pwa.about.short_name_text"
                  )}
                </div>
                <input
                  className="FormControl"
                  value={this.manifest.short_name}
                  disabled={true}
                ></input>
              </fieldset>
              <fieldset>
                <div className="helpText">
                  {app.translator.trans(
                    "askvortsov-pwa.admin.pwa.about.name_text"
                  )}
                </div>
                <input
                  className="FormControl"
                  bidi={this.values["askvortsov-pwa.longName"]}
                  required={true}
                />
              </fieldset>
              <fieldset>
                <div className="helpText">
                  {app.translator.trans(
                    "askvortsov-pwa.admin.pwa.about.description_text"
                  )}
                </div>
                <textarea
                  className="FormControl"
                  value={this.manifest.description}
                  disabled={true}
                >
                  {this.manifest.description}
                </textarea>
              </fieldset>
            </fieldset>

            <fieldset class="parent">
              <fieldset>
                <legend>
                  {app.translator.trans(
                    "askvortsov-pwa.admin.pwa.colors.heading"
                  )}
                </legend>
                <div className="helpText">
                  {app.translator.trans(
                    "askvortsov-pwa.admin.pwa.colors.theme_color_text"
                  )}
                </div>
                <input
                  className="FormControl"
                  type="text"
                  placeholder="#aaaaaa"
                  value={this.manifest.theme_color}
                  disabled={true}
                />
              </fieldset>
              <fieldset>
                <div className="helpText">
                  {app.translator.trans(
                    "askvortsov-pwa.admin.pwa.colors.background_color_text"
                  )}
                </div>
                <input
                  className="FormControl"
                  type="text"
                  placeholder="#aaaaaa"
                  bidi={this.values["askvortsov-pwa.backgroundColor"]}
                  required={true}
                />
              </fieldset>
            </fieldset>

            <Button type="submit" className="Button Button--primary">
              {app.translator.trans("askvortsov-pwa.admin.pwa.submit_button")}
            </Button>

            <fieldset>
              <legend>
                {app.translator.trans("askvortsov-pwa.admin.pwa.logo_heading")}
              </legend>
              <div className="helpText">
                {app.translator.trans("askvortsov-pwa.admin.pwa.logo_text")}
              </div>
              {this.sizes.map((size) => {
                return (
                  <fieldset class="logoFieldset">
                    <PWALogoUploadButton name={size} />
                    <div className="helpText">
                      {app.translator.trans(
                        "askvortsov-pwa.admin.pwa.logo_size_text",
                        { size }
                      )}
                    </div>
                  </fieldset>
                );
              })}
            </fieldset>
          </form>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();
    const hex = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

    if (!hex.test(this.values["askvortsov-pwa.backgroundColor"]())) {
      alert(app.translator.trans("core.admin.appearance.enter_hex_message"));
      return;
    }
    // this.values['askvortsov-pwa.categories'](this.values['askvortsov-pwa.categories']().split(',').map(function (item) {
    //     return item.trim();
    // }));
    this.saveSettings();
  }

  saveSettings() {
    if (this.saving) return;

    this.saving = true;
    app.alerts.dismiss(this.successAlert);

    const settings = {};

    this.fields.forEach((key) => (settings[key] = this.values[key]()));

    saveSettings(settings)
      .then(() => {
        this.successAlert = app.alerts.show(
          { type: "success" },
          app.translator.trans("core.admin.basics.saved_message")
        );
      })
      .catch(() => {})
      .then(() => {
        this.saving = false;
        this.refresh();
      });
  }
}
