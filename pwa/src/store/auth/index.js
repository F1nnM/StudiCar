import Firebase from 'firebase/app'
import 'firebase/auth'
import { SQL_CREATE_USER_IF_NOT_EXISTING, sendApiRequest, SQL_GET_USER_DATA, SQL_UPDATE_DESCRIPTION, SQL_UPDATE_GENDER, SQL_UPDATE_LIFT_MAX_DISTANCE, SQL_UPDATE_PREFS, SQL_ADD_ADDRESS, SQL_REMOVE_ADDRESS, SQL_ADD_CAR, SQL_REMOVE_CAR } from '../../ApiAccess'

export default {
  namespaced: true,

  state: {
    user: {}
  },

  getters: {
    user (state) {
      return state.user
    },

    isAuthenticated (state) {
      return !!state.user
    },

    signinLoading (state) {
      //debugger
      return state.signinLoading
    }
  },

  mutations: {
    SET_USER (state, payload) {
      state.user = JSON.parse(JSON.stringify(payload))
    },

    RESET_USER (state) {
      state.user = null
    },

    UPDATE_DESCRIPTION (state, payload) {
      state.user.description = payload
    },

    UPDATE_GENDER (state, payload) {
      state.user.gender = payload
    },

    UPDATE_LIFT_MAX_DISTANCE (state, payload) {
      state.user.settings.liftMaxDistance = payload
    },

    UPDATE_PREFS (state, payload) {
      state.user.prefs = payload
    },

    ADD_ADDRESS (state, payload) {
      state.user.addresses.push(payload)
    },

    REMOVE_ADDRESS (state, payload) {
      state.user.addresses = state.user.addresses.filter(item => {
        return item.id != payload // filters the one with matching id
      })
    },

    ADD_CAR (state, payload) {
      state.user.cars.push(payload.car)
    },

    REMOVE_CAR (state, payload) {
      state.user.cars = state.user.cars.filter(item => {
        return item.carId != payload // filters the one with matching id
      })
    },

    SET_SIGNIN_LOADING (state, payload) {

      state.signinLoading = payload
      //debugger
    }
  },

  actions: {
    async signIn ({ commit }, payload) {
      let email = payload.email
      let password = payload.password

      await Firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
          commit('SET_USER', user)
        })
        .catch(error => {
          alert('Bei der Anmeldung ist ein Problem aufgetreten: ' + error)
        })
    },

    async register ({ commit }, payload) {
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

    async signOut ({ commit }) {
      await Firebase.auth().signOut()
        .then(() => {
          commit('RESET_USER')
        })
    },

    async updateDescription ({ commit }, payload) {
      sendApiRequest(
        SQL_UPDATE_DESCRIPTION,
        { description: payload },
        _ => commit('UPDATE_DESCRIPTION', payload),
        error => alert(error)
      );
    },

    async updatePrefs ({ commit }, payload) {
      sendApiRequest(
        SQL_UPDATE_PREFS,
        { prefs: payload },
        _ => commit('UPDATE_PREFS', payload),
        error => alert(error)
      );
    },

    async addAddress ({ commit }, payload) {
      sendApiRequest(
        SQL_ADD_ADDRESS,
        { address: payload.address, id: payload.id },
        _ => commit('ADD_ADDRESS', payload.address),
        error => alert(error)
      )
    },

    async removeAddress ({ commit }, payload) {
      sendApiRequest(
        SQL_REMOVE_ADDRESS,
        { id: payload },
        _ => commit('REMOVE_ADDRESS', payload),
        error => alert(error)
      )
    },

    async addCar ({ commit }, payload) {
      debugger
      sendApiRequest(
        SQL_ADD_CAR,
        { data: payload },
        _ => commit('ADD_CAR', payload),
        error => alert(error)
      )
    },

    async removeCar ({ commit }, payload) {
      sendApiRequest(
        SQL_REMOVE_CAR,
        { id: payload },
        _ => commit('REMOVE_CAR', payload),
        error => alert(error)
      )
    },

    async updateGender ({ commit }, payload) {
      let gender = payload
      if (!['M', 'W', 'D', 'X'].includes(gender))
        switch (gender) {
          case 'Männlich':
            gender = 'M'
            break;
          case 'Weiblich':
            gender = 'W'
            break;
          case 'Divers':
            gender = 'D'
            break;
          case 'Sonstiges':
            gender = 'X'
            break;
          default:
            throw new Error("Can't parse gender '" + gender + "'!")
        }
      sendApiRequest(
        SQL_UPDATE_GENDER,
        { gender: gender },
        _ => commit('UPDATE_GENDER', gender),
        error => alert(error)
      )
    },

    async updateLiftMaxDistance ({ commit }, payload) {
      sendApiRequest(
        SQL_UPDATE_LIFT_MAX_DISTANCE,
        { liftMaxDistance: payload },
        _ => commit('UPDATE_LIFT_MAX_DISTANCE', payload),
        error => alert(error)
      );
    }
  }
}