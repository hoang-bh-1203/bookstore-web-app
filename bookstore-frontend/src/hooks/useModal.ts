import { useContext } from 'react';
import { ModalContext } from '@/providers/ModalContext';
import type { ModalContextType } from '@/providers/ModalContext';

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
