import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useConnection } from '@/modules/connection/store/connection';

export function useConnectionGuard() {
  const { isConnected, initializeConnection } = useConnection();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Initialize connection from storage
    initializeConnection();
  }, []);

  useEffect(() => {
    // Wait for navigation to be ready
    if (!router) return;

    const inAuthGroup = segments[0] === '';
    const inHomeGroup = segments[0] === '(home)';

    if (isConnected && inAuthGroup) {
      // User sudah connect, tapi masih di auth screen -> redirect ke home
      router.replace('/(home)/dashboard');
    } else if (!isConnected && inHomeGroup) {
      // User belum connect, tapi udah di home -> redirect ke connection
      router.replace('/connection');
    }
  }, [isConnected, segments]);
}
