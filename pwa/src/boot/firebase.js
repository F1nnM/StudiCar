
import Firebase from 'firebase/app'
import 'firebase/firestore' // eslint-disable-line

export default ({ Vue }) => {
  // Initialize Firebase from settings
  Firebase.initializeApp({
    apiKey: "AIzaSyCCzyfAlA2hdheQ0k-K8PKUEspLFjiLif0",
    authDomain: "dhbw-studicar.firebaseapp.com",
    databaseURL: "https://dhbw-studicar.firebaseio.com",
    projectId: "dhbw-studicar",
    storageBucket: "dhbw-studicar.appspot.com",
    messagingSenderId: "640124338592",
    appId: "1:640124338592:web:98c919b490bd03134fa4c5",
    measurementId: "G-X6BY2RXNBH"
  })
  /* 
    const messaging = Firebase.messaging()
  
    function initializeFirebaseMessaging () {
      messaging.requestPermission()
        .then(_ => console.warn('Notification Permission'))
        .then(token => {
          console.warn('Token: ' + token)
        })
        .catch(err => alert(err))
    }
  
    messaging.onMessage(payload => {
      console.warn(payload)
    })
  
    messaging.onTokenRefresh(_ => {
      messaging.getToken()
        .then(newtoken => {
          console.warn('new token: ' + newtoken)
        })
        .catch(err => alert('Err at token refresh: ' + err))
    })
  
    initializeFirebaseMessaging() */

  Vue.prototype.$firebase = Firebase
}