import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/store';

// Root layout config for the whole app. Auth related screens are handled in (auth) group.
export default function RootLayout() {
  const { loadTokensFromSecureStore } = useAuthStore();

  useEffect(() => {
    loadTokensFromSecureStore();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="eligibility" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}