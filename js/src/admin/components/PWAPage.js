import ExtensionPage from 'flarum/components/ExtensionPage';
import Alert from 'flarum/components/Alert';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

import PWALogoUploadButton from './PWALogoUploadButton';

export default class PWAPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);

    this.saving = false;
    this.refresh();
  }

  refresh() {
    this.loading = true;

    this.status_messages = [];
    this.manifest = {};
    this.sizes = [];

    app
      .request({
        method: 'GET',
        url: app.forum.attribute('apiUrl') + '/pwa/settings',
      })
      .then((response) => {
        this.manifest = response['data']['attributes']['manifest'];
        this.sizes = response['data']['attributes']['sizes'];
        this.status_messages = response['data']['attributes']['status_messages'];

        this.loading = false;
        m.redraw();
      });
  }

  checkExistence(url) {
    let http = new XMLHttpRequest();

    http.open('HEAD', url, false);
    http.send();

    return http.status != 404;
  }

  content() {
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
          <form>
            <h2>{app.translator.trans('askvortsov-pwa.admin.pwa.heading')}</h2>
            <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.text')}</div>

            <div class="statusCheck">
              <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.status_check_heading')}</legend>
              {this.status_messages.map((message) => (
                <Alert type={message.type} dismissible={false}>
                  {[message.message]}
                </Alert>
              ))}
            </div>

            <fieldset class="parent">
              <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.heading')}</legend>
              {this.buildSettingComponent({
                setting: 'askvortsov-pwa.debug',
                label: app.translator.trans('askvortsov-pwa.admin.pwa.maintenance.debug_label'),
                type: 'boolean',
              })}
            </fieldset>

            <fieldset class="parent">
              <fieldset>
                <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.about.heading')}</legend>
                <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.about.short_name_text')}</div>
                <input className="FormControl" bidi={this.setting('askvortsov-pwa.shortName')} placeholder={this.setting('forum_title')()}></input>
              </fieldset>
              <fieldset>
                <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.about.long_name_text')}</div>
                <input className="FormControl" bidi={this.setting('askvortsov-pwa.longName')} placeholder={this.setting('forum_title')()} />
              </fieldset>
              <fieldset>
                <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.about.description_text')}</div>
                <textarea className="FormControl" value={this.manifest.description} disabled={true}>
                  {this.manifest.description}
                </textarea>
              </fieldset>
            </fieldset>

            <fieldset class="parent">
              <fieldset>
                <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.colors.heading')}</legend>
                <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.colors.theme_color_text')}</div>
                <input
                  className="FormControl"
                  type="text"
                  placeholder={this.setting('theme_primary_color')()}
                  bidi={this.setting('askvortsov-pwa.themeColor')}
                />
              </fieldset>
              <fieldset>
                <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.colors.background_color_text')}</div>
                <input
                  className="FormControl"
                  type="text"
                  placeholder="#aaaaaa"
                  bidi={this.setting('askvortsov-pwa.backgroundColor')}
                  required={true}
                />
              </fieldset>
            </fieldset>

            <fieldset class="parent">
              <fieldset>
                <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.other.heading')}</legend>
                {this.buildSettingComponent({
                  setting: 'askvortsov-pwa.forcePortrait',
                  label: app.translator.trans('askvortsov-pwa.admin.pwa.other.force_portrait_text'),
                  type: 'boolean',
                })}
              </fieldset>
            </fieldset>

            {this.submitButton()}

            <fieldset>
              <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.logo_heading')}</legend>
              <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.logo_text')}</div>
              {this.sizes.map((size) => {
                return (
                  <fieldset class="logoFieldset">
                    <PWALogoUploadButton name={size} />
                    <div className="helpText">{app.translator.trans('askvortsov-pwa.admin.pwa.logo_size_text', { size })}</div>
                  </fieldset>
                );
              })}
            </fieldset>
          </form>
        </div>
      </div>
    );
  }

  saveSettings(e) {
    const hex = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

    if (!hex.test(this.setting('askvortsov-pwa.backgroundColor')())) {
      alert(app.translator.trans('core.admin.appearance.enter_hex_message'));
      return;
    }

    return super.saveSettings(e);
  }
}
