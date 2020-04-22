import Firebase from 'firebase/app'
import 'firebase/auth'
import { SQL_CREATE_USER_IF_NOT_EXISTING, sendApiRequest, SQL_GET_USER_DATA } from '../../ApiAccess'

export default {
  namespaced: true,

  state: {
    user: {}
  },

  getters: {
    user(state) {
      return state.user
    },

    isAuthenticated(state) {
      return !!state.user
    }
  },

  mutations: {
    SET_USER(state, payload) {
      state.user = JSON.parse(JSON.stringify(payload))
    },

    RESET_USER(state) {
      state.user = null
    }
  },

  actions: {
    async signIn({ commit }, payload) {
      let email = payload.email
      let password = payload.password

      await Firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
          commit('SET_USER', user)
        })
        .catch(error => {
          throw error
        })
    },

    async register({ commit }, payload) {
      let email = payload.email
      let password = payload.password
      let name = payload.name

      await Firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          Firebase.auth().currentUser.updateProfile({
            displayName: name
          })
            .then(_ => {
              let currentUser = Firebase.auth().currentUser;
              sendApiRequest(
                SQL_CREATE_USER_IF_NOT_EXISTING,
                { name: currentUser.displayName, mail: currentUser.email },
                _ => sendApiRequest(SQL_GET_USER_DATA, { fbid: currentUser.uid },
                  data => {
                    commit("SET_USER", currentUser);
                    router.replace({ name: 'marketplace' }).catch(() => { })
                    new Vue(app) /* eslint-disable-line no-new */
                  },
                  error => dispatch('signOut')),
                error => {
                  dispatch('signOut');
                }
              );
            })
            .catch(error => {
              throw error
            })
        })
        .catch(error => {
          throw error
        })
    },

    async signOut({ commit }) {
      await Firebase.auth().signOut()
        .then(() => {
          commit('RESET_USER')
        })
    }
  }
}