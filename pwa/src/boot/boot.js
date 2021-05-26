import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firebase-messaging";

import {
  sendApiRequest,
  SQL_CREATE_USER_IF_NOT_EXISTING,
  SQL_GET_USER_DATA
} from "../ApiAccess";

function setUpPush(fbid) {
  try {
    const messaging = Firebase.messaging();

    messaging
      .getToken({
        vapidKey:
          "BEkNfar1xxwvXxxSAlgjdXmivUZtcudfXZiN5Hd8Xjksv1rzDNF44f8U9heFv8UeQlC0l42qW1dpKzv9cG4k9lw"
      })
      .then(currentToken => {
        if (currentToken) {
          console.warn("+++ TOKEN +++ " + currentToken);
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
                console.log("Permission Denied");
              }
            })
            .catch(err => {
              console.log(err);
              window.location.href = window.location.href;
            });
        }
      })
      .catch(err => {
        console.log("An error occurred while retrieving token. ", err);
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

              setUpPush(user.uid);
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
