
const app = firebase.initializeApp({
  apiKey: "AIzaSyCCzyfAlA2hdheQ0k-K8PKUEspLFjiLif0",
  authDomain: "dhbw-studicar.firebaseapp.com",
  databaseURL: "https://dhbw-studicar.firebaseio.com",
  projectId: "dhbw-studicar",
  storageBucket: "dhbw-studicar.appspot.com",
  messagingSenderId: "640124338592",
  appId: "1:640124338592:web:98c919b490bd03134fa4c5",
  measurementId: "G-X6BY2RXNBH"
})

const messaging = firebase.messaging();

messaging.getToken({ vapidKey: "BEkNfar1xxwvXxxSAlgjdXmivUZtcudfXZiN5Hd8Xjksv1rzDNF44f8U9heFv8UeQlC0l42qW1dpKzv9cG4k9lw" })

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  });