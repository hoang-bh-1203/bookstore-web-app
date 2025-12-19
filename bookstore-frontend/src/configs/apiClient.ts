import axios, { AxiosError } from 'axios';
import { checkApiHealth, setApiHealthStatus } from '@/utils/healthCheck';

/**
 * Create a configured Axios instance for API communication
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add authentication token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor to handle common errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    // Mark API as healthy on successful response
    setApiHealthStatus(true);
    return response;
  },
  (error: AxiosError) => {
    // Mark API as unhealthy on error
    setApiHealthStatus(false);

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // TODO: Implement redirect to login page or show unauthorized modal
    }
    return Promise.reject(error.response?.data || {});
  },
);

// Perform periodic health checks
setInterval(async () => {
  await checkApiHealth();
}, 30000); // Check every 30 seconds

export default apiClient;
