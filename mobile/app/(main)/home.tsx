import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuthStore, useDataStore } from '@/store/store';
import { router } from 'expo-router';

export default function SportsHallScreen() {
  const { user } = useAuthStore();
  const { 
    products, 
    scores, 
    isLoadingData, 
    fetchProducts, 
    fetchScores 
  } = useDataStore();

  useEffect(() => {
    fetchProducts();
    fetchScores();
  }, []);

  const onRefresh = () => {
    fetchProducts();
    fetchScores();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { 
      title: 'New Match', 
      subtitle: 'Start a new cricket match',
      icon: '🏏',
      color: '#10b981',
      onPress: () => router.push('/(main)/match-setup')
    },
    { 
      title: 'Live Matches', 
      subtitle: 'View ongoing matches',
      icon: '📺',
      color: '#ef4444',
      onPress: () => router.push('/(main)/matches')
    },
    { 
      title: 'Scoreboard', 
      subtitle: 'View match results',
      icon: '📊',
      color: '#f59e0b',
      onPress: () => router.push('/(main)/scoreboard')
    },
    { 
      title: 'Teams', 
      subtitle: 'Manage cricket teams',
      icon: '👥',
      color: '#3b82f6',
      onPress: () => router.push('/(main)/players')
    }
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoadingData} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.eligibilityButton}
          onPress={() => router.push('/eligibility')}
        >
          <Text style={styles.eligibilityText}>Score: {user?.inScore || 0}</Text>
        </TouchableOpacity>
      </View>

      {/* Sports Hall Title */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>🏟️ Sports Hall</Text>
        <Text style={styles.mainSubtitle}>Cricket Management System</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={action.onPress}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{scores.length}</Text>
            <Text style={styles.statLabel}>Scores</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: user?.eligibility ? '#10b981' : '#ef4444' }]}>
              {user?.eligibility ? 'YES' : 'NO'}
            </Text>
            <Text style={styles.statLabel}>Eligible</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {scores.length > 0 ? (
          scores.slice(0, 3).map((score) => (
            <View key={score.id} style={styles.activityCard}>
              <Text style={styles.activityIcon}>📊</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Match Score Recorded</Text>
                <Text style={styles.activitySubtitle}>
                  Score: {score.score} • {new Date(score.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No recent activity</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  eligibilityButton: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  eligibilityText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
  titleSection: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
