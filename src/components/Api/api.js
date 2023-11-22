import axios from "axios";
import { BASE_URL } from "../../constants/apiConstants";
import { getAuthToken, removeAuthToken } from "../../services/userServices";
import updateUser from "../../utils/updateUser";
import { getSessionId } from "../../services/sessionService";
import { displayToast } from "../CustomToast/CustomToast";
const api = axios.create({
  baseURL: BASE_URL,
  //timeout: 5000,
  // withCredentials: "true",
});

export const get = async (url, displayDefaultError=true) => {
  try {
    const authtok = getAuthToken();
    let headers;
    if (authtok) {
      headers = {
        "Content-Type": "application/json",
        Authorization: "Token " + authtok,
      };
    } else {
      headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await api.get(url, {
      headers: headers,
    });
    return {
      error: false,
      response
    };
  } catch (error) {
    console.error(error);
    if (error.response?.data?.detail === "Invalid token.") {
      removeAuthToken();
      updateUser();
    }
    if (displayDefaultError) {
      displayToast(error.response?.data?.detail ?? error.message);
    }
    return {
      error: true,
      response: error.response
    };
  }
};
export const post = async (url, data, config=null, displayDefaultError=true) => {
  try {
    const authtok = getAuthToken();
    if (config && config.headers) {
      if (authtok) {
        config.headers = Object.assign({}, config.headers, {
          Authorization: "Token " + authtok,
        });
      }
    } else if (authtok) {
      config = { headers: { Authorization: "Token " + authtok } };
    } else {
      config = {};
    }
    if (data instanceof FormData) {
      data.append("session_id", getSessionId());
    } else {
      data = { ...data, session_id: getSessionId() };
    }
    const response = await api.post(url, data, config);
    return {
      error: false,
      response
    };
  } catch (error) {
    console.error(error);
    if (error?.response?.data?.detail === "Invalid token.") {
      removeAuthToken();
      updateUser();
    }
    if (displayDefaultError) {
      displayToast(error.response?.data?.detail ?? error.message);
    }
    return {
      error: true,
      response: error.response
    };
  }
};
