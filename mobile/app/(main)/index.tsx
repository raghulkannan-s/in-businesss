import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

interface Match {
  id: string;
  title: string;
  status: string;
  teamA: { name: string };
  teamB: { name: string };
  team1Score: number;
  team2Score: number;
  team1Wickets: number;
  team2Wickets: number;
  currentOver: number;
  totalOvers: number;
  createdAt: string;
}

export default function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<string>('USER');
  const router = useRouter();

  useEffect(() => {
    fetchMatches();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'USER');
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      // API will automatically filter based on user role through middleware
      const response = await api.get('/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      Alert.alert('Error', 'Failed to fetch matches');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const navigateToMatch = (matchId: string) => {
    router.push(`/(main)/match-details?id=${matchId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#4caf50';
      case 'completed': return '#f44336';
      case 'scheduled': return '#ff9800';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'LIVE';
      case 'completed': return 'COMPLETED';
      case 'scheduled': return 'SCHEDULED';
      default: return status.toUpperCase();
    }
  };

  const renderMatch = ({ item }: { item: Match }) => {
    const isLive = item.status === 'live';
    
    return (
      <TouchableOpacity 
        style={[styles.matchCard, isLive && styles.liveMatchCard]}
        onPress={() => navigateToMatch(item.id)}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            {isLive && <View style={styles.liveDot} />}
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamRow}>
            <Text style={styles.teamName}>{item.teamA.name}</Text>
            {isLive && (
              <Text style={styles.score}>
                {item.team1Score}/{item.team1Wickets}
              </Text>
            )}
          </View>
          
          <Text style={styles.vs}>VS</Text>
          
          <View style={styles.teamRow}>
            <Text style={styles.teamName}>{item.teamB.name}</Text>
            {isLive && (
              <Text style={styles.score}>
                {item.team2Score}/{item.team2Wickets}
              </Text>
            )}
          </View>
        </View>

        {isLive && (
          <View style={styles.liveInfo}>
            <Text style={styles.oversInfo}>
              Over {item.currentOver}/{item.totalOvers}
            </Text>
          </View>
        )}

        <Text style={styles.matchDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {userRole === 'USER' ? 'Live Cricket Matches' : 'All Matches'}
        </Text>
        <Text style={styles.subtitle}>
          {userRole === 'USER' 
            ? 'Watch live cricket action at the sports hall'
            : `${matches.length} matches available`
          }
        </Text>
      </View>

      {matches.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {userRole === 'USER' 
              ? 'No live matches at the moment'
              : 'No matches available'
            }
          </Text>
          <Text style={styles.emptySubtext}>
            {userRole === 'USER' 
              ? 'Check back later for live cricket action!'
              : 'Create a new match to get started'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={renderMatch}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.matchesList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  matchesList: {
    flex: 1,
    padding: 16,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  liveMatchCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginLeft: 4,
  },
  teamsContainer: {
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  vs: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  liveInfo: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  oversInfo: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  matchDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});