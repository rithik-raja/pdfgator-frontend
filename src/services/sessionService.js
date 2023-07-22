import Cookies from "js-cookie";
import { SESSION_ID } from "../constants/storageConstants";
import { v4 as uuidv4 } from "uuid";

export const getSessionId = () => {
  const session_id = Cookies.get(SESSION_ID);
  if (session_id) {
    return session_id;
  } else {
    const new_id = uuidv4();
    setSessionId(new_id);
    return new_id;
  }
};
export const setSessionId = (value) => {
  Cookies.set(SESSION_ID, value, { expires: 30 });
};
export const sessionValid = () => {};
export const removeSessionId = () => {
  Cookies.remove(SESSION_ID);
};
