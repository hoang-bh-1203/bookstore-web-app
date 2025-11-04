import { createContext } from "react";

export interface ModalContextType {
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
); 