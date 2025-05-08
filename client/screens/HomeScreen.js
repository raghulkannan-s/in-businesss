import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { matchAPI, userAPI } from '../services/api';
import { COLORS } from '../config';

const HomeScreen = ({ navigation }) => {
  const { user, isAdmin, isManager, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [userScore, setUserScore] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch live matches
      const livesResponse = await matchAPI.getAllMatches('live');
      setLiveMatches(livesResponse.data);
      
      // Fetch upcoming matches
      const upcomingResponse = await matchAPI.getAllMatches('upcoming');
      setUpcomingMatches(upcomingResponse.data);
      
      // Fetch user's score
      const scoreResponse = await userAPI.getScore();
      setUserScore(scoreResponse.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate('Matches', { 
        screen: 'Scoreboard', 
        params: { matchId: item._id } 
      })}
    >
      <View style={styles.matchHeader}>
        <Text style={styles.matchTitle}>{item.title}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.teamsContainer}>
        <Text style={styles.teamName}>Team A</Text>
        <Text style={styles.versusText}>VS</Text>
        <Text style={styles.teamName}>Team B</Text>
      </View>
      
      {item.status === 'live' && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {item.scoreBoard?.teamA?.total}-{item.scoreBoard?.teamA?.wickets}
          </Text>
          <Text style={styles.scoreText}>
            {item.scoreBoard?.teamB?.total}-{item.scoreBoard?.teamB?.wickets}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome, {user?.name || 'Player'}!</Text>
        {userScore && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Your Score:</Text>
            <Text style={styles.scoreValue}>₹{userScore.score}</Text>
          </View>
        )}
      </View>

      {isAdmin() && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('AdminPanel')}
        >
          <MaterialCommunityIcons name="shield-account" size={20} color={COLORS.white} />
          <Text style={styles.adminButtonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}

      {(isAdmin() || isManager()) && (
        <TouchableOpacity
          style={styles.newMatchButton}
          onPress={() => navigation.navigate('Matches', { screen: 'NewMatch' })}
        >
          <MaterialCommunityIcons name="cricket" size={20} color={COLORS.white} />
          <Text style={styles.newMatchButtonText}>Create New Match</Text>
        </TouchableOpacity>
      )}
      
      <FlatList
        data={[...liveMatches, ...upcomingMatches]}
        keyExtractor={(item) => item._id}
        renderItem={renderMatchItem}
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>
            {liveMatches.length > 0 ? 'Live & Upcoming Matches' : 'Upcoming Matches'}
          </Text>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matches found</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={20} color={COLORS.white} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  scoreLabel: {
    fontWeight: '500',
    color: COLORS.gray,
    marginRight: 5,
  },
  scoreValue: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 15,
  },
  matchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  versusText: {
    fontSize: 12,
    color: COLORS.gray,
    marginHorizontal: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  adminButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  adminButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  newMatchButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  newMatchButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
  },
});

export default HomeScreen;