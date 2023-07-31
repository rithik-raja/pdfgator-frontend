import axios from "axios";
import { BASE_URL } from "../../constants/apiConstants";
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
    const response = await api.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // withCredentials: "true",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const post = async (url, data, config) => {
  try {
    const response = await api.post(url, data, config);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
