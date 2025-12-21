import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Đang tải',
}) => {
  if (!isVisible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="p-6 flex flex-col items-center space-y-4 max-w-xs w-full mx-4 rounded-lg">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <p className="text-white text-center font-medium text-lg">
          {message}...
        </p>
      </div>
    </div>,
    document.body,
  );
};

export default LoadingOverlay;
