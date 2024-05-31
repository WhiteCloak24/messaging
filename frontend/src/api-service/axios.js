import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:4000",
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
    throw new Error(error?.response?.data?.message);
  }
);
