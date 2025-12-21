import type { CustomErrorResponse } from '@/constants/interfaces';
import apiClient from './apiClient';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type CustomResponse<T = unknown> = {
  code: number;
  data: T;
};

/**
 * Request class containing all HTTP methods for API communication
 */
export class Request {
  /**
   * Generic API call method that handles all HTTP requests
   * @param config - Axios request configuration
   * @returns Promise with the response data
   * @throws CustomErrorResponse on error
   */
  private static async apiCall<T = unknown>(
    config: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response: AxiosResponse<CustomResponse<T>> =
        await apiClient(config);
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as CustomErrorResponse;

      throw axiosError;
    }
  }

  /**
   * Performs a GET request
   * @param url - The endpoint URL
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  static get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.apiCall<T>({
      method: 'GET',
      url,
      ...config,
    });
  }

  /**
   * Performs a POST request
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  static post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.apiCall<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  /**
   * Performs a PUT request
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  static put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.apiCall<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  /**
   * Performs a DELETE request
   * @param url - The endpoint URL
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  static delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.apiCall<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }

  /**
   * Performs a PATCH request
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional Axios request configuration
   * @returns Promise with the response data
   */
  static patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.apiCall<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }
}

export default Request;
