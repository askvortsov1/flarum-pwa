export const registerFirebaseNotifications = () => {
  window.addEventListener('push-notification', (event) => {
    if (event && event.detail) {
      // I don't think we need this since it's going to show up as a push notification
    }
  });

  window.addEventListener('push-token', (event) => {
    if (event && event.detail) {
      alert(event.detail);

      app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/pwa/firebase-push-subscriptions',
        body: {
          token: event.detail,
        },
      });
    }
  });
};
