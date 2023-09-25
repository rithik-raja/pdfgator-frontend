import Cookies from "js-cookie";
import { AUTH_TOKEN, CHECKOUT_SESSION_ID } from "../constants/storageConstants";
import updateUser from "../utils/updateUser";

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN);
};
export const setAuthToken = (value) => {
  Cookies.set(AUTH_TOKEN, value, { expires: 7 });
};
export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN);
};

export const getCheckoutSessionID = () => {
  return Cookies.get(CHECKOUT_SESSION_ID);
};
export const setCheckoutSessionID = (value) => {
  Cookies.set(CHECKOUT_SESSION_ID, value, { expires: 30 });
};
export const removeCheckoutSessionID = () => {
  Cookies.remove(CHECKOUT_SESSION_ID);
};

export const logOut = () => {
  removeAuthToken();
  removeCheckoutSessionID();
  updateUser();
};
