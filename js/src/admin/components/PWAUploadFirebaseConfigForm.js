import Component from 'flarum/common/Component';

export default class PWAUploadFirebaseConfigForm extends Component {
  oninit(vnode) {
    super.oninit(vnode);

    this.file = null;
  }

  view(vnode) {
    return (
      <>
        <form action="/pwa/firebase-config" method="POST" onsubmit={this.updateFirebaseConfig.bind(this)}>
          <fieldset>
            <fieldset>
              <legend>{app.translator.trans('askvortsov-pwa.admin.pwa.firebase-config.heading')}</legend>
              <div className="helpText">{app.translator.trans('askvortsov-pwa.firebase-config.help_text')}</div>

              <input type="file" onchange={this.handleFileChange.bind(this)} />
            </fieldset>

            <button type="submit">SUBMIT</button>
          </fieldset>
        </form>
      </>
    );
  }

  handleFileChange(event) {
    this.file = event.target.files[0];
  }

  updateFirebaseConfig(event) {
    event.preventDefault();

    const body = new FormData();
    body.append('file', this.file);

    app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/pwa/firebase-config',
        body: body,
      })
      .then((response) => {
        alert('nice');
      });
  }
}
