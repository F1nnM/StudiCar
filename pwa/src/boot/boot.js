
import Firebase from 'firebase/app'
import 'firebase/auth'
import { sendApiRequest, SQL_USER_ADD_IF_NOT_EXISTS } from '../ApiAccess'

export default ({ app, router, Vue, store }) => {
  // Register the Firebase authentication listener
  Firebase.auth().onAuthStateChanged(user => {
    if (user) {

      sendApiRequest(
        SQL_USER_ADD_IF_NOT_EXISTS,
        { fbid: user.uid, name: user.displayName, mail: user.email },
        _ => {
          store.commit("auth/SET_USER", user);
          router.replace({ name: 'marketplace' }).catch(() => { })
          new Vue(app) /* eslint-disable-line no-new */
        },
        error => {
          store.dispatch('auth/signOut');
        }
      );

    } else {
      // Signed out. Let Vuex know.
      store.commit('auth/RESET_USER')
      router.replace({ name: 'signIn' }).catch(() => { })
      new Vue(app) /* eslint-disable-line no-new */
    }
  })
}