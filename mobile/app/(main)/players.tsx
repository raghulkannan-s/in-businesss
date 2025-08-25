import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useDataStore } from '@/store/store';
import { router } from 'expo-router';

export default function CricketScreen() {
  const { matches, fetchMatches } = useDataStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const completedMatches = matches.filter(m => m.status === 'completed');
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏏 Cricket Management</Text>
        <Text style={styles.subtitle}>Manage matches and view scoreboards</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.newMatchButton}
          onPress={() => router.push('/(main)/player-selection')}
        >
          <Text style={styles.newMatchIcon}>⚡</Text>
          <Text style={styles.newMatchText}>Start New Match</Text>
        </TouchableOpacity>
      </View>

      {/* A. Old Matches Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>A. Old Matches</Text>
        
        <TouchableOpacity 
          style={styles.subsectionCard}
          onPress={() => router.push('/(main)/scoreboard')}
        >
          <View style={styles.subsectionContent}>
            <Text style={styles.subsectionTitle}>A1. Overall Scoreboard</Text>
            <Text style={styles.subsectionSubtitle}>Export to Excel - All match results</Text>
          </View>
          <Text style={styles.subsectionArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.subsectionCard}
          onPress={() => router.push('/(main)/scoreboard')}
        >
          <View style={styles.subsectionContent}>
            <Text style={styles.subsectionTitle}>A2. Division Rankings</Text>
            <Text style={styles.subsectionSubtitle}>Team rankings and statistics (Excel)</Text>
          </View>
          <Text style={styles.subsectionArrow}>→</Text>
        </TouchableOpacity>

        {/* Recent Completed Matches */}
        {completedMatches.length > 0 && (
          <View style={styles.matchesList}>
            <Text style={styles.matchesTitle}>Recent Completed Matches</Text>
            {completedMatches.slice(0, 3).map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <View style={styles.matchInfo}>
                  <Text style={styles.matchTeams}>{match.team1Name} vs {match.team2Name}</Text>
                  <Text style={styles.matchDate}>
                    {new Date(match.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.matchScore}>
                  <Text style={styles.scoreText}>
                    {match.team1Score}/{match.team1Wickets} - {match.team2Score}/{match.team2Wickets}
                  </Text>
                  <Text style={styles.matchOvers}>{match.overs} overs</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(main)/scoreboard')}
            >
              <Text style={styles.viewAllText}>View All Matches</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔴 Live Matches</Text>
          {liveMatches.map((match) => (
            <TouchableOpacity 
              key={match.id}
              style={styles.liveMatchCard}
              onPress={() => router.push(`/(main)/live-match?matchId=${match.id}`)}
            >
              <View style={styles.liveHeader}>
                <Text style={styles.liveTitle}>{match.team1Name} vs {match.team2Name}</Text>
                <View style={styles.liveIndicator}>
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <View style={styles.liveScores}>
                <Text style={styles.liveScore}>
                  {match.team1Name}: {match.team1Score}/{match.team1Wickets}
                </Text>
                <Text style={styles.liveScore}>
                  {match.team2Name}: {match.team2Score}/{match.team2Wickets}
                </Text>
              </View>
              <Text style={styles.liveOver}>Over: {match.currentOver}.{match.currentBall}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* B. New Match Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>B. New Match</Text>
        
        <TouchableOpacity 
          style={styles.subsectionCard}
          onPress={() => router.push('/(main)/player-selection')}
        >
          <View style={styles.subsectionContent}>
            <Text style={styles.subsectionTitle}>B1. Order 30 Players</Text>
            <Text style={styles.subsectionSubtitle}>Set up teams and player order</Text>
          </View>
          <Text style={styles.subsectionArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.newMatchFeatures}>
          <Text style={styles.featureTitle}>Complete Match Setup Process:</Text>
          <Text style={styles.featureItem}>• B1. Select 30 players from eligible users</Text>
          <Text style={styles.featureItem}>• B2. Team names configuration (Team 1, Team 2)</Text>
          <Text style={styles.featureItem}>• Toss settings (Winner: 1 or 2, Decision: Bat/Bowl)</Text>
          <Text style={styles.featureItem}>• Overs configuration (default: 20)</Text>
          <Text style={styles.featureItem}>• B3. Auto & manual setup (Striker, Non-striker, Opening bowler)</Text>
          <Text style={styles.featureItem}>• B4. Live scoring with screenshots (0,1,2,3,4,6 runs)</Text>
          <Text style={styles.featureItem}>• B4A. 4 wicket options (Bowled, Caught, LBW, Run Out)</Text>
          <Text style={styles.featureItem}>• Extras tracking (Wide, No Ball, Bye, Leg Bye)</Text>
          <Text style={styles.featureItem}>• B5. Real-time scoreboard with save functionality</Text>
        </View>
      </View>

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Upcoming Matches</Text>
          {upcomingMatches.map((match) => (
            <TouchableOpacity 
              key={match.id}
              style={styles.upcomingMatchCard}
              onPress={() => router.push(`/(main)/live-match?matchId=${match.id}`)}
            >
              <Text style={styles.upcomingTitle}>{match.team1Name} vs {match.team2Name}</Text>
              <Text style={styles.upcomingOvers}>{match.overs} overs</Text>
              <Text style={styles.upcomingDate}>
                {new Date(match.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Quick Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{matches.length}</Text>
            <Text style={styles.statLabel}>Total Matches</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{liveMatches.length}</Text>
            <Text style={styles.statLabel}>Live Now</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedMatches.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingMatches.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer} />
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
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
  newMatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
  },
  newMatchIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  newMatchText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  subsectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  subsectionContent: {
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subsectionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  subsectionArrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
  matchesList: {
    marginTop: 16,
  },
  matchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  matchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  matchInfo: {
    flex: 1,
  },
  matchTeams: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  matchDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  matchScore: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  matchOvers: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewAllButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  liveMatchCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  liveIndicator: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  liveScores: {
    marginBottom: 4,
  },
  liveScore: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  liveOver: {
    fontSize: 12,
    color: '#6b7280',
  },
  newMatchFeatures: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  upcomingMatchCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  upcomingOvers: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 2,
  },
  upcomingDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    height: 100,
  },
});
