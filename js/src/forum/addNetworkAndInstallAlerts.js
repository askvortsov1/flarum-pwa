import { extend } from 'flarum/common/extend';
import Page from 'flarum/common/components/Page';
import { usingAppleWebview } from './use-pwa-builder';

export default () => {
    extend(Page.prototype, 'oninit', () => {
        const dismissAlert = () => {
            localStorage.setItem('askvortov-pwa.install-alert.dismissed', JSON.stringify({ timestamp: new Date().getTime() }));
        };

        window.addEventListener('online', () => {
            app.alerts.dismiss(app.cache.pwaOfflineAlert);

            app.cache.pwaOnlineAlert = app.alerts.show(
                {
                    type: 'success'
                },
                app.translator.trans('askvortsov-pwa.forum.alerts.online')
            );
        });
        
        window.addEventListener('offline', () => {
            app.alerts.dismiss(app.cache.pwaOnlineAlert);

            app.cache.pwaOfflineAlert = app.alerts.show(
                app.translator.trans('askvortsov-pwa.forum.alerts.offline')
            );
        });

        if (
             app.forum.attribute("installAlerts") &&
            !localStorage.getItem('askvortov-pwa.install-alert.dismissed')
        ) window.addEventListener("beforeinstallprompt", function(e) {
            e.preventDefault();
            const alertId = app.alerts.show(
                {
                    controls: [
                      Button.component(
                        {
                          className: 'Button Button--link',
                          onclick: () => {
                            app.alerts.dismiss(alertId);
                            e.prompt();
                          },
                        },
                        app.translator.trans('askvortsov-pwa.forum.alerts.install_button')
                      ),
                    ],
                    ondismiss: dismissAlert
                },
                app.translator.trans('askvortsov-pwa.forum.alerts.install')
            );
        });

        if (
             app.forum.attribute("installAlerts") &&
            !localStorage.getItem('askvortov-pwa.install-alert.dismissed') &&
             navigator.standalone === false &&
            !usingAppleWebview()
        ) app.alerts.show(
            {
                controls: [
                  Button.component(
                    {
                      className: 'Button Button--link',
                      onclick: () => {
                        window.alert(app.translator.trans('askvortsov-pwa.forum.alerts.install_on_safari_learn_more_text'));
                      },
                    },
                    app.translator.trans('askvortsov-pwa.forum.alerts.install_on_safari_learn_more')
                  ),
                ],
                ondismiss: dismissAlert
            },
            app.translator.trans('askvortsov-pwa.forum.alerts.install_on_safari')
        );
    });
}

export const updateAlert = () => {
  let countdown = 30;
  const CountdownComponent = {
    async startCountdown() {
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        countdown -= 1;
        this.node.dom.innerText = app.translator.trans('askvortsov-pwa.forum.alerts.refresh', {countdown}).join('');
        if (countdown <= 0) break;
      }
      window.location.reload();
    },
  
    oninit: function() {
      this.startCountdown();
      this.node = m('span', app.translator.trans('askvortsov-pwa.forum.alerts.refresh', {countdown}).join(''));
    },
  
    view: function() {
      return this.node;
    }
  };

  app.alerts.show(
    {
      controls: [
        Button.component(
          {
            className: 'Button Button--link',
            onclick: window.location.reload,
          },
          app.translator.trans('askvortsov-pwa.forum.alerts.refresh_button')
        ),
      ],
      dismissible: false
    },
    m(CountdownComponent)
  );
}