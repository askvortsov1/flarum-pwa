import Button from "flarum/components/Button";
import UploadImageButton from "flarum/components/UploadImageButton";

export default class PWALogoUploadButton extends UploadImageButton {
  view(vnode) {
    vnode.attrs.loading = this.loading;
    vnode.attrs.className = (this.attrs.className || "") + " Button";

    if (app.data.settings["askvortsov-pwa.icon_" + this.attrs.name + "_path"]) {
      vnode.attrs.onclick = this.remove.bind(this);

      return (
        <div>
          <p>
            <img
              src={
                app.forum.attribute("basePath").trimRight("/") +
                "/assets/" +
                app.data.settings[
                  "askvortsov-pwa.icon_" + this.attrs.name + "_path"
                ] +
                "?" +
                performance.now()
              }
              alt=""
            />
          </p>
          <p>
            {Button.prototype.view.call(this, {
              ...vnode,
              children: app.translator.trans(
                "core.admin.upload_image.remove_button"
              ),
            })}
          </p>
        </div>
      );
    }

    vnode.attrs.onclick = this.upload.bind(this);

    return super.view(vnode);
  }

  resourceUrl() {
    return app.forum.attribute("apiUrl") + "/pwa/logo/" + this.attrs.name;
  }
}
