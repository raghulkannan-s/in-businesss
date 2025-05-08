import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EligibilityScreen from '../screens/EligibilityScreen';
import SportsHallScreen from '../screens/SportsHallScreen';
import OldMatchesScreen from '../screens/OldMatchesScreen';
import NewMatchScreen from '../screens/NewMatchScreen';
import MatchTossScreen from '../screens/MatchTossScreen';
import MatchLiveScreen from '../screens/MatchLiveScreen';
// import ScoreboardScreen from '../screens/ScoreboardScreen';
// import AdminPanelScreen from '../screens/AdminPanelScreen';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../config';

// Create stacks for each tab
const HomeStack = createNativeStackNavigator();
const MatchesStack = createNativeStackNavigator();
const EligibilityStack = createNativeStackNavigator();
const SportsHallStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Home Stack
const HomeStackScreen = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
    {/* <HomeStack.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: 'Admin Panel' }} /> */}
  </HomeStack.Navigator>
);

// Matches Stack
const MatchesStackScreen = () => (
  <MatchesStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <MatchesStack.Screen name="OldMatches" component={OldMatchesScreen} options={{ title: 'Match History' }} />
    <MatchesStack.Screen name="NewMatch" component={NewMatchScreen} options={{ title: 'Create Match' }} />
    <MatchesStack.Screen name="MatchToss" component={MatchTossScreen} options={{ title: 'Match Toss' }} />
    <MatchesStack.Screen name="MatchLive" component={MatchLiveScreen} options={{ title: 'Live Scoring' }} />
    {/* <MatchesStack.Screen name="Scoreboard" component={ScoreboardScreen} options={{ title: 'Scoreboard' }} /> */}
  </MatchesStack.Navigator>
);

// Eligibility Stack
const EligibilityStackScreen = () => (
  <EligibilityStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <EligibilityStack.Screen name="EligibilityCheck" component={EligibilityScreen} options={{ title: 'Eligibility' }} />
  </EligibilityStack.Navigator>
);

// Sports Hall Stack
const SportsHallStackScreen = () => (
  <SportsHallStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <SportsHallStack.Screen name="SportsHall" component={SportsHallScreen} options={{ title: 'Sports Hall' }} />
  </SportsHallStack.Navigator>
);

// Profile Stack
const ProfileStackScreen = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
  </ProfileStack.Navigator>
);

// Tab Navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cricket" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Eligibility"
        component={EligibilityStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SportsHall"
        component={SportsHallStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="store" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;