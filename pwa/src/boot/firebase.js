
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


  /* const messaging = firebase.messaging()

  messaging.setBackgroundMessageHandler(payload => {
    const title = payload.data.username
    iconPath = ''

    const options = {
      body: payload.data.message,
      icon: 'public/assets/app-icon_from_web_filled.png'
    }

    return self.registration.showNotification(title, options) */

  /* 
  
    getStartToken()
  
    messaging.onMessage(payload => {
      console.warn('message: ' + payload)
    })
  
    function getStartToken(){
      messaging.getToken().then((currentToken) => {
        if(currentToken){
          sendTokenToServer(currentToken)
        }
        else {
          RequestPermission()
          setTokenSentToServer(false)
        }
      }).catch((err) => {
        setTokenSentToServer(false)
      })
    }
  
    function RequestPermission () {
      messaging.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            console.log("have Permission");
  
            getStartToken()
          }
          else {
            console.log("Permission Denied");
          }
        }).catch (err => {
              console.log(err);
            })
          } */

  Vue.prototype.$firebase = Firebase
}