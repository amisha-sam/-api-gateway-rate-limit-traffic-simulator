import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authStore } from '../store/authStore';

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || process.env.VITE_API_BASE_URL || '';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // allow cookies if backend sets httpOnly cookies for refresh
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: AxiosResponse<any>) => void;
  reject: (error: any) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      if (token && prom.config.headers) prom.config.headers['Authorization'] = `Bearer ${token}`;
      prom.resolve(axios(prom.config));
    }
  });
  failedQueue = [];
};

async function refreshTokenRequest(refreshToken: string | null) {
  // Use a bare axios instance to avoid interceptors
  return axios({
    method: 'POST',
    url: `${API_BASE}/api/auth/refresh`,
    data: { refreshToken },
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });
}

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = authStore.getState();
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      // avoid infinite loop
      originalRequest._retry = true;

      const { refreshToken } = authStore.getState();

      if (!refreshToken) {
        // No refresh token, force logout
        authStore.setState({ accessToken: null, refreshToken: null, user: null });
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const res = await refreshTokenRequest(refreshToken);
        const data = res.data;
        const newAccess = data.accessToken;
        const newRefresh = data.refreshToken || refreshToken;

        authStore.setState({ accessToken: newAccess, refreshToken: newRefresh });

        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        authStore.setState({ accessToken: null, refreshToken: null, user: null });
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
