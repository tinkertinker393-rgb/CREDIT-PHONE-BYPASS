import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-[#1a237e] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-500/20 border-2 border-red-500 p-8 rounded-xl max-w-md w-full shadow-2xl">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-black uppercase mb-4 tracking-tighter">System Failure</h1>
            <p className="text-gray-300 mb-8 font-mono text-sm">
              {error?.message || 'An unexpected kernel error has occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-500 py-4 rounded font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              Reboot System
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
