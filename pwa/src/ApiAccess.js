const basePath = process.env.DEV ? "http://localhost" :
  (window.location.hostname.startsWith("dev") ? "https://dev.api.studicar.mfinn.de" : "https://api.studicar.mfinn.de")

console.log(process);

export function sendApiRequest(action, options, successCallback, errorCallback) {
  if (!(action.path && action.method))
    throw new Error("Invalid action supplied. Use predefined or make sure that it contains a path and a method.")

  var axios = require("axios");

  if (action.method === "GET") {
    axios.get(basePath + action.path, { params: options })
      .then(response => successCallback(response.data))
      .catch(errorCallback)
  } else if (action.method === "POST") {
    axios.post(basePath + action.path, options)
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