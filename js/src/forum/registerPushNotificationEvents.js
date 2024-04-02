const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

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
          token: generateString(16),
        },
      });
    }
  });
};