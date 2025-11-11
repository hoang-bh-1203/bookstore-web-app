import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type { Book } from '@/constants/interfaces';

export async function bookLoader(): Promise<Book[]> {
  try {
    const response = await Request.get<Book[]>(API_ENDPOINTS.BOOKS, {
      params: {
        _limit: 500,
        _sort: 'id',
        _order: 'desc',
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to load books:', error);
    return [];
  }
}
