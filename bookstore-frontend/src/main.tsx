import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalLoadingWrapper } from '@/components/wrapper/global-loading-wrapper';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router.tsx';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import './index.css';

// Initialize auth check before rendering
useAuthStore.getState().checkAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalLoadingWrapper>
      <RouterProvider router={router} />
      <Toaster />
    </GlobalLoadingWrapper>
  </StrictMode>,
);
