import PWAPage from './components/PWAPage';

app.initializers.add('askvortsov/flarum-pwa', () => {
  app.registry.for('askvortsov-pwa').registerPage(PWAPage);
});
