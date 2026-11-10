import { Stack } from 'expo-router';
import Head from 'expo-router/head';

export default function AppLayout() {
  // Uncomment when you implement Supabase authentication:
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0B1220" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </Head>
      <Stack />
    </>
  );
}