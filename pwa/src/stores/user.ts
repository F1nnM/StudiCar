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
  GET_MESSAGES,
  sendApiRequest,
  SQL_ADD_ADDRESS,
  SQL_ADD_CAR,
  SQL_ADD_LIFT,
  SQL_ADD_LIFT_REQUEST,
  SQL_CANCEL_LIFT_REQUEST,
  SQL_CHANGE_FRIEND_RELATION,
  SQL_CREATE_USER_IF_NOT_EXISTING,
  SQL_GET_FRIENDS,
  SQL_GET_LIFT_REQUESTS,
  SQL_GET_MARKETPLACE,
  SQL_GET_OUTGOING_REQUESTS,
  SQL_GET_USER_DATA,
  SQL_LEAVE_LIFT,
  SQL_REMOVE_ADDRESS,
  SQL_REMOVE_CAR,
  SQL_RESPOND_REQUEST,
  SQL_SEND_MESSAGE,
  SQL_UPDATE_DEFAULT_ADDRESS,
  SQL_UPDATE_DESCRIPTION,
  SQL_UPDATE_GENDER,
  SQL_UPDATE_LIFT_MAX_DISTANCE,
  SQL_UPDATE_LIFT_TIME,
  SQL_UPDATE_PREFS,
  TEST_PUSH,
} from 'src/utils/ApiAccess';
import { BasicUser, Car, DatabaseAnswer, Prefs } from './model';

