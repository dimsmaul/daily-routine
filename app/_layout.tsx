import 'react-native-url-polyfill/auto'
import '../src/global.css';

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/providers/theme-provider';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useConnectionGuard } from '@/modules/connection';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useThemeColors()

  useConnectionGuard();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
          key={colorScheme}
        />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}