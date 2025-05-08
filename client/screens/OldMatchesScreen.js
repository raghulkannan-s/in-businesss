import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchAPI } from '../services/api';
import { COLORS } from '../config';

const OldMatchesScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await matchAPI.getAllMatches('completed');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      Alert.alert('Error', 'Failed to load match history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleViewScoreboard = (matchId) => {
    navigation.navigate('Scoreboard', { matchId });
  };

  // Filter matches by search text
  const filteredMatches = matches.filter(match => {
    return match.title.toLowerCase().includes(searchText.toLowerCase());
  });

  const renderMatchItem = ({ item }) => {
    // Format date for better display
    const matchDate = new Date(item.createdAt);
    const formattedDate = matchDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => handleViewScoreboard(item._id)}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchTitle}>{item.title}</Text>
          <Text style={styles.matchDate}>{formattedDate}</Text>
        </View>

        <View style={styles.matchContent}>
          <View style={styles.teamSection}>
            <Text style={styles.teamLabel}>Team A</Text>
            <Text style={styles.scoreText}>
              {item.scoreBoard?.teamA?.total}-{item.scoreBoard?.teamA?.wickets}
            </Text>
          </View>
          
          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          
          <View style={styles.teamSection}>
            <Text style={styles.teamLabel}>Team B</Text>
            <Text style={styles.scoreText}>
              {item.scoreBoard?.teamB?.total}-{item.scoreBoard?.teamB?.wickets}
            </Text>
          </View>
        </View>

        {item.toss && (
          <View style={styles.tossInfo}>
            <MaterialCommunityIcons name="cricket" size={16} color={COLORS.gray} />
            <Text style={styles.tossText}>
              Team {item.toss.wonBy === 'teamA' ? 'A' : 'B'} won toss & chose to {item.toss.opted}
            </Text>
          </View>
        )}

        <View style={styles.footerContainer}>
          <Text style={styles.oversText}>
            {Math.max(item.scoreBoard?.teamA?.overs || 0, item.scoreBoard?.teamB?.overs || 0)} overs played
          </Text>

          <TouchableOpacity style={styles.viewButton} onPress={() => handleViewScoreboard(item._id)}>
            <Text style={styles.viewButtonText}>View Scoreboard</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search matches..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons name="close" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading match history...</Text>
        </View>
      ) : filteredMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="cricket" size={60} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>No matches found</Text>
          <Text style={styles.emptySubText}>
            {searchText ? 'Try a different search term' : 'Completed matches will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          renderItem={renderMatchItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Match History</Text>
              <Text style={styles.listCountText}>{filteredMatches.length} matches found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  listCountText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  matchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  matchDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  vsContainer: {
    paddingHorizontal: 10,
  },
  vsText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  tossInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tossText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  oversText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  viewButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 12,
  },
});

export default OldMatchesScreen;