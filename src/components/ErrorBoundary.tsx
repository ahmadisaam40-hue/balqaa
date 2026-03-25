import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[Error Boundary] Caught error:", error);
    console.error("[Error Boundary] Component stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h1 className="text-2xl font-bold text-red-700 mb-2">حدث خطأ</h1>
            <p className="text-red-600 mb-4">
              {this.state.error?.message || "حدث خطأ غير متوقع"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              إعادة تحديث الصفحة
            </button>
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer text-red-600">التفاصيل</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
