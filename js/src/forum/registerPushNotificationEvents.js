export const registerFirebaseNotifications = () => {
  window.addEventListener('push-notification', (event) => {
    if (event && event.detail) {
      // I don't think we need this since it's going to show up as a push notification
    }
  });

  // @ts-ignore
  window.addEventListener('push-token', (event) => {
    if (event && event.detail) {
      // Send the push token to the API
    }
  });
}
