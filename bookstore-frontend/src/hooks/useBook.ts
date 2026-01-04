import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type {
  Book,
  PageableParams,
  PagedResponse,
} from '@/constants/interfaces';
import { useRef, useCallback } from 'react';

/**
 * Global cache to persist book data across component re-renders
 * Stored outside hook to maintain state between hook instances
 */
const globalBookCache = new Map<number, Book>();

/**
 * Custom hook for book management operations
 * Provides methods for CRUD operations with built-in caching
 */
export const useBook = () => {
  const bookCache = useRef<Map<number, Book>>(globalBookCache);

  const getAllBooks = useCallback(async (params?: PageableParams) => {
    const response = await Request.get<PagedResponse<Book>>(
      API_ENDPOINTS.BOOKS,
      { params },
    );
    return response;
  }, []);

  // const getTopSellingBooks = useCallback(async () => {
  //   const response = await Request.get<Book[]>(API_ENDPOINTS.BOOKS, {
  //     params: {
  //       _limit: 10,
  //       _sort: 'quantitySold',
  //       _order: 'desc',
  //     },
  //   });
  //   return response
  //     .filter((book) => book.quantitySold !== undefined)
  //     .slice(0, 10);
  // }, []);

  const getBookById = useCallback(async (id: number) => {
    // Return cached book if available
    if (bookCache.current.has(id)) {
      return bookCache.current.get(id)!;
    }

    // Fetch from API if not cached
    const book = await Request.get<Book>(API_ENDPOINTS.BOOK_BY_ID(id));

    // Store in cache for future use
    bookCache.current.set(id, book);

    return book;
  }, []);

  const createBook = useCallback(async (bookData: Partial<Book>) => {
    const book = await Request.post<Book>(API_ENDPOINTS.BOOKS, bookData);
    // Clear entire cache since book list has changed
    bookCache.current.clear();
    return book;
  }, []);

  const updateBook = useCallback(
    async (id: number, bookData: Partial<Book>) => {
      const book = await Request.put<Book>(
        API_ENDPOINTS.BOOK_BY_ID(id),
        bookData,
      );
      // Update cached book with new data
      bookCache.current.set(id, book);
      return book;
    },
    [],
  );

  const deleteBook = useCallback(async (id: number) => {
    await Request.delete(API_ENDPOINTS.BOOK_BY_ID(id));
    // Remove deleted book from cache
    bookCache.current.delete(id);
  }, []);

  const getBookFeaturedCollections = useCallback(
    () => Request.get<any>(API_ENDPOINTS.GET_BOOK_FEATURED_COLLECTIONS),
    [],
  );

  /**
   * Manually clears the entire book cache
   * Useful for forcing data refresh
   */
  const clearCache = useCallback(() => {
    bookCache.current.clear();
  }, []);

  return {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    // getTopSellingBooks,
    getBookFeaturedCollections,
    clearCache,
  };
};
