import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type {
  PageableParams,
  PagedResponse,
  User,
} from '@/constants/interfaces';
import { useCallback } from 'react';

export const useUser = () => {
  const getAllUsers = useCallback(async (params: PageableParams) => {
    const response = await Request.get<PagedResponse<User>>(
      API_ENDPOINTS.USERS,
      { params },
    );
    return response;
  }, []);

  const getUserById = useCallback(async (id: number) => {
    const response = await Request.get<User>(API_ENDPOINTS.USER_BY_ID(id));
    return response;
  }, []);

  const createUser = useCallback(async (userData: Partial<User>) => {
    const response = await Request.post<User>(API_ENDPOINTS.USERS, userData);
    return response;
  }, []);

  const updateUser = useCallback(
    async (id: number, userData: Partial<User>) => {
      const response = await Request.put<User>(
        API_ENDPOINTS.USER_BY_ID(id),
        userData,
      );
      return response;
    },
    [],
  );

  const deleteUser = useCallback(async (id: number) => {
    await Request.delete(API_ENDPOINTS.USER_BY_ID(id));
  }, []);

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
