// components/wrapper/GlobalLoadingWrapper.tsx

import React from 'react';
import type { ReactNode } from 'react';
import LoadingOverlay from './loading-overlay';
import { useLoading } from '@/hooks/useLoading';

interface GlobalLoadingWrapperProps {
  children: ReactNode;
}

// Component chính wrap cả app với loading store
export const GlobalLoadingWrapper: React.FC<GlobalLoadingWrapperProps> = ({
  children,
}) => {
  const { isLoading, message } = useLoading();

  return (
    <>
      {children}
      <LoadingOverlay isVisible={isLoading} message={message} />
    </>
  );
};
