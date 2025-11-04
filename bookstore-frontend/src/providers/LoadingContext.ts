import { createContext } from "react";

export interface LoadingContextType {
  isLoading: boolean;
  message?: string;
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);
