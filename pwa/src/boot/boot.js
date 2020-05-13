
import Firebase from 'firebase/app'
import 'firebase/auth'
import { sendApiRequest, SQL_CREATE_USER_IF_NOT_EXISTING, SQL_GET_USER_DATA } from '../ApiAccess'

export default ({ app, router, Vue, store }) => {
  // Register the Firebase authentication listener
  Firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (user.displayName)
        store.commit("auth/SET_SIGNIN_LOADING", true)
      sendApiRequest(
        SQL_CREATE_USER_IF_NOT_EXISTING,
        { name: user.displayName, mail: user.email },
        _ => sendApiRequest(
          SQL_GET_USER_DATA,
          { fbid: user.uid },
          data => {
            console.log(data)
            store.commit("auth/SET_USER", data);
            store.commit("auth/SET_SIGNIN_LOADING", false)
            router.replace({ name: 'marketplace' }).catch(() => { })
            new Vue(app) /* eslint-disable-line no-new */
          },
          error => {
            store.dispatch('auth/signOut')
          }),
        error => store.dispatch('auth/signOut')
      );
    } else {
      // Signed out. Let Vuex know.
      store.commit('auth/RESET_USER')
      router.replace({ name: 'signIn' }).catch(() => { })
      new Vue(app) /* eslint-disable-line no-new */
    }
  })
}