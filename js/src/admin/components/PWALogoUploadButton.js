import UploadImageButton from 'flarum/common/components/UploadImageButton';

export default class PWALogoUploadButton extends UploadImageButton {
  static initAttrs(attrs) {
    super.initAttrs(attrs);

    attrs.name = `pwa-icon-${attrs.size}x${attrs.size}`;
  }

  view(vnode) {
    this.attrs.loading = this.loading;
    this.attrs.className = (this.attrs.className || '') + ' Button';

    if (app.data.settings['askvortsov-pwa.icon_' + this.attrs.size + '_path']) {
      this.attrs.onclick = this.remove.bind(this);
      this.attrs.value = app.data.settings['askvortsov-pwa.icon_' + this.attrs.size + '_path'];
      this.attrs.url = app.forum.attribute(this.attrs.name + 'Url');
    } else {
      this.attrs.onclick = this.upload.bind(this);
    }

    return super.view({ ...vnode, children: app.translator.trans('core.admin.upload_image.upload_buttonx') });
  }

  remove() {
    this.loading = true;
    m.redraw();

    app
      .request({
        method: 'DELETE',
        url: this.deleteUrl(),
      })
      .then(this.success.bind(this), this.failure.bind(this));
  }

  deleteUrl() {
    return app.forum.attribute('apiUrl') + '/pwa-settings/logo/' + this.attrs.size;
  }

  resourceUrl() {
    return app.forum.attribute('apiUrl') + '/pwa/logo/' + this.attrs.size;
  }
}
