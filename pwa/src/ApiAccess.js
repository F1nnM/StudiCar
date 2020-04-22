export const ApiBasePath = process.env.DEV ? "https://"+window.location.hostname :
  (window.location.hostname.startsWith("dev") ? "https://dev.api.studicar.mfinn.de" : "https://api.studicar.mfinn.de")

export function sendApiRequest(action, options, successCallback, errorCallback) {
  if (!(action.path && action.method))
    errorCallback(new Error("Invalid action supplied. Use predefined or make sure that it contains a path and a method."))

  var axios = require("axios");

  if (action.method === "GET") {
    axios.get(ApiBasePath + action.path, { params: options })
      .then(response => successCallback(response.data))
      .catch(errorCallback)
  } else if (action.method === "POST") {
    axios.post(ApiBasePath + action.path, options)
      .then(response => successCallback(response.data))
      .catch(errorCallback)
  }
}

export const PING = {
  path: "/ping",
  method: "GET"
}

export const SQL_TEST_READ = {
  path: "/sqlTest",
  method: "GET"
}

export const SQL_TEST_ADD = {
  path: "/sqlTest",
  method: "POST"
}

export const SQL_CREATE_USER_IF_NOT_EXISTING = {
  path: "/createUserIfNotExisting",
  method: "POST"
}

export const GET_USER_PROFILE_PIC = {
  path: "/profilePicture",
  method: "GET"
}

export const SQL_GET_USER_DATA = {
  path: "/getUserData",
  method: "GET"
}