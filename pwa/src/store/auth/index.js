import Firebase from 'firebase/app'
import 'firebase/auth'
import { SQL_CREATE_USER_IF_NOT_EXISTING, sendApiRequest, SQL_GET_USER_DATA, SQL_UPDATE_DESCRIPTION, SQL_UPDATE_GENDER, SQL_UPDATE_LIFT_MAX_DISTANCE, SQL_UPDATE_PREFS, SQL_ADD_ADDRESS, SQL_REMOVE_ADDRESS, SQL_ADD_CAR, SQL_REMOVE_CAR, SQL_GET_MARKETPLACE, GET_MESSAGES, SQL_SEND_MESSAGE } from '../../ApiAccess'

import { Notify } from 'quasar'
function errorNotify (msg) {
  Notify.create({
    type: 'negative',
    message: msg
  });
}

export default {
  namespaced: true,

  state: {
    user: {},
    signinLoaded: false
  },

  getters: {
    user (state) {
      return state.user
    },

    isAuthenticated (state) {
      return !!state.user
    },

    signinLoaded (state) {
      return state.signinLoaded
    }
  },

  mutations: {
    SET_USER (state, payload) {
      state.user = JSON.parse(JSON.stringify(payload))
    },

    RESET_USER (state) {
      state.user = null
    },

    UPDATE_MARKETPLACE_OFFERS (state, payload) {
      state.user.marketplaceOffers = payload
    },

    UPDATE_CHAT_LIFTS (state, payload) {
      state.user.chatLifts = payload
    },

    UPDATE_DESCRIPTION (state, payload) {
      state.user.bio = payload
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

    SEND_MESSAGE (state, payload) {
      if (payload.content) { // fallback for empty messages
        var a = state.user.chatLifts.find(l => l.id == payload.liftId)
        a.messages.push({
          content: payload.content,
          sentBy: state.user.uid,
          type: payload.type,
          timestamp: payload.timestamp
        })
      }
    },

    ADD_ADDRESS (state, payload) {
      state.user.addresses.push(payload)
    },

    REMOVE_ADDRESS (state, payload) {
      state.user.addresses = state.user.addresses.filter(item => item.id != payload) // filters the one with matching id
    },

    ADD_CAR (state, payload) {
      state.user.cars.push(payload.car)
    },

    REMOVE_CAR (state, carId) {
      state.user.cars = state.user.cars.filter(item => item.carId != carId) // filters the one with matching id
    },

    SET_USER_DATA_LOADED (state, payload) {
      state.signinLoaded = payload
    },

    RESPOND_LIFT_REQUEST (state, payload) {
      var dayShort = payload.dayShort,
        liftId = payload.liftId,
        userFbId = payload.user.fbId,
        requestsOfThatLift = state.user.liftRequests[dayShort][liftId]
      requestsOfThatLift = requestsOfThatLift.filter(request => request.requestingUser.fbId != userFbId) // sort out user with given fbId
      state.user.liftRequests[dayShort][liftId] = requestsOfThatLift // if lift is still there, overwrite it

      if (!state.user.liftRequests[dayShort][liftId].length) {
        delete state.user.liftRequests[dayShort][liftId]
        if (!Object.keys(state.user.liftRequests[dayShort]).length) {
          delete state.user.liftRequests[dayShort]
        }
      }
      if (payload.accepted == true) state.user.chatLifts[liftId].passengers.push(payload.user) // user object is structured like other passengers
    },

    REQUEST_TO_LIFT (state, liftId) {
      state.user.marketplaceOffers.find(offer => offer.id == liftId).requested = true
    }
  },

  actions: {
    async signIn ({ commit }, payload) {
      let email = payload.email
      let password = payload.password

      await Firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error => {
          alert('Bei der Anmeldung ist ein Problem aufgetreten: ' + error)
        })
    },

    async register ({ commit }, payload) {
      let email = payload.email
      let password = payload.password
      let name = payload.name
      let surname = payload.surname

      await Firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          Firebase.auth().currentUser.updateProfile({
            displayName: name + " " + surname
          })
            .then(_ => {
              let currentUser = Firebase.auth().currentUser
              sendApiRequest(
                SQL_CREATE_USER_IF_NOT_EXISTING,
                { name, surname, mail: currentUser.email },
                _ => sendApiRequest(SQL_GET_USER_DATA, { fbid: currentUser.uid },
                  data => {
                    commit("SET_USER", data);
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

    async reloadMarketplaceOffers ({ commit }, callbacks) {
      sendApiRequest(
        SQL_GET_MARKETPLACE,
        {},
        (offers, statuscode) => {
          commit('UPDATE_MARKETPLACE_OFFERS', offers)
          callbacks.res()
        },
        error => callbacks.rej(error)
      );
    },

    async reloadChatLifts ({ commit }, callbacks) {
      sendApiRequest(GET_MESSAGES, {}, chatLifts => {
        commit('UPDATE_CHAT_LIFTS', chatLifts)
        callbacks.res()
      }, err => callbacks.rej(err))
    },

    async sendMessage ({ commit }, payload) {
      sendApiRequest(
        SQL_SEND_MESSAGE,
        { message: payload },
        data => commit('SEND_MESSAGE', Object.assign(payload, data)),
        error => errorNotify(error)
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
        { address: payload },
        data => commit('ADD_ADDRESS', Object.assign(
          payload, data
        )),
        error => alert(error)
      )
    },

    async removeAddress ({ commit }, payload) {
      sendApiRequest(
        SQL_REMOVE_ADDRESS,
        { id: payload },
        _ => commit('REMOVE_ADDRESS', payload),
        error => {
          if (error.status == 424) errorNotify('Kann Adresse nicht entfernen: Eine Mitfahrgelegenheit hängt davon ab')
        }
      )
    },

    async addCar ({ commit }, payload) {
      sendApiRequest(
        SQL_ADD_CAR,
        { data: payload },
        id => {
          payload.id = id

          commit('ADD_CAR', payload)
        },
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
    },

    async respondLiftRequest ({ commit }, payload) {
      commit('RESPOND_LIFT_REQUEST', payload)
    },

    async requestToLift ({ commit }, payload) {
      commit('REQUEST_TO_LIFT', payload)
    }
  }
}