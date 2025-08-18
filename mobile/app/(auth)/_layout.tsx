import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/store';
export default function AuthLayout() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [user, router]);

  const tabs = [
    { key: 'login', title: 'Login' },
    { key: 'register', title: 'Register' }
  ];

  const handleTabPress = (tabKey: string) => {
    router.replace(`/(auth)/${tabKey}`);
  };

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />

      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    position: 'absolute',
    bottom: 35,
    left: 24,
    right: 24,
    zIndex: 10,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
});
