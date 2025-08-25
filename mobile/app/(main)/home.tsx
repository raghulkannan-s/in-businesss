import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useAuthStore, useDataStore } from '@/store/store';
import { router } from 'expo-router';
import { checkEligibility } from '@/services/api';

export default function SportsHallScreen() {
  const { user } = useAuthStore();
  const { products, matches, scores, fetchProducts, fetchMatches, fetchScores } = useDataStore();
  const [refreshing, setRefreshing] = useState(false);
  const [eligibilityScore, setEligibilityScore] = useState<number>(0);

  useEffect(() => {
    loadData();
    checkUserEligibility();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchProducts(),
      fetchMatches(),
      fetchScores(),
    ]);
  };

  const checkUserEligibility = async () => {
    try {
      const result = await checkEligibility();
      setEligibilityScore(result.score);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await checkUserEligibility();
    setRefreshing(false);
  };

  const getEligibilityStatus = (score: number) => {
    if (score > 0) return { text: 'Good', color: '#10b981' };
    if (score === 0) return { text: 'Okay', color: '#f59e0b' };
    return { text: 'Bad', color: '#ef4444' };
  };

  const eligibilityStatus = getEligibilityStatus(eligibilityScore);
  const liveMatches = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const recentProducts = products.slice(0, 3);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Sports Hall, {user?.name || 'Player'}!</Text>
        <Text style={styles.subtitle}>Ready for some cricket?</Text>
      </View>

      {/* Eligibility Card */}
      <TouchableOpacity 
        style={styles.eligibilityCard}
        onPress={() => router.push('/eligibility')}
      >
        <View style={styles.eligibilityHeader}>
          <Text style={styles.eligibilityTitle}>Your Eligibility</Text>
          <Text style={[styles.eligibilityStatus, { color: eligibilityStatus.color }]}>
            {eligibilityStatus.text}
          </Text>
        </View>
        <Text style={[styles.eligibilityScore, { color: eligibilityStatus.color }]}>
          {eligibilityScore}
        </Text>
        <Text style={styles.eligibilitySubtext}>Tap to view details</Text>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{matches.length}</Text>
          <Text style={styles.statLabel}>Total Matches</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{liveMatches.length}</Text>
          <Text style={styles.statLabel}>Live Matches</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{products.length}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.cricketAction]}
            onPress={() => router.push('/(main)/players')}
          >
            <Text style={styles.actionIcon}>🏏</Text>
            <Text style={styles.actionTitle}>Cricket</Text>
            <Text style={styles.actionSubtitle}>Manage matches</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, styles.newMatchAction]}
            onPress={() => router.push('/(main)/player-selection')}
          >
            <Text style={styles.actionIcon}>⚡</Text>
            <Text style={styles.actionTitle}>New Match</Text>
            <Text style={styles.actionSubtitle}>Start now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.scoreboardAction]}
            onPress={() => router.push('/(main)/scoreboard')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Scoreboard</Text>
            <Text style={styles.actionSubtitle}>View results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCard, styles.profileAction]}
            onPress={() => router.push('/(main)/profile')}
          >
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionTitle}>Profile</Text>
            <Text style={styles.actionSubtitle}>Your account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔴 Live Matches</Text>
          {liveMatches.map((match) => (
            <TouchableOpacity 
              key={match.id}
              style={styles.matchCard}
              onPress={() => router.push(`/(main)/live-match?matchId=${match.id}`)}
            >
              <View style={styles.matchHeader}>
                <Text style={styles.matchTitle}>{match.team1Name} vs {match.team2Name}</Text>
                <View style={styles.liveIndicator}>
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              <View style={styles.matchScores}>
                <Text style={styles.scoreText}>
                  {match.team1Name}: {match.team1Score}/{match.team1Wickets}
                </Text>
                <Text style={styles.scoreText}>
                  {match.team2Name}: {match.team2Score}/{match.team2Wickets}
                </Text>
              </View>
              <Text style={styles.overText}>Over: {match.currentOver}.{match.currentBall}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recent Matches */}
      {completedMatches.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Recent Results</Text>
          {completedMatches.slice(0, 3).map((match) => (
            <TouchableOpacity 
              key={match.id} 
              style={styles.recentMatchCard}
              onPress={() => router.push('/(main)/scoreboard')}
            >
              <View style={styles.recentMatchInfo}>
                <Text style={styles.recentMatchTitle}>{match.team1Name} vs {match.team2Name}</Text>
                <Text style={styles.recentMatchDate}>
                  {new Date(match.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.recentMatchScore}>
                <Text style={styles.recentScoreText}>
                  {match.team1Score}/{match.team1Wickets} - {match.team2Score}/{match.team2Wickets}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(main)/scoreboard')}
          >
            <Text style={styles.viewAllText}>View All Results</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cricket Management Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏏 Cricket Features</Text>
        <View style={styles.featuresGrid}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/(main)/player-selection')}
          >
            <Text style={styles.featureTitle}>B1. Player Selection</Text>
            <Text style={styles.featureDesc}>Order 30 players</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/(main)/match-setup')}
          >
            <Text style={styles.featureTitle}>B2. Match Setup</Text>
            <Text style={styles.featureDesc}>Teams & Toss</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/(main)/scoreboard')}
          >
            <Text style={styles.featureTitle}>A1. Scoreboard</Text>
            <Text style={styles.featureDesc}>Overall results</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => router.push('/(main)/scoreboard')}
          >
            <Text style={styles.featureTitle}>A2. Rankings</Text>
            <Text style={styles.featureDesc}>Division wise</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛍️ Recent Products</Text>
          {recentProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>₹{product.price}</Text>
              </View>
              <Text style={styles.productStock}>Stock: {product.stock}</Text>
            </View>
          ))}
        </View>
      )}

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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  eligibilityCard: {
    margin: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eligibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eligibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  eligibilityStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  eligibilityScore: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  eligibilitySubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  cricketAction: {
    backgroundColor: '#dbeafe',
  },
  newMatchAction: {
    backgroundColor: '#dcfce7',
  },
  scoreboardAction: {
    backgroundColor: '#fef3c7',
  },
  profileAction: {
    backgroundColor: '#e5e7eb',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  matchCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchTitle: {
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
  matchScores: {
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  overText: {
    fontSize: 12,
    color: '#6b7280',
  },
  recentMatchCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentMatchInfo: {
    flex: 1,
  },
  recentMatchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  recentMatchDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  recentMatchScore: {
    alignItems: 'flex-end',
  },
  recentScoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  viewAllButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  productStock: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    height: 100,
  },
});
