import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}
export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error loading this content.',
  onRetry,
  className = ''
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#2C2C2E] rounded-[2rem] border border-dashed border-gray-200 dark:border-[#3A3A3C] ${className}`}>
      
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-charcoal dark:text-[#F5F5F7] mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 max-w-[250px]">
        {message}
      </p>
      {onRetry &&
      <button
        onClick={onRetry}
        className="bg-gray-100 dark:bg-[#3A3A3C] text-charcoal dark:text-[#F5F5F7] font-bold py-2.5 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-[#4A4A4C] transition-colors flex items-center gap-2 text-sm">
        
          <RefreshCw size={16} />
          Try Again
        </button>
      }
    </div>);

}