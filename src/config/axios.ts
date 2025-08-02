/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders
} from 'axios';
import { handleAxiosError } from '../utils/toast-error-handler';
import { store } from '../store';
import { logout as logoutUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

// @TODO - Remove all console logs

// Environment-based configuration
const API_CONFIG = {
  production: 'https://tich-sl9r.onrender.com',
  development: 'http://localhost:8000',
  local: 'http://192.168.0.114:8000'
} as const;

const getBaseURL = (): string => {
  // Check for Vite environment variables
  if (import.meta.env?.MODE === 'production') return API_CONFIG.production;
  if (import.meta.env?.VITE_USE_LOCAL === 'true') return API_CONFIG.local;

  // Fallback to window location for environment detection
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return API_CONFIG.development;
    }
    if (window.location.protocol === 'https:') {
      return API_CONFIG.production;
    }
  }

  return API_CONFIG.development;
};

// Constants
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const REQUEST_TIMEOUT = 30000; // 30 seconds

interface QueueItem {
  // The resolve function provided by the Promise executor
  resolve: (value: string | PromiseLike<string>) => void;
  // The reject function provided by the Promise executor
  reject: (error?: Error) => void;
}

interface RequestMetadata {
  retryCount: number;
  startTime: number;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata: RequestMetadata;
  _authRetry?: boolean;
  silentError?: boolean;
}

interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

