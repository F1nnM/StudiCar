
import Firebase from 'firebase/app'
import 'firebase/auth'
import { sendApiRequest, SQL_CREATE_USER_IF_NOT_EXISTING, SQL_GET_USER_DATA } from '../ApiAccess'

export default ({ router, store }) => {
  // Register the Firebase authentication listener
  Firebase.auth().onAuthStateChanged(user => {
    store.commit("auth/SET_USER_DATA_LOADED", false)
    if (user) {
      var [name, surname] = user.displayName.split(" ")
      sendApiRequest(
        SQL_CREATE_USER_IF_NOT_EXISTING,
        { name, surname, mail: user.email },
        _ => sendApiRequest(
          SQL_GET_USER_DATA,
          { fbid: user.uid },
          data => {
            store.commit("auth/SET_USER", data)
            router.replace({ name: 'marketplace' }).catch(() => { })
            setTimeout(_ => {
              store.commit("auth/SET_USER_DATA_LOADED", true)
            }, 100)
          },
          error => {
            store.dispatch('auth/signOut')
            store.commit("auth/SET_USER_DATA_LOADED", true)
          }),
        error => {
          store.dispatch('auth/signOut')
          store.commit("auth/SET_USER_DATA_LOADED", true)
        }
      );
    } else {
      // Signed out. Let Vuex know.
      store.commit('auth/RESET_USER')
      store.commit("auth/SET_USER_DATA_LOADED", true)
      router.replace({ name: 'signIn' }).catch(() => { })
    }
  })
}