import { create } from 'zustand';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: undefined,

  showLoading: (msg?: string) =>
    set({
      isLoading: true,
      message: msg,
    }),

  hideLoading: () =>
    set({
      isLoading: false,
      message: undefined,
    }),
}));
