import { apiClient } from "./axios";
import { routes } from "./routes";

export const login = (value) => {
  return apiClient({
    method: routes.LOGIN.METHOD,
    url: routes.LOGIN.PATH,
    data: value,
  });
};
export const signup = (value) => {
  return apiClient({
    method: routes.SIGN_UP.METHOD,
    url: routes.SIGN_UP.PATH,
    data: value,
  });
};
export const userListing = (value) => {
  return apiClient({
    method: routes.USER_LISTING.METHOD,
    url: routes.USER_LISTING.PATH,
    data: value,
  });
};
export const chatListing = (value) => {
  return apiClient({
    method: routes.CHAT_LISTING.METHOD,
    url: routes.CHAT_LISTING.PATH,
    data: value,
  });
};
