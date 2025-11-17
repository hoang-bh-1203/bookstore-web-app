/**
 * Health check utility to verify API availability
 * Prevents infinite loops when backend server is down
 */

interface HealthCheckResult {
  isHealthy: boolean;
  lastChecked: number;
}

// Store health check status in memory
let healthCheckCache: HealthCheckResult = {
  isHealthy: true,
  lastChecked: 0,
};

const HEALTH_CHECK_INTERVAL = 10000; // 10 seconds
const HEALTH_CHECK_TIMEOUT = 5000; // 5 seconds timeout

/**
 * Check if API server is healthy
 * @returns {Promise<boolean>} - true if API is available, false otherwise
 */
export const checkApiHealth = async (): Promise<boolean> => {
  const now = Date.now();

  // Use cached result if check was done recently
  if (
    healthCheckCache.lastChecked > 0 &&
    now - healthCheckCache.lastChecked < HEALTH_CHECK_INTERVAL
  ) {
    return healthCheckCache.isHealthy;
  }

  try {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const healthEndpoint = `${baseURL}/health`;

    const response = await fetch(healthEndpoint, {
      method: 'GET',
      timeout: HEALTH_CHECK_TIMEOUT,
      signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT),
    } as any);

    const isHealthy = response.ok;
    healthCheckCache = {
      isHealthy,
      lastChecked: now,
    };

    return isHealthy;
  } catch (error) {
    // If health endpoint doesn't exist, try to reach the API with a simple request
    try {
      const baseURL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
      const testEndpoint = `${baseURL}/categories`;

      const response = await fetch(testEndpoint, {
        method: 'HEAD',
        signal: AbortSignal.timeout(HEALTH_CHECK_TIMEOUT),
      } as any);

      const isHealthy = response.ok;
      healthCheckCache = {
        isHealthy,
        lastChecked: now,
      };

      return isHealthy;
    } catch (innerError) {
      healthCheckCache = {
        isHealthy: false,
        lastChecked: now,
      };

      console.warn('API health check failed:', innerError);
      return false;
    }
  }
};

/**
 * Get cached health status without making a new request
 * @returns {boolean} - Cached health status
 */
export const getApiHealthCached = (): boolean => {
  return healthCheckCache.isHealthy;
};

/**
 * Reset health check cache (useful for manual retry)
 */
export const resetHealthCheck = (): void => {
  healthCheckCache = {
    isHealthy: true,
    lastChecked: 0,
  };
};

/**
 * Set health status manually
 * @param {boolean} isHealthy - Health status to set
 */
export const setApiHealthStatus = (isHealthy: boolean): void => {
  healthCheckCache = {
    isHealthy,
    lastChecked: Date.now(),
  };
};
