import Cookies from "js-cookie";
import { AUTH_TOKEN, CHECKOUT_SESSION_ID } from "../constants/storageConstants";
import updateUser from "../utils/updateUser";
import {
  CURRENT_PLAN_EXPIRED,
  CURRENT_PLAN_FREE,
  CURRENT_PLAN_SUBSCRIPED,
  CURRENT_PLAN_SUBSCRIPTION_CANCELED,
} from "../constants/userConstants";

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
  Cookies.set(CHECKOUT_SESSION_ID, value, { expires: 7 });
};
export const removeCheckoutSessionID = () => {
  Cookies.remove(CHECKOUT_SESSION_ID);
};

export const logOut = (setError) => {
  setError("Logged Out", "success");
  removeAuthToken();
  removeCheckoutSessionID();
  updateUser();
};

export const getUserPlanStatus = (stripeDetails, planID) => {
  let planStatus = CURRENT_PLAN_FREE;
  const result = stripeDetails?.reduce((accumulator, value, index) => {
    return { ...accumulator, [value.product_id]: value };
  }, {});
  if (result && result[planID] !== undefined) {
    let plan = result[planID];
    if (plan.is_plan_canceled === false) {
      if (plan.is_subscription_canceled === false) {
        planStatus = CURRENT_PLAN_SUBSCRIPED;
      } else if (plan.is_subscription_canceled === true) {
        planStatus = CURRENT_PLAN_SUBSCRIPTION_CANCELED;
      }
    } else {
      planStatus = CURRENT_PLAN_EXPIRED;
    }
  }
  return planStatus;
};
