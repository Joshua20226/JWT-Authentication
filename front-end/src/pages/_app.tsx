import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/';

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
  );
}

export default MyApp; 