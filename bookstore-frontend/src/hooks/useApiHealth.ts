import { useEffect, useState } from 'react';
import { checkApiHealth, getApiHealthCached } from '@/utils/healthCheck';

/**
 * Hook to check and monitor API health
 * Prevents components from making requests when API is unavailable
 */
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const performHealthCheck = async () => {
      setIsChecking(true);
      try {
        const healthy = await checkApiHealth();
        setIsHealthy(healthy);
      } catch (error) {
        console.error('Health check error:', error);
        setIsHealthy(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Perform initial health check
    performHealthCheck();

    // Set up interval for periodic health checks
    const interval = setInterval(performHealthCheck, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getCachedHealth = () => getApiHealthCached();

  return {
    isHealthy,
    isChecking,
    getCachedHealth,
  };
};
