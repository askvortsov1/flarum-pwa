
import Button from 'flarum/components/Button';
import UploadImageButton from 'flarum/components/UploadImageButton';
import Alert from 'flarum/components/Alert';

export default class PWALogoUploadButton extends UploadImageButton {
    view() {
        const settings = app.data.settings;

        this.props.loading = this.loading;
        this.props.className = (this.props.className || '') + ' Button';

        if (app.data.settings['askvortsov-pwa.icon_' + this.props.name + '_path']) {
            this.props.onclick = this.remove.bind(this);
            this.props.children = app.translator.trans('core.admin.upload_image.remove_button');

            return (
                <div>
                    <p><img src={app.forum.attribute('basePath').trimRight('/') + '/assets/' + app.data.settings['askvortsov-pwa.icon_' + this.props.name + '_path']} alt="" /></p>
                    <p>{Button.prototype.view.call(this)}</p>
                </div>
            );
        } else {
            this.props.onclick = this.upload.bind(this);
            this.props.children = app.translator.trans('core.admin.upload_image.upload_button');
        }

        return super.view();
    }

    resourceUrl() {
        return app.forum.attribute('apiUrl') + '/pwa/logo/' + this.props.name;
    }
}