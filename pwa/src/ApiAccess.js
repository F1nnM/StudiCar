import Firebase from "firebase/app";
import "firebase/auth";

export const ApiBasePath = process.env.DEV
  ? "https://" + window.location.hostname
  : window.location.hostname.startsWith("dev")
  ? "https://dev.api.studicar.mfinn.de"
  : "https://api.studicar.mfinn.de";

export function sendApiRequest(
  action,
  options,
  successCallback,
  errorCallback
) {
  options = JSON.parse(JSON.stringify(options)); //deep copy. Somehow {...options} and Object.assign({}, options) did both not work;
  if (!(action.path && action.method))
    errorCallback(
      new Error(
        "Invalid action supplied. Use predefined or make sure that it contains a path and a method."
      )
    );

  var axios = require("axios");

  Firebase.auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .then(idToken_ => {
      options.idtoken = idToken_;
      if (action.method === "GET") {
        axios
          .get(ApiBasePath + action.path, { params: options })
          .then(response => successCallback(response.data, response))
          .catch(err => errorCallback(err.response));
      } else if (action.method === "POST") {
        axios
          .post(ApiBasePath + action.path, options)
          .then(response => successCallback(response.data, response))
          .catch(err => errorCallback(err.response));
      }
    })
    .catch(error => {
      throw error;
    });
}

export async function buildGetRequestUrl(action, options) {
  const idToken_ = await Firebase.auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .catch(err => {
      throw err;
    });
  let url = ApiBasePath + action.path;
  url += "?idtoken=" + encodeURIComponent(idToken_);
  Object.keys(options).forEach(key => {
    url +=
      "&" + encodeURIComponent(key) + "=" + encodeURIComponent(options[key]);
  });
  return Promise.resolve(url);
}

export const SQL_TEST_READ = {
  path: "/sqlTest",
  method: "GET"
};

export const PING = {
  path: "/ping",
  method: "GET"
};

export const GET_USER_PROFILE_PIC = {
  path: "/profilePicture",
  method: "GET"
};

export const GET_NEWSTICKER = {
  path: "/getNewsticker",
  method: "GET"
};

export const SQL_GET_USER_DATA = {
  path: "/getUserData",
  method: "GET"
};

export const GET_CAR_MODELS = {
  path: "/getCarModels",
  method: "GET"
};

export const GET_MESSAGES = {
  path: "/getMessages",
  method: "GET"
};

export const GET_LEGAL = {
  path: "/getLegal",
  method: "GET"
};

export const SQL_GET_SUPPORT_DATA = {
  path: "/getSupportData",
  method: "GET"
};

export const SQL_GET_ALL_FAQ = {
  path: "/getAllFAQ",
  method: "GET"
};

export const SQL_GET_TEAM = {
  path: "/getTeamInfo",
  method: "GET"
};

export const SQL_GET_CHAT_PICTURE = {
  path: "/chatPicture",
  method: "GET"
};

export const SQL_GET_CHAT_AUDIO = {
  path: "/chatAudio",
  method: "GET"
};

export const SQL_GET_MARKETPLACE = {
  path: "/marketplace",
  method: "GET"
};

export const SQL_GET_MARKETPLACE_OFFER = {
  path: "/specificMarketplaceOffer",
  method: "GET"
};

export const SQL_GET_LIFT_REQUESTS = {
  path: "/liftRequests",
  method: "GET"
};

export const SQL_GET_OUTGOING_REQUESTS = {
  path: "/outgoingRequests",
  method: "GET"
};

export const SQL_LOAD_MESSAGE_MEDIA = {
  path: "/loadMessageMedia",
  method: "GET"
};

export const TEST_API = {
  path: "/apiTest",
  method: "POST"
};

export const SQL_CREATE_USER_IF_NOT_EXISTING = {
  path: "/createUserIfNotExisting",
  method: "POST"
};

export const SQL_UPDATE_DESCRIPTION = {
  path: "/updateDescription",
  method: "POST"
};

export const SQL_UPDATE_GENDER = {
  path: "/updateGender",
  method: "POST"
};

export const SQL_UPDATE_LIFT_MAX_DISTANCE = {
  path: "/updateLiftMaxDistance",
  method: "POST"
};

export const SQL_UPDATE_PROFILE_PICTURE = {
  path: "/updateProfilePicture",
  method: "POST"
};

export const SQL_RESET_PROFILE_PICTURE = {
  path: "/resetProfilePicture",
  method: "POST"
};

export const SQL_UPDATE_PREFS = {
  path: "/updatePrefs",
  method: "POST"
};

export const SQL_ADD_ADDRESS = {
  path: "/addAddress",
  method: "POST"
};

export const SQL_REMOVE_ADDRESS = {
  path: "/removeAddress",
  method: "POST"
};

export const SQL_UPDATE_DEFAULT_ADDRESS = {
  path: "/updateDefaultAddress",
  method: "POST"
};

export const SQL_ADD_CAR = {
  path: "/addCar",
  method: "POST"
};

export const SQL_REMOVE_CAR = {
  path: "/removeCar",
  method: "POST"
};

export const SQL_ADD_LIFT = {
  path: "/addLift",
  method: "POST"
};

export const SQL_UPDATE_LIFT_TIME = {
  path: "/updateLiftTime",
  method: "POST"
};

export const SQL_LEAVE_LIFT = {
  path: "/leaveLift",
  method: "POST"
};

export const SQL_ADD_LIFT_REQUEST = {
  path: "/addLiftRequest",
  method: "POST"
};

export const SQL_RESPOND_REQUEST = {
  path: "/respondRequest",
  method: "POST"
};

export const SQL_ACCEPT_ALL_REQUESTS = {
  path: "/respondAllRequests",
  method: "POST"
};

export const SQL_SEND_MESSAGE = {
  path: "/sendMessage",
  method: "POST"
};

export const SQL_ADD_QUESTION = {
  path: "/sendMessage",
  method: "POST"
};

export const SQL_UPDATE_FAQ_QUESTION = {
  path: "/updateQuestion",
  method: "POST"
};
