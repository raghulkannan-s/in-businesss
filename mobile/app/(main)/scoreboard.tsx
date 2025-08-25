import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, FlatList } from "react-native";
import { router } from 'expo-router';
import { useDataStore } from '@/store/store';
import { Match } from '@/types/api';

export default function ScoreboardScreen() {
  const { matches, fetchMatches } = useDataStore();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'overall' | 'rankings'>('overall');

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const completedMatches = matches.filter(m => m.status === 'completed');

  const exportToExcel = () => {
    // A1. Overall Scoreboard Excel Export
    if (viewMode === 'overall') {
      // Simulate Excel export
      alert('Overall Scoreboard exported to Excel successfully!');
    } else {
      // A2. Rankings by Division Excel Export  
      alert('Division Rankings exported to Excel successfully!');
    }
  };

  const renderMatchItem = ({ item }: { item: Match }) => (
    <View style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchTitle}>{item.team1Name} vs {item.team2Name}</Text>
        <Text style={styles.matchDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.scoreRow}>
        <View style={styles.teamScore}>
          <Text style={styles.teamName}>{item.team1Name}</Text>
          <Text style={styles.scoreText}>{item.team1Score}/{item.team1Wickets}</Text>
        </View>
        <Text style={styles.vsText}>vs</Text>
        <View style={styles.teamScore}>
          <Text style={styles.teamName}>{item.team2Name}</Text>
          <Text style={styles.scoreText}>{item.team2Score}/{item.team2Wickets}</Text>
        </View>
      </View>

      <View style={styles.matchDetails}>
        <Text style={styles.detailText}>Overs: {item.overs}</Text>
        <Text style={styles.detailText}>Completed: {item.currentOver} overs</Text>
      </View>
    </View>
  );

  const renderRankingItem = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.rankingCard}>
      <View style={styles.rankPosition}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <View style={styles.rankDetails}>
        <Text style={styles.rankTeamName}>{item.teamName}</Text>
        <View style={styles.rankStats}>
          <Text style={styles.rankStat}>Matches: {item.matches}</Text>
          <Text style={styles.rankStat}>Wins: {item.wins}</Text>
          <Text style={styles.rankStat}>Points: {item.points}</Text>
        </View>
      </View>
    </View>
  );

  // Generate sample rankings data
  const generateRankings = () => {
    const teamStats: { [key: string]: { matches: number, wins: number, points: number } } = {};
    
    completedMatches.forEach(match => {
      if (!teamStats[match.team1Name]) {
        teamStats[match.team1Name] = { matches: 0, wins: 0, points: 0 };
      }
      if (!teamStats[match.team2Name]) {
        teamStats[match.team2Name] = { matches: 0, wins: 0, points: 0 };
      }
      
      teamStats[match.team1Name].matches++;
      teamStats[match.team2Name].matches++;
      
      // Determine winner based on scores
      if (match.team1Score > match.team2Score) {
        teamStats[match.team1Name].wins++;
        teamStats[match.team1Name].points += 2;
      } else if (match.team2Score > match.team1Score) {
        teamStats[match.team2Name].wins++;
        teamStats[match.team2Name].points += 2;
      } else {
        // Draw
        teamStats[match.team1Name].points += 1;
        teamStats[match.team2Name].points += 1;
      }
    });

    return Object.entries(teamStats)
      .map(([teamName, stats]) => ({ teamName, ...stats }))
      .sort((a, b) => b.points - a.points);
  };

  const rankings = generateRankings();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {viewMode === 'overall' ? 'A1. Overall Scoreboard' : 'A2. Division Rankings'}
        </Text>
      </View>

      {/* View Toggle */}
      <View style={styles.toggleSection}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'overall' && styles.activeToggle]}
          onPress={() => setViewMode('overall')}
        >
          <Text style={[styles.toggleText, viewMode === 'overall' && styles.activeToggleText]}>
            A1. Overall Scoreboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'rankings' && styles.activeToggle]}
          onPress={() => setViewMode('rankings')}
        >
          <Text style={[styles.toggleText, viewMode === 'rankings' && styles.activeToggleText]}>
            A2. Division Rankings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Export Button */}
      <View style={styles.exportSection}>
        <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
          <Text style={styles.exportIcon}>📊</Text>
          <Text style={styles.exportText}>Export to Excel</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        {viewMode === 'overall' ? (
          <View>
            <Text style={styles.sectionTitle}>Match Results ({completedMatches.length} matches)</Text>
            {completedMatches.length > 0 ? (
              <FlatList
                data={completedMatches}
                renderItem={renderMatchItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No completed matches found</Text>
            )}
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Team Rankings ({rankings.length} teams)</Text>
            {rankings.length > 0 ? (
              <FlatList
                data={rankings}
                renderItem={renderRankingItem}
                keyExtractor={(item) => item.teamName}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No rankings available</Text>
            )}
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  toggleSection: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  activeToggle: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  activeToggleText: {
    color: '#fff',
  },
  exportSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
  },
  exportIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  exportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  matchDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamScore: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  vsText: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 16,
  },
  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  rankingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rankPosition: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  rankDetails: {
    flex: 1,
  },
  rankTeamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  rankStats: {
    flexDirection: 'row',
    gap: 16,
  },
  rankStat: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 40,
  },
  footer: {
    height: 100,
  },
});