class APIClient {
  private client: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: QueueItem[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: getBaseURL(),
      timeout: REQUEST_TIMEOUT,
      // headers: {
      //   'Content-Type': 'application/json',
      // }
    });

    this.setupInterceptors();
  }

  setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        return this.handleRequest(config);
      },
      (error: AxiosError): Promise<AxiosError> => {
        return this.handleRequestError(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        return this.handleResponse(response);
      },
      (error: AxiosError): Promise<AxiosResponse> => {
        return this.handleResponseError(error);
      }
    );
  }

  // Request interceptor logic
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = this.getValidToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Set Content-Type only if not already set and data is not FormData
    if (config.headers && !config.headers['Content-Type']) {
      // Check if the data is FormData
      const isFormData = config.data instanceof FormData;

      if (!isFormData) {
        config.headers['Content-Type'] = 'application/json';
      }
      // If it's FormData, let axios set the Content-Type with boundary automatically
    }

    // Initialize metadata for tracking
    const metadata: RequestMetadata = {
      retryCount: 0,
      startTime: Date.now(),
    };

    (config as ExtendedAxiosRequestConfig).metadata = metadata;

    // Add request ID for debugging
    if (config.headers) {
      (config.headers as AxiosRequestHeaders)['X-Request-ID'] = this.generateRequestId();
    }

    return config;
  }

  private handleRequestError(error: AxiosError): Promise<AxiosError> {
    console.error('Request setup failed:', error);
    return Promise.reject(error);
  }

  // Response interceptor logic
  private handleResponse(response: AxiosResponse): AxiosResponse {
    // Log performance metrics in development
    const isDevelopment = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isDevelopment) {
      const extendedConfig = response.config as ExtendedAxiosRequestConfig;
      const duration = Date.now() - extendedConfig.metadata.startTime;
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }

    return response;
  }

  private async handleResponseError(error: AxiosError): Promise<AxiosResponse> {
    const { config, response } = error;

    if (!config) return Promise.reject(error);

    // Handle different error scenarios
    switch (response?.status) {
      case 401:
        return this.handleUnauthorized(error);
      case 403:
        return this.handleForbidden(error);
      case 429:
        return this.handleRateLimit(error);
      case undefined: // Network error
        return this.handleNetworkError(error);
      default:
        if (response?.status && response.status >= 500) {
          return this.handleServerError(error);
        }
        return this.handleClientError(error);
    }
  }

  // Add these methods to your APIClient class:

  public postFormData<T = unknown>(
    url: string,
    data: FormData,
    config: Partial<ExtendedAxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T>> {
    const formDataConfig = {
      ...config,
      headers: {
        ...config.headers,
        // Don't set Content-Type for FormData - let axios handle it
      }
    };

    // Remove Content-Type if it exists
    if (formDataConfig.headers && 'Content-Type' in formDataConfig.headers) {
      delete formDataConfig.headers['Content-Type'];
    }

    return this.client.post(url, data, formDataConfig);
  }

  public patchFormData<T = unknown>(
    url: string,
    data: FormData,
    config: Partial<ExtendedAxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T>> {
    const formDataConfig = {
      ...config,
      headers: {
        ...config.headers,
        // Don't set Content-Type for FormData - let axios handle it
      }
    };

    // Remove Content-Type if it exists
    if (formDataConfig.headers && 'Content-Type' in formDataConfig.headers) {
      delete formDataConfig.headers['Content-Type'];
    }

    return this.client.patch(url, data, formDataConfig);
  }

  public putFormData<T = unknown>(
    url: string,
    data: FormData,
    config: Partial<ExtendedAxiosRequestConfig> = {}
  ): Promise<AxiosResponse<T>> {
    const formDataConfig = {
      ...config,
      headers: {
        ...config.headers,
        // Don't set Content-Type for FormData - let axios handle it
      }
    };

    // Remove Content-Type if it exists
    if (formDataConfig.headers && 'Content-Type' in formDataConfig.headers) {
      delete formDataConfig.headers['Content-Type'];
    }

    return this.client.put(url, data, formDataConfig);
  }
  // Specific error handlers
  private async handleUnauthorized(error: AxiosError): Promise<AxiosResponse> {
    const { config } = error;

    // Explicitly check for config. This should satisfy TypeScript.
    if (!config) {
      return Promise.reject(error);
    }

    const extendedConfig = config as ExtendedAxiosRequestConfig;

    // Prevent infinite loops
    if (config?.url?.includes('/auth/refresh') || extendedConfig._authRetry) {
      this.performLogout('Authentication failed');
      return Promise.reject(error);
    }

    // Try token refresh
    try {
      await this.refreshToken();
      extendedConfig._authRetry = true;

      return this.client(config);
    } catch (refreshError) {
      this.performLogout('Session expired. Please log in again.');
      return Promise.reject(error);
    }
  }

  private handleForbidden(error: AxiosError): Promise<AxiosResponse> {
    toast.error('Access denied. You don\'t have permission for this action.');
    this.logError(error, 'FORBIDDEN');
    return Promise.reject(error);
  }

  private async handleRateLimit(error: AxiosError): Promise<AxiosResponse> {
    const retryAfter = error.response?.headers['retry-after'] as string || '1';
    const delay = parseInt(retryAfter) * 1000;

    toast.warn(`Rate limited. Retrying in ${retryAfter} seconds...`);

    await this.delay(delay);
    return this.client(error.config!);
  }

  private async handleNetworkError(error: AxiosError): Promise<AxiosResponse> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      toast.error('No internet connection. Please check your network.');
      return Promise.reject(error);
    }

    return this.retryRequest(error);
  }

  private async handleServerError(error: AxiosError): Promise<AxiosResponse> {
    const { config } = error;

    // Only retry idempotent operations
    if (config && this.isIdempotent(config.method)) {
      return this.retryRequest(error);
    }

    this.showErrorToast(error);
    return Promise.reject(error);
  }

  private handleClientError(error: AxiosError): Promise<AxiosResponse> {
    this.showErrorToast(error);
    this.logError(error, 'CLIENT_ERROR');
    return Promise.reject(error);
  }

  // Utility methods
  private async retryRequest(error: AxiosError): Promise<AxiosResponse> {
    const { config } = error;
    const extendedConfig = config as ExtendedAxiosRequestConfig;

    if (!config || extendedConfig.metadata.retryCount >= MAX_RETRIES) {
      this.logError(error, 'MAX_RETRIES_EXCEEDED');
      this.showErrorToast(error);
      return Promise.reject(error);
    }

    extendedConfig.metadata.retryCount++;
    const delay = RETRY_DELAY * Math.pow(2, extendedConfig.metadata.retryCount - 1); // Exponential backoff

    console.warn(`Retrying request (${extendedConfig.metadata.retryCount}/${MAX_RETRIES}) after ${delay}ms`);

    await this.delay(delay);
    return this.client(config);
  }

  private async refreshToken(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await axios.post<RefreshTokenResponse>(`${getBaseURL()}/auth/refresh`, {
        refresh_token: refreshToken
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;

      localStorage.setItem('access_token', access_token);
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }

      this.processQueue(null, access_token);
      return access_token;
    } catch (error) {
      this.processQueue(error as Error, null);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: Error | null, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      // If an error occurred, reject the promise
      if (error) {
        reject(error);
      }
      // If no error but no token, this is also an error state (logout, etc.)
      else if (token) {
        // Only resolve if a valid token is available
        resolve(token);
      } else {
        // If there's no error AND no token, something went wrong.
        // Reject the promise with a generic error or the original error if available.
        reject(new Error('Token refresh failed. No token was provided.'));
      }
    });

    this.failedQueue = [];
  }

  private performLogout(message: string): void {
    toast.error(message, { autoClose: 4000 });

    // Clear tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Dispatch logout action
    store.dispatch(logoutUser());

    // Redirect after a brief delay to allow toast to show
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = "/signin";
      }
    }, 1000);
  }

  private getValidToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number };
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      // Refresh if token expires within threshold
      if (expirationTime - currentTime < TOKEN_REFRESH_THRESHOLD) {
        this.refreshToken().catch(() => {
          // Silent fail - will be handled by 401 response
        });
      }

      return token;
    } catch (error) {
      console.warn('Invalid token format:', error);
      return null;
    }
  }

  private showErrorToast(error: AxiosError): void {
    const extendedConfig = error.config as ExtendedAxiosRequestConfig;
    if (extendedConfig?.silentError) return;

    // Use custom error handler if available
    if (typeof handleAxiosError === 'function') {
      handleAxiosError(error);
    } else {
      const errorData = error.response?.data as ApiResponse | undefined;
      const message = errorData?.message || 'An unexpected error occurred';
      toast.error(message);
    }
  }

  private logError(error: AxiosError, context: string = 'API_ERROR'): void {
    const errorInfo = {
      context,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      timestamp: new Date().toISOString(),
      requestId: (error.config?.headers as AxiosRequestHeaders)?.['X-Request-ID']
    };

    console.error(`[${context}]`, errorInfo);

    // Send to error tracking service in production
    const isProduction = typeof window !== 'undefined' &&
      window.location.protocol === 'https:' &&
      !window.location.hostname.includes('localhost');

    if (isProduction && (window as Window & { Sentry?: { captureException: (error: Error, options?: { extra: Record<string, unknown> }) => void } }).Sentry) {
      window.Sentry?.captureException(error, {
        extra: errorInfo
      });
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private isIdempotent(method?: string): boolean {
    return ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'].includes(method?.toUpperCase() || '');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods for direct usage
  public get<T = unknown>(url: string, config: Partial<ExtendedAxiosRequestConfig> = {}): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  public post<T = unknown, D = unknown>(url: string, data?: D, config: Partial<ExtendedAxiosRequestConfig> = {}): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  public put<T = unknown, D = unknown>(url: string, data?: D, config: Partial<ExtendedAxiosRequestConfig> = {}): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  public patch<T = unknown, D = unknown>(url: string, data?: D, config: Partial<ExtendedAxiosRequestConfig> = {}): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  public delete<T = unknown>(url: string, config: Partial<ExtendedAxiosRequestConfig> = {}): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  // Health check method
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', { silentError: true });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const api = new APIClient();

// Export both the instance and the class for flexibility
export default api;
export { APIClient };