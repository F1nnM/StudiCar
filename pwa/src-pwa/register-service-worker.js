import { register } from "register-service-worker";
import firebase from "src/boot/firebase";

import store from "../src/store";

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register("firebase-messaging-sw.js", {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(registration) {
    if (process.env.DEV) {
      console.log("Service worker is ready.");
      console.warn("Showing notification in 5 sec");
      setTimeout(_ => {
        registration.showNotification("Lorem ipsum", {
          icon: "img/app-icon.svg"
        });
      }, 5000);

      registration.addEventListener("push", event => {
        alert("GOT YA: " + event);
      });
    }
  },

  registered(registration) {
    if (process.env.DEV) {
      console.log("Service worker has been registered.");

      registration.update();
    }
  },

  cached(/* registration */) {
    if (process.env.DEV) {
      console.log("Content has been cached for offline use.");
    }
  },

  updatefound(/* registration */) {
    if (process.env.DEV) {
      console.log("New content is downloading.");
    }
  },

  updated(/* registration */) {
    console.log("New content is available; please refresh.");
    store.commit("setOldVersionRunning", true);
  },

  offline() {
    if (process.env.DEV) {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    }
  },

  error(err) {
    if (process.env.DEV) {
      console.error("Error during service worker registration:", err);
    }
  }
});
