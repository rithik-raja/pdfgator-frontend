import axios from "axios";
import { BASE_URL } from "../../constants/apiConstants";
import Cookies from "js-cookie";
import { getAuthToken, removeAuthToken } from "../../services/userServices";
import updateUser from "../../utils/updateUser";
import { getSessionId } from "../../services/sessionService";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  // withCredentials: "true",
});

export const get1 = async (url) => {
  const response = await fetch("http://127.0.0.1:8000" + url, {
    credentials: "include",
  });
  return response;
};
export const get = async (url) => {
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
    return response;
  } catch (error) {
    if (error?.response?.data?.detail === "Invalid token.") {
      removeAuthToken();
      updateUser();
    }
    console.error(error);
    return null;
  }
};
export const post = async (url, data, config = null) => {
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
    data = {...data, session_id: getSessionId()}
    const response = await api.post(url, data, config);
    return response;
  } catch (error) {
    if (error?.response?.data?.detail === "Invalid token.") {
      removeAuthToken();
      updateUser();
    }
    console.error(error);
    return null;
  }
};
