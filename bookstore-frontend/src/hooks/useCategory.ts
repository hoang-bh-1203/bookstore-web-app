import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type { Category, PageableParams } from '@/constants/interfaces';
import { useCallback } from 'react';

export const useCategory = () => {
  const getAllCategories = useCallback(async () => {
    return await Request.get<Category[]>(API_ENDPOINTS.CATEGORIES);
  }, []);

  const searchCategories = useCallback(async (params: PageableParams) => {
    return await Request.get<Category[]>(API_ENDPOINTS.SEARCH_CATEGORIES, {
      params: { ...params },
    });
  }, []);

  const createCategory = useCallback(
    async (categoryData: Partial<Category>) => {
      const response = await Request.post<Category>(
        API_ENDPOINTS.CATEGORIES,
        categoryData,
      );
      return response;
    },
    [],
  );

  const updateCategory = useCallback(
    async (id: number, categoryData: Partial<Category>) => {
      const response = await Request.put<Category>(
        API_ENDPOINTS.CATEGORY_BY_ID(id),
        categoryData,
      );
      return response;
    },
    [],
  );

  const deleteCategory = useCallback(async (id: number) => {
    const response = await Request.delete<Category>(
      API_ENDPOINTS.CATEGORY_BY_ID(id),
    );
    return response;
  }, []);

  const getCategoryWithThumbnail = useCallback(async () => {
    return await Request.get<Category[]>(
      API_ENDPOINTS.GET_CATEGORY_WITH_THUMBNAIL,
    );
  }, []);

  const getAllCategoriesWithSub = useCallback(async () => {
    return await Request.get<Category[]>(API_ENDPOINTS.CATEGORIES_WITH_SUB);
  }, []);

  return {
    getAllCategories,
    searchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryWithThumbnail,
    getAllCategoriesWithSub,
  };
};
