import Request from '@/configs/api';
import { API_ENDPOINTS } from '@/constants/endpoint';
import type { ImageUploadResponse } from '@/constants/interfaces';
import { useCallback } from 'react';

const useUpload = () => {
  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return Request.post<ImageUploadResponse>(
      API_ENDPOINTS.UPLOAD_IMAGE,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
  }, []);

  const deleteImage = useCallback(async (fileId: string) => {
    return Request.delete(API_ENDPOINTS.DELETE_IMAGE(fileId));
  }, []);

  return {
    uploadImage,
    deleteImage,
  };
};

export default useUpload;
