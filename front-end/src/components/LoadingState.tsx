import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <div className="relative inline-flex">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-brand-primary animate-spin"></div>
          <div className="w-12 h-12 rounded-full border-r-2 border-l-2 border-brand-secondary animate-spin absolute inset-0" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
        </div>
        <p className="mt-4 text-surface-600 dark:text-surface-300 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingState; 