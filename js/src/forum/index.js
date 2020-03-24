import { extend } from 'flarum/extend';
import Page from 'flarum/components/Page';

app.initializers.add('askvortsov/flarum-pwa', () => {
  extend(Page.prototype, 'init', res => {
    const basePath = app.forum.attribute('basePath').trimRight('/');
    document.querySelector('#manifest').setAttribute('href', basePath + '/webmanifest.json');

    if ("serviceWorker" in navigator) {
      if (!navigator.serviceWorker.controller) {
        navigator.serviceWorker
          .register(basePath + "/sw.js")
          .then(function (reg) {
            console.log("Service worker has been registered for scope: " + reg.scope);
          });
      }
    }
  });
});
