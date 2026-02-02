import { useConnection } from '@/modules/connection';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

export default function SplashView() {

  const { isConnected } = useConnection();

  useEffect(() => {
    setTimeout(() => {
      if (isConnected) {
        router.push('/(home)/dashboard');
      } else {
        router.push('/connection');
      }

    }, 1000); // Simulate loading time
  }, [])

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Splash</Text>
    </View>
  );
}
