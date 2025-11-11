import { useModalStore } from '@/stores/useModalStore';

export const useModal = () => {
  // Use stable selectors - select each value separately
  const isLoginModalOpen = useModalStore((s) => s.isLoginModalOpen);
  const isSignupModalOpen = useModalStore((s) => s.isSignupModalOpen);
  const openLoginModal = useModalStore((s) => s.openLoginModal);
  const closeLoginModal = useModalStore((s) => s.closeLoginModal);
  const openSignupModal = useModalStore((s) => s.openSignupModal);
  const closeSignupModal = useModalStore((s) => s.closeSignupModal);

  return {
    isLoginModalOpen,
    isSignupModalOpen,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
  };
};
