export const BASE_URL = process.env.NODE_ENV === "production" ? "https://api.pdfgator.ai" : "http://127.0.0.1:8000";
export const GET_FILES = "api/data/filelist/";
export const SET_FILES = "api/data/files/";
export const GOOGLE_OAUTH =
  "api/register-by-access-token/social/google-oauth2/";
export const SEARCH_QUERY = "api/data/searchquery/";
export const SEARCH_QUERY_FROM_HISTORY = "api/data/searchqueryfromhistory/";
export const GET_USER = "api/getuser/";
export const DELETE_FILES = "api/data/deletefiles/";
export const PROCESS_CITATION = "api/data/processcitation/";
export const GET_PRODUCTS = "payments/getStripeProducts";
export const CREATE_CHECKOUT = "payments/create-checkout-session/";
export const VERIFY_CHECKOUT = "payments/verify-checkout-session/";
export const CUSTOMER_PORTAL = "payments/customer-portal/";
export const UPDATECITATIONDATA = "api/data/updatecitationdata/";
export const DELETE_SEARCH = "api/data/deletesearch/";
export const GET_USAGE = "api/getusage/";
export const MAIN_APP_URL = "/app";
