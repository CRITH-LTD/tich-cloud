import axios from 'axios';
import { handleAxiosError } from '../utils/toast-error-handler';
import { store } from '../store';
import { logout as logoutUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'https://tich-sl9r.onrender.com',
  // baseURL: 'http://localhost:8000',
  // baseURL: 'http://192.168.0.114:8000',
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Mark retries (only once)
    config.metadata = config.metadata || {};
    config.metadata.retryCount = config.metadata.retryCount || 0;

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // 🔐 Auto logout on 401 Unauthorized
    if (error?.response?.status === 401) {
      toast.error("Session expired. Please log in again.", { autoClose: 4000 });
      store.dispatch(logoutUser());
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    // 🔁 Optional Retry (once)
    const shouldRetry = !config._retry && error?.response?.status >= 500;
    if (shouldRetry) {
      config._retry = true;
      config.metadata.retryCount += 1;

      try {
        return await api(config);
      } catch (retryError) {
        handleAxiosError(retryError, undefined, { showConsoleLog: true });
        return Promise.reject(retryError);
      }
    }

    // 🚫 Handle error via toast (unless silenced)
    if (!config?.silentError) {
      handleAxiosError(error);
    }

    return Promise.reject(error);
  }
);

export default api;
