import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const [userRole, setUserRole] = useState<string>('USER');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'USER');
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    } finally {
      setLoading(false);
    }
  };

  // Management roles can access all features
  const isManagement = ['ADMIN', 'OWNER', 'MANAGER'].includes(userRole);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}>
      
      {/* Live Matches - Available to all users (Sports Hall Access) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Live Matches',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'play-circle' : 'play-circle-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Leaderboard - Available to all users */}
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Rankings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'podium' : 'podium-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* Management Only Tabs */}
      {isManagement && (
        <>
          <Tabs.Screen
            name="player-selection"
            options={{
              title: 'Players',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="match-setup"
            options={{
              title: 'Setup',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="live-match"
            options={{
              title: 'Live Scoring',
              tabBarIcon: ({ color, focused }) => (
                <Ionicons name={focused ? 'radio' : 'radio-outline'} size={24} color={color} />
              ),
            }}
          />
        </>
      )}

      {/* Admin Only Tabs */}
      {(userRole === 'ADMIN' || userRole === 'OWNER') && (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'shield' : 'shield-outline'} size={24} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
