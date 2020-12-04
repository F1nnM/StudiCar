
import Firebase from 'firebase/app'
import 'firebase/auth'
import { sendApiRequest, SQL_CREATE_USER_IF_NOT_EXISTING, SQL_GET_USER_DATA } from '../ApiAccess'

export default ({ router, store }) => {
  // Register the Firebase authentication listener
  Firebase.auth().onAuthStateChanged(user => {
    if (user) {
      store.commit("auth/SET_USER_DATA_LOADING", true)
      var name, surname = user.displayName.split(" ")
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
              store.commit("auth/SET_USER_DATA_LOADING", false)
            }, 100)
          },
          error => {
            store.dispatch('auth/signOut')
            store.commit("auth/SET_USER_DATA_LOADING", false)
          }),
        error => {
          store.dispatch('auth/signOut')
          store.commit("auth/SET_USER_DATA_LOADING", false)
        }
      );
    } else {
      // Signed out. Let Vuex know.
      store.commit('auth/RESET_USER')
      store.commit("auth/SET_USER_DATA_LOADING", false)
      router.replace({ name: 'signIn' }).catch(() => { })
    }
  })
}