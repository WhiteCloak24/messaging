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
export const getResourceUrl = ({ name = "", type = "" }) => {
  return apiClient({
    method: routes.GET_RESOURCE_URL.METHOD,
    url: `${routes.GET_RESOURCE_URL.PATH}?type=${type}&name=${name}`,
  });
};
export const deleteResource = ({ name = "", type = "" }) => {
  return apiClient({
    method: routes.DELETE_RESOURCE.METHOD,
    url: `${routes.DELETE_RESOURCE.PATH}?type=${type}&name=${name}`,
  });
};
export const userDetails = ({ id = "" }) => {
  return apiClient({
    method: routes.USER_DETAILS.METHOD,
    url: `${routes.USER_DETAILS.PATH}/${id}`,
  });
};
export const userListing = (value) => {
  return apiClient({
    method: routes.USER_LISTING.METHOD,
    url: routes.USER_LISTING.PATH,
    data: value,
  });
};
export const userUpdate = (value) => {
  return apiClient({
    headers: { "Content-Type": "multipart/form-data" },
    method: routes.USER_UPDATE.METHOD,
    url: routes.USER_UPDATE.PATH,
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
