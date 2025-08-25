import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import api from '../../services/api';

interface PlayerRanking {
  player: {
    id: number;
    name: string;
    email: string;
  };
  stats: {
    runs: number;
    fours: number;
    sixes: number;
    balls: number;
    dotBalls: number;
    wicketsTaken: number;
    matches: number;
    strikeRate: number;
    average: number;
    economy: number;
    batsmanEarnings: number;
    bowlerEarnings: number;
    totalEarnings: number;
  };
}

export default function Leaderboard() {
  const [rankings, setRankings] = useState<PlayerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await api.get('/api/users/rankings/leaderboard');
      setRankings(response.data.rankings);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      Alert.alert('Error', 'Failed to fetch player rankings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRankings();
  };

  const renderRanking = ({ item, index }: { item: PlayerRanking; index: number }) => {
    const rank = index + 1;
    const { player, stats } = item;

    const getRankColor = (rank: number) => {
      if (rank === 1) return '#FFD700'; // Gold
      if (rank === 2) return '#C0C0C0'; // Silver
      if (rank === 3) return '#CD7F32'; // Bronze
      return '#666';
    };

    return (
      <View style={styles.rankingItem}>
        <View style={styles.rankHeader}>
          <View style={[styles.rankBadge, { backgroundColor: getRankColor(rank) }]}>
            <Text style={styles.rankText}>{rank}</Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerEmail}>{player.email}</Text>
          </View>
          <View style={styles.earningsContainer}>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
            <Text style={[styles.earnings, stats.totalEarnings >= 0 ? styles.positive : styles.negative]}>
              ₹{stats.totalEarnings}
            </Text>
            <Text style={styles.earningsDetail}>
              Bat: ₹{stats.batsmanEarnings} • Bowl: ₹{stats.bowlerEarnings}
            </Text>
          </View>
        </View>
        
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.runs}</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.matches}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.strikeRate}</Text>
              <Text style={styles.statLabel}>SR</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.average}</Text>
              <Text style={styles.statLabel}>Avg</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.wicketsTaken}</Text>
              <Text style={styles.statLabel}>Wickets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.fours}</Text>
              <Text style={styles.statLabel}>4s</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.sixes}</Text>
              <Text style={styles.statLabel}>6s</Text>
            </View>
          </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Player Leaderboard</Text>
        <Text style={styles.subtitle}>
          Earnings: +₹5/run, -₹5/dot, +₹50/wicket | Bowling: +₹5/dot, -₹5/run
        </Text>
      </View>

      <FlatList
        data={rankings}
        keyExtractor={(item) => item.player.id.toString()}
        renderItem={renderRanking}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.rankingsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  rankingsList: {
    flex: 1,
    padding: 16,
  },
  rankingItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  playerEmail: {
    fontSize: 14,
    color: '#666',
  },
  earningsContainer: {
    alignItems: 'flex-end',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  earnings: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positive: {
    color: '#4caf50',
  },
  negative: {
    color: '#f44336',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  earningsDetail: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
});