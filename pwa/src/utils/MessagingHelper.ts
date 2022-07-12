import { getMessaging, getToken } from 'firebase/messaging';
import { sendApiRequest, SQL_UPDATE_FCM_TOKEN, SQL_UPDATE_PUSH_SUBSCRIPTION } from './ApiAccess';

const vapidKey =
  'BEkNfar1xxwvXxxSAlgjdXmivUZtcudfXZiN5Hd8Xjksv1rzDNF44f8U9heFv8UeQlC0l42qW1dpKzv9cG4k9lw';

function createNotificationSubscription() {
  return navigator.serviceWorker
    .getRegistration()
    .then((reg) => {
      if (reg != null)
        return reg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey,
          })
          .then((sub) => {
            console.warn('User is subscribed: ',sub);
            return sub;
          })
          .catch((err) => {
            alert(
              'Bitte erlaube StudiCar den Zugriff auf Benachrichtigungen, sonst kriegst du nichts mit.'
            );
            console.log(err);
          });
    })
    .catch((err) => console.warn(err));
}

export function setUpPush(fbid: string) {
  try {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          sendApiRequest(SQL_UPDATE_FCM_TOKEN, {
            token: currentToken,
          }).catch((error) => {
            throw error;
          });
        } else {
          console.log(
            'No registration token available. Request permission to generate one.'
          );

          Notification.requestPermission()
            .then((permission) => {
              if (permission === 'granted') {
                console.log('have Permission');

                setUpPush(fbid);
              } else {
                alert(
                  'Bitte erlaube StudiCar den Zugriff auf Benachrichtigungen, sonst kriegst du nichts mit.'
                );
              }
            })
            .catch(() => {
              alert(
                'Bitte erlaube StudiCar den Zugriff auf Benachrichtigungen, sonst kriegst du nichts mit.'
              );
            });
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        alert('Could not get token: ' + err);
      });

    createNotificationSubscription().then((subscription) => {
      sendApiRequest(SQL_UPDATE_PUSH_SUBSCRIPTION, {
        pushSubscription: JSON.stringify(subscription),
      }).catch((err) => {
        throw err;
      });
    });
  } catch (e) {
    console.warn(e);
  }
}
