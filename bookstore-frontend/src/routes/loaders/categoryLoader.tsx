import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type { Category } from '@/constants/interfaces';

export async function categoryLoader(): Promise<Category[]> {
  try {
    const response = await Request.get<Category[]>(API_ENDPOINTS.CATEGORIES);
    return response;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}
