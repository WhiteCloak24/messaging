import axios from "axios";
import { dispatchCustomEventFn } from "../resources/functions";
import { AlertEVENTS } from "../resources/constants";

export const apiClient = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: "https://messaging-xqe6.onrender.com",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // const accessToken = localStorage.getItem("nph-acc-tkn");
    // if (accessToken) {
    //   config.headers["Authorization"] = `Bearer ${accessToken}`;
    // }
    return config;
  },
  (error) => {
    throw new Error(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    dispatchCustomEventFn({ eventName: AlertEVENTS.ALERT, eventData: { message: error?.response?.data?.message } });
    throw new Error(error?.response?.data?.message);
  }
);
