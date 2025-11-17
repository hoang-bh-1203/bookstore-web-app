import React, { type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ApiErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches API-related errors
 * and displays a user-friendly error message with retry option
 */
export class ApiErrorBoundary extends React.Component<
  ApiErrorBoundaryProps,
  ApiErrorBoundaryState
> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('API Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Force re-render
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border border-red-200 p-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không thể kết nối đến máy chủ
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Vui lòng kiểm tra kết nối internet hoặc thử lại sau vài phút.
            </p>
            <div className="text-xs text-gray-500 bg-gray-100 rounded p-3 mb-6 max-w-md break-words">
              {this.state.error?.message}
            </div>
            <Button
              onClick={this.handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
