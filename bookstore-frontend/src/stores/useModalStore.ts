// src/stores/modalStore.ts
import { create } from 'zustand';

export interface ModalState {
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: false,
  isSignupModalOpen: false,

  openLoginModal: () =>
    set({
      isLoginModalOpen: true,
      isSignupModalOpen: false, // Logic gốc: mở login thì đóng signup
    }),

  closeLoginModal: () =>
    set({
      isLoginModalOpen: false,
    }),

  openSignupModal: () =>
    set({
      isSignupModalOpen: true,
      isLoginModalOpen: false, // Logic gốc: mở signup thì đóng login
    }),

  closeSignupModal: () =>
    set({
      isSignupModalOpen: false,
    }),
}));
