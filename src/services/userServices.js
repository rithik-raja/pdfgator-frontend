import Cookies from "js-cookie";
import { USER_ID, AUTH_TOKEN } from "../constants/storageConstants";
import { v4 as uuidv4 } from "uuid";
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
export const logOut = () => {
  removeAuthToken();
  updateUser();
};
