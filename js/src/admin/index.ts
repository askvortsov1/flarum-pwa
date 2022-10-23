import app from 'flarum/admin/app';
import PWAPage from './components/PWAPage';

app.initializers.add('askvortsov/flarum-pwa', () => {
  app.extensionData.for('askvortsov-pwa').registerPage(PWAPage);
});
