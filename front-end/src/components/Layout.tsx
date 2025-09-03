import React from 'react';
import Navbar from './Navbar';
import LoadingState from './LoadingState';
import { useAuth } from '@/context/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    //  bg-gradient-to-br from-surface-50 to-surface-100
    <div className="min-h-screen dark:from-surface-900 dark:to-surface-800 transition-colors duration-300">
      <Navbar />
      <main className="container min-h-screen mt-12 mx-auto px-4 py-8 animate-fade-in">
        {children}
      </main>
      {/*  bg-surface-100 border-surface-200 */}
      <footer className="mt-auto py-6 dark:bg-surface-800 border-t dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-surface-500 dark:text-surface-400 text-sm">
          <p>© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};
