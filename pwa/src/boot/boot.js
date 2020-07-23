
import Firebase from 'firebase/app'
import 'firebase/auth'
import { sendApiRequest, SQL_CREATE_USER_IF_NOT_EXISTING, SQL_GET_USER_DATA } from '../ApiAccess'

export default ({ router, store }) => {
  // Register the Firebase authentication listener
  Firebase.auth().onAuthStateChanged(user => {
    if (user) {
      sendApiRequest(
        SQL_CREATE_USER_IF_NOT_EXISTING,
        { name: user.displayName, mail: user.email },
        _ => sendApiRequest(
          SQL_GET_USER_DATA,
          { fbid: user.uid },
          data => {
            store.commit("auth/SET_USER", data)
            router.replace({ name: 'marketplace' }).catch(() => { })
            store.commit("auth/SET_SIGNIN_LOADED")
          },
          error => {
            store.dispatch('auth/signOut')
            store.commit("auth/SET_SIGNIN_LOADED")
          }),
        error => {
          store.dispatch('auth/signOut')
          store.commit("auth/SET_SIGNIN_LOADED")
        }
      );
    } else {
      // Signed out. Let Vuex know.
      store.commit('auth/RESET_USER')
      store.commit("auth/SET_SIGNIN_LOADED")
      router.replace({ name: 'signIn' }).catch(() => { })
    }
  })
}