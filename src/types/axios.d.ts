import 'axios';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      retryCount?: number;
    };
    silentError?: boolean;
    _retry?: boolean;
  }
}
