import React, { useState } from "react";
import type { ReactNode } from "react";
import { LoadingContext } from "./LoadingContext";
import type { LoadingContextType } from "./LoadingContext";

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showLoading = (msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage(undefined);
  };

  const value: LoadingContextType = {
    message,
    isLoading,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
