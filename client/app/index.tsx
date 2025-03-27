import { useEffect } from 'react';
import { Redirect, router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function RootIndex() {
  const { token, isLoading } = useAuth();
  

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [isLoading, token]);


  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // This is a fallback, the useEffect should handle navigation
  return <Redirect href="/auth/login" />;
}