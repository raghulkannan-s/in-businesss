import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';

export default function MainLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 25 : 12,
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 90 : 70,
          borderRadius: 25,
          marginHorizontal: 20,
          marginBottom: 10,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 10,
          borderWidth: 1,
          borderColor: '#f1f5f9',
        },
        tabBarActiveTintColor: '#1f2937',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Hall',
          tabBarIcon: ({ focused, color }) => (
            <HomeIcon focused={focused} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="players" 
        options={{ 
          title: 'Cricket',
          tabBarIcon: ({ focused, color }) => (
            <PlayersIcon focused={focused} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <SettingsIcon focused={focused} color={color} />
          ),
        }} 
      />

      {/* Hide other screens from tab bar */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="privacy" options={{ href: null }} />
      <Tabs.Screen name="support" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="matches" options={{ href: null }} />
      <Tabs.Screen name="scoreboard" options={{ href: null }} />
      <Tabs.Screen name="match-setup" options={{ href: null }} />
      <Tabs.Screen name="live-match" options={{ href: null }} />
    </Tabs>
  );
}

// Modern light theme colorful icon components
function HomeIcon({ focused, color }: { focused: boolean; color: string }) {
  return (
    <View style={{
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#dbeafe' : '#f8fafc',
      borderRadius: 18,
      borderWidth: focused ? 2 : 1,
      borderColor: focused ? '#3b82f6' : '#e2e8f0',
      shadowColor: focused ? '#3b82f6' : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: focused ? 0.15 : 0,
      shadowRadius: 6,
      elevation: focused ? 4 : 0,
    }}>
      <Text style={{ 
        fontSize: 16, 
        color: focused ? '#3b82f6' : color,
      }}>
        �️
      </Text>
    </View>
  );
}

function PlayersIcon({ focused, color }: { focused: boolean; color: string }) {
  return (
    <View style={{
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#d1fae5' : '#f8fafc',
      borderRadius: 18,
      borderWidth: focused ? 2 : 1,
      borderColor: focused ? '#10b981' : '#e2e8f0',
      shadowColor: focused ? '#10b981' : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: focused ? 0.15 : 0,
      shadowRadius: 6,
      elevation: focused ? 4 : 0,
    }}>
      <Text style={{ 
        fontSize: 16, 
        color: focused ? '#10b981' : color,
      }}>
        🏏
      </Text>
    </View>
  );
}

function SettingsIcon({ focused, color }: { focused: boolean; color: string }) {
  return (
    <View style={{
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#fef3c7' : '#f8fafc',
      borderRadius: 18,
      borderWidth: focused ? 2 : 1,
      borderColor: focused ? '#f59e0b' : '#e2e8f0',
      shadowColor: focused ? '#f59e0b' : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: focused ? 0.15 : 0,
      shadowRadius: 6,
      elevation: focused ? 4 : 0,
    }}>
      <Text style={{ 
        fontSize: 16, 
        color: focused ? '#f59e0b' : color,
      }}>
        ⚙️
      </Text>
    </View>
  );
}
