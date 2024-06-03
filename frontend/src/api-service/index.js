import { apiClient } from './axios';
import { routes } from './routes';

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