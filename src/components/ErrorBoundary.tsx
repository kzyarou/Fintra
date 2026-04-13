import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };
  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream dark:bg-[#1C1C1E] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-900/30">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal dark:text-[#F5F5F7] mb-3 tracking-tight">
            Oops, something went wrong
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 max-w-sm text-lg">
            We encountered an unexpected error. You can try reloading the app or
            returning to the previous state.
          </p>
          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={this.handleRetry}
              className="flex-1 bg-gray-100 dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] font-bold py-4 rounded-2xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors">
              
              Retry
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-[2] bg-emerald text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-card flex items-center justify-center gap-2">
              
              <RefreshCw size={20} />
              Reload App
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error &&
          <div className="mt-12 p-5 bg-white dark:bg-[#2C2C2E] rounded-2xl text-left w-full max-w-2xl overflow-auto border border-gray-100 dark:border-[#3A3A3C] shadow-sm">
              <p className="text-red-500 font-mono text-sm whitespace-pre-wrap">
                {this.state.error.toString()}
              </p>
            </div>
          }
        </div>);

    }
    return this.props.children;
  }
}