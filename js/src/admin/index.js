import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';

import PWAPage from './components/PWAPage';

app.initializers.add('askvortsov/flarum-pwa', () => {
  app.routes.pwa = {path: '/pwa', component: PWAPage.component() };

  app.extensionSettings['askvortsov-pwa'] = () => m.route(app.route('pwa'));

  extend(AdminNav.prototype, 'items', items => {
    items.add('pwa', AdminLinkButton.component({
      href: app.route('pwa'),
      icon: 'fas fa-mobile-alt',
      children: app.translator.trans('askvortsov-pwa.admin.nav.pwa_button'),
      description: app.translator.trans('askvortsov-pwa.admin.nav.pwa_text')
    }));
  });
});
