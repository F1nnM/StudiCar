import Firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/messaging";

import {
  sendApiRequest,
  SQL_CREATE_USER_IF_NOT_EXISTING,
  SQL_GET_USER_DATA,
  SQL_UPDATE_FCM_TOKEN,
  SQL_UPDATE_PUSH_SUBSCRIPTION,
  TEST_PUSH
} from "../ApiAccess";

const vapidKey =
  "BEkNfar1xxwvXxxSAlgjdXmivUZtcudfXZiN5Hd8Xjksv1rzDNF44f8U9heFv8UeQlC0l42qW1dpKzv9cG4k9lw";

function createNotificationSubscription() {
  return navigator.serviceWorker
    .getRegistration()
    .then(reg => {
      return reg.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey
        })
        .then(sub => {
          console.warn("User is subscribed: " + sub);
          return sub;
        })
        .catch(err => {
          alert(
            "Bitte erlaube StudiCar den Zugriff auf Benachrichtigungen, sonst kriegst du nichts mit."
          );
          console.log(err);
        });
    })
    .catch(err => console.warn(err));
}

function setUpPush(fbid, store) {
  // propably not the best way to pass store object, but very simple
  try {
    const messaging = Firebase.messaging();

    messaging
      .getToken({vapidKey: vapidKey})
      .then(currentToken => {
        if (currentToken) {
          console.warn("+++ TOKEN +++ " + currentToken);
          if (store) store.commit("auth/SET_FCM_TOKEN", currentToken);

          sendApiRequest(
            SQL_UPDATE_FCM_TOKEN,
            {
              token: currentToken
            },
            _ => {},
            err => {
              throw err;
            }
          );
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );

          Notification.requestPermission()
            .then(permission => {
              if (permission === "granted") {
                console.log("have Permission");

                setUpPush(fbid);
              } else {
                alert(
                  "Bitte erlaube StudiCar den Zugriff auf Benachrichtigungen, sonst kriegst du nichts mit."
                );
              }
            })
            .catch(err => {
              alert(
                "Bitte erlaube StudiCar den Zugriff auf Benachrichtigungen, sonst kriegst du nichts mit."
              );
              window.location.href = window.location.href;
            });
        }
      })
      .catch(err => {
        console.log("An error occurred while retrieving token. ", err);
        alert("Could not get token: " + err);
      });

    messaging.onTokenRefresh(_ => {
      messaging
        .getToken()
        .then(newToken => {
          console.warn("Got a new token: " + newToken);
        })
        .catch(err => console.warn(err));
    });

    createNotificationSubscription().then(subscription => {
      sendApiRequest(
        SQL_UPDATE_PUSH_SUBSCRIPTION,
        {
          pushSubscription: JSON.stringify(subscription)
        },
        _ => {},
        err => {}
      );
    });

  } catch (e) {
    console.warn(e);
  }
}

export default ({ router, store }) => {
  // Register the Firebase authentication listener
  Firebase.auth().onAuthStateChanged(user => {
    store.commit("auth/SET_USER_DATA_LOADED", false);
    if (user) {
      var [name, surname] = user.displayName.split(" ");
      sendApiRequest(
        SQL_CREATE_USER_IF_NOT_EXISTING,
        { name, surname, mail: user.email },
        _ =>
          sendApiRequest(
            SQL_GET_USER_DATA,
            { fbid: user.uid },
            data => {
              store.commit("auth/SET_USER", data);
              router.replace({ name: "marketplace" }).catch(() => {});
              setTimeout(_ => {
                store.commit("auth/SET_USER_DATA_LOADED", true);
              }, 100);

              /****************
               * PUSH MESSAGES
               *****************/
              setUpPush(user.uid, store);
            },
            error => {
              store.dispatch("auth/signOut");
              store.commit("auth/SET_USER_DATA_LOADED", true);
            }
          ),
        error => {
          store.dispatch("auth/signOut");
          store.commit("auth/SET_USER_DATA_LOADED", true);
        }
      );
    } else {
      // Signed out. Let Vuex know.
      store.commit("auth/RESET_USER");
      store.commit("auth/SET_USER_DATA_LOADED", true);
      router.replace({ name: "signIn" }).catch(() => {});
    }
  });
};
