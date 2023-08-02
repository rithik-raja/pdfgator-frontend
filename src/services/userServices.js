import Cookies from "js-cookie";
import { USER_ID, AUTH_TOKEN } from "../constants/storageConstants";
import { v4 as uuidv4 } from "uuid";

export const getUserID = () => {
  return Cookies.get(USER_ID);
};
export const setUserID = (value) => {
  Cookies.set(USER_ID, value, { expires: 7 });
};
export const removeUserID = () => {
  Cookies.remove(USER_ID);
};
export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN);
};
export const setAuthToken = (value) => {
  Cookies.set(AUTH_TOKEN, value, { expires: 7 });
};
export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN);
};
export const logOut = () => {
  removeAuthToken();
  removeUserID();
  window.location.reload();
};

export const getUserLoggedIn = () => {
  return false;
};
export const setUserLoggedIn = (value) => {};
