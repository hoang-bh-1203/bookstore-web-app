import { useLoadingStore } from '@/stores/useLoadingStore';

export const useLoading = () => {
  // Use stable selectors - select each value separately
  const isLoading = useLoadingStore((s) => s.isLoading);
  const message = useLoadingStore((s) => s.message);
  const showLoading = useLoadingStore((s) => s.showLoading);
  const hideLoading = useLoadingStore((s) => s.hideLoading);

  return { isLoading, message, showLoading, hideLoading };
};
