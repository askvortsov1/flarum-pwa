import Button from 'flarum/common/components/Button';
import UploadImageButton from 'flarum/admin/components/UploadImageButton';

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

      return (
        <div>
          <p>
            <img src={app.forum.attribute(this.attrs.name + 'Url')} alt="" />
          </p>
          <p>{super.view({ ...vnode, children: app.translator.trans('core.admin.upload_image.remove_button') })}</p>
        </div>
      );
    } else {
      this.attrs.onclick = this.upload.bind(this);
    }

    return super.view({ ...vnode, children: app.translator.trans('core.admin.upload_image.upload_button') });
  }

  resourceUrl() {
    return app.forum.attribute('apiUrl') + '/pwa/logo/' + this.attrs.size;
  }
}
