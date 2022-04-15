importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCCzyfAlA2hdheQ0k-K8PKUEspLFjiLif0",
  authDomain: "dhbw-studicar.firebaseapp.com",
  databaseURL: "https://dhbw-studicar.firebaseio.com",
  projectId: "dhbw-studicar",
  storageBucket: "dhbw-studicar.appspot.com",
  messagingSenderId: "640124338592",
  appId: "1:640124338592:web:98c919b490bd03134fa4c5",
  measurementId: "G-X6BY2RXNBH"
});

const messaging = firebase.messaging();
