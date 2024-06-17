import axios from "axios";
import { dispatchCustomEventFn } from "../resources/functions";
import { AlertEVENTS } from "../resources/constants";

export const apiClient = axios.create({
  baseURL: "http://localhost:4000",
  // baseURL: "https://messaging-xqe6.onrender.com",
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
      config.headers["Authorization"] = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2NyZWF0ZWRfYXQiOjE3MTc3NTg3ODY1NjksInNlc3Npb25faWQiOiJxVk41VmJ3VEZ3UEpYZUxSIiwiZW1haWwiOiJ5YXNoQGdtYWlsLmNvbSIsImNsaWVudF9pcCI6Ijo6MSIsInVzZXJfYWdlbnQiOiJNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI1LjAuMC4wIFNhZmFyaS81MzcuMzYiLCJ1c2VyX2lkIjoiMWIwMjM5MzctNzczMy00NWNlLTlkZDQtY2MzNGUwZGVhOThiIiwiaWF0IjoxNzE3NzU4Nzg2LCJleHAiOjE4MDQxNTg3ODZ9.E4gIhxrNj1zIUDlV7kH04h9x1EBhp7B72Xnf_FJtCaw`;
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
