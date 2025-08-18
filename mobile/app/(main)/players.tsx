import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useDataStore } from '@/store/store';
import { getAllUsers } from '@/services/api';
import { User } from '@/types/api';
import { router } from 'expo-router';

export default function CricketScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { teams, fetchTeams } = useDataStore();

  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    fetchUsers();
    fetchTeams();
  };

  const cricketSections = [
    {
      title: 'Old Matches',
      icon: '📋',
      color: '#6b7280',
      items: [
        { 
          name: 'Overall Scoreboard', 
          subtitle: 'View all match results',
          action: () => router.push('/(main)/scoreboard')
        },
        { 
          name: 'Rankings by Division', 
          subtitle: 'Team rankings and statistics',
          action: () => router.push('/(main)/rankings')
        }
      ]
    },
    {
      title: 'New Match',
      icon: '🏏',
      color: '#10b981',
      items: [
        { 
          name: 'Order 30 Players', 
          subtitle: 'Select players for match',
          action: () => router.push('/(main)/player-selection')
        },
        { 
          name: 'Team Setup', 
          subtitle: 'Configure teams and settings',
          action: () => router.push('/(main)/match-setup')
        }
      ]
    }
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏏 Cricket</Text>
        <Text style={styles.subtitle}>Match Management & Scoring</Text>
      </View>

      {/* Cricket Sections */}
      {cricketSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{section.icon}</Text>
            <Text style={[styles.sectionTitle, { color: section.color }]}>
              {section.title}
            </Text>
          </View>
          
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={[styles.actionCard, { borderLeftColor: section.color }]}
              onPress={item.action}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{item.name}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Quick Match Setup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={[styles.quickAction, { backgroundColor: '#dbeafe' }]}
          onPress={() => router.push('/(main)/match-setup')}
        >
          <Text style={styles.quickActionIcon}>⚡</Text>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Start New Match</Text>
            <Text style={styles.quickActionSubtitle}>Quick match setup with default settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.quickAction, { backgroundColor: '#d1fae5' }]}
          onPress={() => router.push('/(main)/live-match')}
        >
          <Text style={styles.quickActionIcon}>📺</Text>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Live Scoring</Text>
            <Text style={styles.quickActionSubtitle}>Score ongoing matches in real-time</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cricket Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Players</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{teams.length}</Text>
            <Text style={styles.statLabel}>Teams</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Live Matches</Text>
          </View>
        </View>
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
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  actionArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  quickAction: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  quickActionSubtitle: {
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
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});
