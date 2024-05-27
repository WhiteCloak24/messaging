import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('nph-acc-tkn');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    throw new Error(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
    if (error?.response?.data?.data?.payment_status === 0) {
      const {
        uuid = '',
        plan_uuid = '',
        duration_slot = 'M',
      } = error?.response?.data?.data || {};
      window.location.href = `/payment-method?plan_uuid=${plan_uuid}&duration=${
        duration_slot === 'M' ? '1' : '12'
      }&uuid=${uuid}`;
    }
    throw new Error(error?.response?.data?.message);
  },
);
