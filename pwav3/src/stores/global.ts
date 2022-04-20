import { defineStore } from 'pinia';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import {
  sendApiRequest,
  SQL_CREATE_USER_IF_NOT_EXISTING,
  SQL_GET_USER_DATA,
} from 'src/ApiAccess';

export const useGlobalStore = defineStore('global', {
  state: () => {
    const state: {
      user: unknown;
    } = {
      user: {},
    };
    return state;
  },

  getters: {
    user(state) {
      return state.user;
    },

    isAuthenticated(state) {
      return !!state.user;
    },
  },

  actions: {
    signInWithEmail(email: string, password: string) {
      return new Promise<void>((resolve, reject) => {
        signInWithEmailAndPassword(getAuth(), email, password)
          .then((userCredential) => {
            sendApiRequest(SQL_GET_USER_DATA, { fbid: userCredential.user.uid })
              .then((data: unknown) => {
                this.user = data;
                resolve();
              })
              .catch((error: Error) => {
                this.signOut();
                reject(error);
              });
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    },

    signOut() {
      return new Promise<void>((resolve, reject) => {
        this.user = {};
        signOut(getAuth())
          .then(() => {
            resolve();
          })
          .catch((error: Error) => {
            reject(error);
          });
      });
    },

    signInWithGoogle() {
      return new Promise<void>((resolve, reject) => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider)
          .then((result) => {
            const user = result.user;
            if (user.displayName == null) {
              return reject(new Error("Account doesn't have a display name!"));
            }
            const [name, surname] = user.displayName.split(' ');
            if(user.email == null) {
              return reject(new Error("Account doesn't have an email address!"))
            }
            this._signInWithPotentialNewUser(name, surname, user.email, user.uid)
            .then(resolve)
            .catch(reject)
          })
          .catch((error: Error) => {
            this.signOut();
            reject(error);
          });
      });
    },

    registerWithEmail(email: string, password: string, name: string, surname: string) {
      return new Promise<void>((resolve, reject) => {
        createUserWithEmailAndPassword(getAuth(), email, password)
        .then((result) => {
          updateProfile(result.user, {
            displayName: `${name} ${surname}`
          })
          .then(() => {
            this._signInWithPotentialNewUser(name, surname, email, result.user.uid)
            .then(resolve)
            .catch(reject)
          })
        })
        .catch(reject)
      })
    },

    _signInWithPotentialNewUser(name: string, surname: string, mail: string, fbid: string) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_CREATE_USER_IF_NOT_EXISTING, {
          name,
          surname,
          mail,
        })
          .then(() => {
            sendApiRequest(SQL_GET_USER_DATA, { fbid: fbid })
              .then((data: unknown) => {
                this.user = data;
                resolve();
              })
              .catch((error: Error) => {
                this.signOut();
                reject(error);
              });
          })
          .catch((error: Error) => {
            this.signOut();
            reject(error);
          });
      })
    },

    

  },
});
