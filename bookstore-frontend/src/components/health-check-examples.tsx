/**
 * Example component demonstrating how to use the API Health Check
 * This file shows various patterns for integrating health checks into components
 */

import type { ReactElement } from 'react';
import { useApiHealth } from '@/hooks/useApiHealth';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Simple Pattern: Show/Hide based on health status
 */
export const SimpleHealthCheckExample = (): ReactElement => {
  const { isHealthy } = useApiHealth();

  if (!isHealthy) {
    return <div className="text-red-500">API is unavailable</div>;
  }

  return <div className="text-green-500">API is healthy</div>;
};

/**
 * Detailed Pattern: Show status badge with more information
 */
export const HealthStatusBadge = (): ReactElement => {
  const { isHealthy, isChecking } = useApiHealth();

  return (
    <div className="flex items-center gap-2">
      {isChecking && (
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
      )}
      {!isChecking && isHealthy && (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">API Healthy</span>
        </>
      )}
      {!isChecking && !isHealthy && (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-600">API Unavailable</span>
        </>
      )}
    </div>
  );
};

/**
 * Advanced Pattern: Conditional rendering with fallback UI
 */
export const ConditionalDataFetch = (): ReactElement => {
  const { isHealthy } = useApiHealth();

  const fetchData = async () => {
    if (!isHealthy) {
      console.warn('Cannot fetch: API is unhealthy');
      return;
    }

    // Proceed with fetch
    try {
      // Your API call here
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  return (
    <div>
      {!isHealthy && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            Server is temporarily unavailable
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Please check your connection or try again later
          </p>
        </div>
      )}

      {isHealthy && (
        <div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Fetch Data
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Pattern: Disable controls when API is unhealthy
 */
export const ControlsWithHealthCheck = (): ReactElement => {
  const { isHealthy } = useApiHealth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isHealthy) {
      alert('Cannot submit: API is unavailable');
      return;
    }

    // Submit form
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter data"
        disabled={!isHealthy}
        className="w-full p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <select
        disabled={!isHealthy}
        className="w-full p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option>Choose an option</option>
      </select>

      <button
        type="submit"
        disabled={!isHealthy}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isHealthy ? 'Submit' : 'API Unavailable'}
      </button>
    </form>
  );
};

/**
 * Pattern: Retry logic with health check
 */
export const RetryWithHealthCheck = (): ReactElement => {
  const { isHealthy, getCachedHealth } = useApiHealth();

  const handleRetry = async () => {
    // Wait for API to potentially recover
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (getCachedHealth()) {
      console.log('API is now healthy, retrying...');
      // Retry your operation
    } else {
      console.log('API is still unavailable');
    }
  };

  return (
    <div>
      {!isHealthy && (
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Retry
        </button>
      )}
    </div>
  );
};

/**
 * Usage in your component:
 *
 * import { useApiHealth } from '@/hooks/useApiHealth';
 *
 * export const MyComponent = () => {
 *   const { isHealthy } = useApiHealth();
 *
 *   // Now you can:
 *   // - Skip API calls when !isHealthy
 *   // - Disable form controls when !isHealthy
 *   // - Show error messages when !isHealthy
 *   // - Provide fallback UI when !isHealthy
 * };
 */
