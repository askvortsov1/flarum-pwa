import Component from 'flarum/common/Component';

export default class PWAUploadFirebaseConfigForm extends Component {
  view(vnode) {
    return (
      <>
        <form action="/pwa/firebase-config" method="POST" onsubmit={this.updateFirebaseConfig.bind(this)}>
          <fieldset>
            <fieldset>
              <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.heading')}</legend>
              <div className="helpText">
                <span>{app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.help_text')}</span>

                <a href="https://docs.pwabuilder.com/#/builder/app-store?id=push-notifications" target="_blank">
                  {app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.see_documentation_here')}
                </a>
              </div>

              <button type="button" className="Button" onclick={() => document.querySelector('#flarum-pwa-upload-button').click()}>
                {app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.upload_file')}
              </button>

              <input id="flarum-pwa-upload-button" type="file" onchange={this.updateFirebaseConfig.bind(this)} style={{ opacity: 0 }} />
            </fieldset>
          </fieldset>
        </form>
      </>
    );
  }

  updateFirebaseConfig(event) {
    const body = new FormData();
    body.append('file', event.target.files[0]);

    app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/pwa/firebase-config',
        body: body,
      })
      .then((response) => {
        app.alerts.show(
          {
            type: 'success',
          },
          app.translator.trans('askvortsov-pwa.admin.pwa.firebase_config.upload_successful')
        );
      });
  }
}