export const useUserStore = defineStore('global', {
  state: () => {
    const state: {
      user: DatabaseAnswer;
      loggedIn: boolean;
    } = {
      user: {} as DatabaseAnswer,
      loggedIn: false,
    };
    return state;
  },

  getters: {},

  actions: {
    loadDataFromSignedInUser(fbid: string) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_GET_USER_DATA, { fbid})
        .then((data) => {
          this.user = data;
          this.loggedIn = true;
          resolve();
        })
        .catch((error) => {
          this.signOut();
          reject(error);
        });
      });
    },

    signInWithEmail(email: string, password: string) {
      return new Promise<void>((resolve, reject) => {
        signInWithEmailAndPassword(getAuth(), email, password)
        .then((result) => {
          this.loadDataFromSignedInUser(result.user.uid)
          .then(resolve)
          .catch(reject);
        })
        .catch(reject)
      });
    },

    signOut() {
      return new Promise<void>((resolve, reject) => {
        this.$reset();
        signOut(getAuth())
          .then(() => {
            resolve();
          })
          .catch((error) => {
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
            if (user.email == null) {
              return reject(
                new Error("Account doesn't have an email address!")
              );
            }
            this._signInWithPotentialNewUser(
              name,
              surname,
              user.email,
              user.uid
            )
              .then(resolve)
              .catch(reject);
          })
          .catch((error) => {
            this.signOut();
            reject(error);
          });
      });
    },

    registerWithEmail(
      email: string,
      password: string,
      name: string,
      surname: string
    ) {
      return new Promise<void>((resolve, reject) => {
        createUserWithEmailAndPassword(getAuth(), email, password)
          .then((result) => {
            updateProfile(result.user, {
              displayName: `${name} ${surname}`,
            }).then(() => {
              this._signInWithPotentialNewUser(
                name,
                surname,
                email,
                result.user.uid
              )
                .then(resolve)
                .catch(reject);
            });
          })
          .catch(reject);
      });
    },

    _signInWithPotentialNewUser(
      name: string,
      surname: string,
      mail: string,
      fbid: string
    ) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_CREATE_USER_IF_NOT_EXISTING, {
          name,
          surname,
          mail,
        })
          .then(() => {
            this.loadDataFromSignedInUser(fbid)
            .then(resolve)
            .catch(reject);
          })
          .catch((error) => {
            this.signOut();
            reject(error);
          });
      });
    },

    testPushNotification() {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(TEST_PUSH, {})
          .then((response) => {
            if (response == 'No token set') return reject(response);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    updateDescription(description: string) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_UPDATE_DESCRIPTION, { description })
          .then(() => {
            this.user.bio = description;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    reloadMarketplaceOffers() {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_GET_MARKETPLACE, {})
          .then((offers) => {
            this.user.marketplaceOffers = offers;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    leaveLift(liftId: number) {
      return new Promise<{ wasDriver: boolean }>((resolve, reject) => {
        sendApiRequest(SQL_LEAVE_LIFT, { liftId })
          .then(() => {
            let wasDriver = false;
            this.user.chatLifts = this.user.chatLifts.filter((lift) => {
              if (lift.id == liftId) {
                if (lift.driver.id == this.user.uid) wasDriver = true;
                return false;
              } else return true;
            });
            resolve({ wasDriver });
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    reloadChatLifts() {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(GET_MESSAGES, {})
          .then((data) => {
            this.user.chatLifts = data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    getLiftRequests() {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_GET_LIFT_REQUESTS, {})
          .then((data) => {
            this.user.liftRequests = data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    getOutgoingRequests() {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_GET_OUTGOING_REQUESTS, {})
          .then((data) => {
            this.user.outgoingRequests = data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    cancelRequest(requestId: number) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_CANCEL_LIFT_REQUEST, { requestId })
          .then(() => {
            this.user.outgoingRequests = this.user.outgoingRequests.filter(
              (request) => request.id != requestId
            );
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    sendMessage(liftId: number, type: number, content: any) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_SEND_MESSAGE, {
          message: { liftId, type, content },
        })
          .then((data) => {
            this.user.chatLifts
              .find((lift) => lift.id == liftId)
              ?.messages.push({
                content: content,
                sentBy: this.user.uid,
                type: type,
                timestamp: data.timestamp,
              });
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    updatePrefs(prefs: Prefs) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_UPDATE_PREFS, { prefs })
          .then(() => {
            this.user.prefs = prefs;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    addAddress(address: {
      nickname: string;
      street: string;
      number: string;
      postcode: string;
      city: string;
    }) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_ADD_ADDRESS, { address })
          .then((data) => {
            this.user.addresses.push(Object.assign(address, data));
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    addLift(lift: any) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_ADD_LIFT, { lift })
          .then((data) => {
            this.user.marketplaceOffers = data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    updateLiftTime(params: {
      liftId: number;
      time: number;
      isArriveBy: boolean;
      date: string;
      isFixDate: boolean;
    }) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_UPDATE_LIFT_TIME, params)
          .then(() => {
            this.user.marketplaceOffers = this.user.marketplaceOffers.map(
              (lift) => {
                if (lift.id == params.liftId) {
                  lift.arriveBy =
                    (params.isArriveBy == true ? params.time : '00:00') + ':00';
                  lift.departAt =
                    (params.isArriveBy == false ? params.time : '00:00') +
                    ':00';
                  lift.date = params.isFixDate ? params.date : null;
                  lift.repeatsOn = params.isFixDate ? null : params.date;
                }
                return lift;
              }
            );
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    removeAddress(addressId: string) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_REMOVE_ADDRESS, { addressId })
          .then(() => {
            this.user.addresses = this.user.addresses.filter(
              (address) => address.id != addressId
            );
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    updateDefaultAddress(addressId: string) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_UPDATE_DEFAULT_ADDRESS, { addressId })
          .then(() => {
            this.user.addresses = this.user.addresses.map((address) => {
              address.isDefault = address.id == addressId;
              return address;
            });
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    addCar(car: Car) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_ADD_CAR, { car })
          .then((data) => {
            car.carId = data.id;
            this.user.cars.push(car);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    removeCar(carId: number) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_REMOVE_CAR, { carId })
          .then(() => {
            this.user.cars = this.user.cars.filter((car) => car.carId != carId);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    updateGender(gender: string) {
      return new Promise<void>((resolve, reject) => {
        if (!['M', 'W', 'D', 'X'].includes(gender))
          switch (gender) {
            case 'Männlich':
              gender = 'M';
              break;
            case 'Weiblich':
              gender = 'W';
              break;
            case 'Divers':
              gender = 'D';
              break;
            case 'Sonstiges':
              gender = 'X';
              break;
            default:
              throw new Error(`Can't parse gender "${gender}"!`);
          }
        sendApiRequest(SQL_UPDATE_GENDER, { gender })
          .then(() => {
            this.user.gender = gender;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    updateLiftMaxDistance(liftMaxDistance: number) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_UPDATE_LIFT_MAX_DISTANCE, { liftMaxDistance })
          .then(() => {
            this.user.settings.liftMaxDistance = liftMaxDistance;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    respondLiftRequest(liftId: number, user: BasicUser, accepted: boolean) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_RESPOND_REQUEST, {
          liftId,
          userId: user.id == null ? -1 : user.id,
          accepted,
        })
          .then(() => {
            if (user.id == null) {
              let affectedUsers: Array<{
                name: string;
                surname: string;
                id: string;
              }> = [];

              this.user.liftRequests = this.user.liftRequests.filter((lift) => {
                const isSelectedLift = lift.liftId == liftId;
                if (accepted && isSelectedLift)
                  affectedUsers = lift.requestingUsers; // before filtering it out, copy all the requesting users
                return !isSelectedLift; // negate it so that all other lifts stay and only the wanted one is filtered
              });

              if (accepted) {
                const chatLift = this.user.chatLifts.find(
                  (lift) => lift.id == liftId
                );
                if (chatLift != null) {
                  chatLift.passengers =
                    chatLift.passengers.concat(affectedUsers);
                }
              }
            } else {
              const requestedLift = this.user.liftRequests.find(
                (lift) => lift.liftId == liftId
              );
              if (requestedLift != null) {
                requestedLift.requestingUsers =
                  requestedLift.requestingUsers.filter(
                    (reqUser) => reqUser.id != user.id
                  );

                if (accepted) {
                  const chatLift = this.user.chatLifts.find(
                    (lift) => lift.id == liftId
                  );
                  if (chatLift != null) chatLift.passengers.push(user);
                }
              }
            }
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    requestToLift(liftId: number) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_ADD_LIFT_REQUEST, { liftId })
          .then(() => {
            this.user.marketplaceOffers = this.user.marketplaceOffers.filter(
              (offer) => offer.id != liftId
            );
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    changeFriendRelation(friendId: string, mySideOfHeart: boolean) {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_CHANGE_FRIEND_RELATION, {
          otherFbId: friendId,
          mySideOfHeart,
        })
          .then(() => {
            this.user.friends = this.user.friends
              .map((friend) => {
                if (friend.fbId == friendId) friend.friended.me = !friend.friended.me; // simple invert the current value
                return friend;
              })
              .filter((friend) => {
                if (friend.fbId == friendId)
                  return (
                    friend.friended !=
                    {
                      in: false,
                      me: false,
                    } // remove friend if there is no relation from either side
                  );
                else return true;
              });
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    reloadFriends() {
      return new Promise<void>((resolve, reject) => {
        sendApiRequest(SQL_GET_FRIENDS, {})
          .then((data) => {
            this.user.friends = data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  },
});
