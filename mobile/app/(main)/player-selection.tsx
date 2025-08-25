import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  TextInput,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

interface Player {
  id: number;
  name: string;
  email: string;
  role: string;
  totalRuns?: number;
  matches?: number;
}

export default function PlayerSelection() {
  const [eligiblePlayers, setEligiblePlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [autoSelectMode, setAutoSelectMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchEligiblePlayers();
  }, []);

  const fetchEligiblePlayers = async () => {
    try {
      const response = await api.get('/api/users');
      const users = response.data.filter((user: any) => user.role === 'USER');
      
      // Sort by performance for better auto-selection
      const sortedUsers = users.sort((a: any, b: any) => {
        const aScore = (a.totalRuns || 0) + (a.matches || 0) * 10;
        const bScore = (b.totalRuns || 0) + (b.matches || 0) * 10;
        return bScore - aScore;
      });
      
      setEligiblePlayers(sortedUsers);
      
      if (autoSelectMode) {
        // Auto-select top 30 players
        const autoSelected = sortedUsers.slice(0, Math.min(30, sortedUsers.length));
        setSelectedPlayers(autoSelected);
        
        if (sortedUsers.length >= 30) {
          Alert.alert(
            'Auto-Selection Complete', 
            `Selected top 30 players based on performance. Toggle off auto-select to manually adjust.`
          );
        }
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      Alert.alert('Error', 'Failed to fetch eligible players');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayerSelection = (player: Player) => {
    if (autoSelectMode) {
      Alert.alert('Auto-Select Mode', 'Turn off auto-select to manually choose players');
      return;
    }

    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < 30) {
      setSelectedPlayers([...selectedPlayers, player]);
    } else {
      Alert.alert('Limit Reached', 'You can only select 30 players maximum');
    }
  };

  const toggleAutoSelect = (value: boolean) => {
    setAutoSelectMode(value);
    if (value) {
      // Re-auto-select top 30
      const autoSelected = eligiblePlayers.slice(0, Math.min(30, eligiblePlayers.length));
      setSelectedPlayers(autoSelected);
    }
  };

  const filteredPlayers = eligiblePlayers.filter(player =>
    player.name.toLowerCase().includes(searchText.toLowerCase()) ||
    player.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const proceedToMatchSetup = () => {
    if (selectedPlayers.length !== 30) {
      Alert.alert('Invalid Selection', 'Please select exactly 30 players to proceed');
      return;
    }
    
    router.push({
      pathname: '/(main)/match-setup',
      params: { 
        selectedPlayers: JSON.stringify(selectedPlayers.map(p => p.id)),
        playerNames: JSON.stringify(selectedPlayers.map(p => p.name))
      }
    });
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const isSelected = selectedPlayers.find(p => p.id === item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.playerItem, isSelected && styles.selectedPlayer]}
        onPress={() => togglePlayerSelection(item)}
      >
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, isSelected && styles.selectedPlayerText]}>
            {item.name}
          </Text>
          <Text style={[styles.playerEmail, isSelected && styles.selectedPlayerText]}>
            {item.email}
          </Text>
          {item.totalRuns && (
            <Text style={[styles.playerStats, isSelected && styles.selectedPlayerText]}>
              {item.totalRuns} runs • {item.matches || 0} matches
            </Text>
          )}
        </View>
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading eligible players...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Players for Match</Text>
        <Text style={styles.subtitle}>
          Selected: {selectedPlayers.length}/30
        </Text>
        
        <View style={styles.controls}>
          <View style={styles.autoSelectContainer}>
            <Text style={styles.autoSelectLabel}>Auto-select top players</Text>
            <Switch
              value={autoSelectMode}
              onValueChange={toggleAutoSelect}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoSelectMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlayer}
        style={styles.playersList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={[styles.proceedButton, selectedPlayers.length !== 30 && styles.disabledButton]}
        onPress={proceedToMatchSetup}
        disabled={selectedPlayers.length !== 30}
      >
        <Text style={styles.proceedButtonText}>
          Proceed to Match Setup ({selectedPlayers.length}/30)
        </Text>
      </TouchableOpacity>
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
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  controls: {
    marginBottom: 8,
  },
  autoSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  autoSelectLabel: {
    fontSize: 16,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  playersList: {
    flex: 1,
    padding: 16,
  },
  playerItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedPlayer: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  playerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  playerStats: {
    fontSize: 12,
    color: '#888',
  },
  selectedPlayerText: {
    color: '#1976d2',
  },
  selectedBadge: {
    backgroundColor: '#4caf50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  proceedButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});