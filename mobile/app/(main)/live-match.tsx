import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import api from '../../services/api';

interface Match {
  id: string;
  title: string;
  status: string;
  currentOver: number;
  currentBall: number;
  team1Score: number;
  team2Score: number;
  team1Wickets: number;
  team2Wickets: number;
  totalOvers: number;
  currentInning: number;
}

export default function LiveMatch() {
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRuns, setSelectedRuns] = useState<number>(0);
  const [selectedExtras, setSelectedExtras] = useState<string>('');
  const [selectedWicket, setSelectedWicket] = useState<string>('');
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(1);
  
  const scoreboardRef = useRef<View>(null);
  const router = useRouter();
  const { matchId } = useLocalSearchParams();

  useEffect(() => {
    if (matchId) {
      fetchMatchDetails();
    }
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const response = await api.get(`/api/matches/${matchId}`);
      setCurrentMatch(response.data);
    } catch (error) {
      console.error('Error fetching match:', error);
      Alert.alert('Error', 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const addBall = async () => {
    if (!currentMatch) return;

    try {
      const ballData = {
        playerId: currentPlayerId,
        runs: selectedRuns,
        ballType: selectedExtras || 'NORMAL',
        wicketType: selectedWicket || null,
        extras: selectedExtras ? 1 : 0
      };

      const response = await api.post(`/api/matches/${matchId}/ball`, ballData);
      
      if (response.data.success) {
        setCurrentMatch(response.data.match);
        // Reset selections
        setSelectedRuns(0);
        setSelectedExtras('');
        setSelectedWicket('');
        
        Alert.alert('Success', 'Ball added successfully!');
      }
    } catch (error) {
      console.error('Error adding ball:', error);
      Alert.alert('Error', 'Failed to add ball');
    }
  };

  const takeScreenshot = async () => {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera roll permission is needed to save screenshots');
        return;
      }

      // Capture the scoreboard view
      if (scoreboardRef.current) {
        const uri = await captureRef(scoreboardRef.current, {
          format: 'png',
          quality: 0.8,
        });

        // Save to device gallery
        await MediaLibrary.saveToLibraryAsync(uri);

        // Upload to backend
        const formData = new FormData();
        formData.append('screenshot', {
          uri,
          type: 'image/png',
          name: `match-${matchId}-${Date.now()}.png`,
        } as any);

        const response = await api.post(`/api/matches/${matchId}/screenshot`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          Alert.alert('Success', 'Screenshot saved to gallery and uploaded successfully!');
        }
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      Alert.alert('Error', 'Failed to save screenshot');
    }
  };

  const saveScoreboard = async () => {
    try {
      await takeScreenshot();
    } catch (error) {
      Alert.alert('Error', 'Failed to save scoreboard');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading match...</Text>
      </View>
    );
  }

  if (!currentMatch) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Match not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Scoreboard */}
      <View ref={scoreboardRef} style={styles.scoreboard}>
        <Text style={styles.matchTitle}>{currentMatch.title}</Text>
        
        <View style={styles.scoreContainer}>
          <View style={styles.teamScore}>
            <Text style={styles.teamName}>Team 1</Text>
            <Text style={styles.score}>
              {currentMatch.team1Score}/{currentMatch.team1Wickets}
            </Text>
            <Text style={styles.overs}>
              ({currentMatch.currentInning === 1 ? currentMatch.currentOver : 0}.
              {currentMatch.currentInning === 1 ? currentMatch.currentBall : 0})
            </Text>
          </View>
          
          <Text style={styles.vs}>VS</Text>
          
          <View style={styles.teamScore}>
            <Text style={styles.teamName}>Team 2</Text>
            <Text style={styles.score}>
              {currentMatch.team2Score}/{currentMatch.team2Wickets}
            </Text>
            <Text style={styles.overs}>
              ({currentMatch.currentInning === 2 ? currentMatch.currentOver : 0}.
              {currentMatch.currentInning === 2 ? currentMatch.currentBall : 0})
            </Text>
          </View>
        </View>

        <Text style={styles.status}>
          {currentMatch.status} • Inning {currentMatch.currentInning} • 
          Over {currentMatch.currentOver}/{currentMatch.totalOvers}
        </Text>
      </View>

      {/* Scoring Controls */}
      <View style={styles.controls}>
        <Text style={styles.sectionTitle}>Add Ball</Text>
        
        {/* Runs */}
        <Text style={styles.controlLabel}>Runs</Text>
        <View style={styles.runsContainer}>
          {[0, 1, 2, 3, 4, 6].map((runs) => (
            <TouchableOpacity
              key={runs}
              style={[styles.runButton, selectedRuns === runs && styles.selectedButton]}
              onPress={() => setSelectedRuns(runs)}
            >
              <Text style={[styles.runText, selectedRuns === runs && styles.selectedText]}>
                {runs}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Extras */}
        <Text style={styles.controlLabel}>Extras</Text>
        <View style={styles.extrasContainer}>
          {['wide', 'noball', 'bye', 'legbye'].map((extra) => (
            <TouchableOpacity
              key={extra}
              style={[styles.extraButton, selectedExtras === extra && styles.selectedButton]}
              onPress={() => setSelectedExtras(selectedExtras === extra ? '' : extra)}
            >
              <Text style={[styles.extraText, selectedExtras === extra && styles.selectedText]}>
                {extra.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Wickets */}
        <Text style={styles.controlLabel}>Wicket</Text>
        <View style={styles.wicketsContainer}>
          {['BOWLED', 'CAUGHT', 'LBW', 'RUN_OUT'].map((wicket) => (
            <TouchableOpacity
              key={wicket}
              style={[styles.wicketButton, selectedWicket === wicket && styles.selectedButton]}
              onPress={() => setSelectedWicket(selectedWicket === wicket ? '' : wicket)}
            >
              <Text style={[styles.wicketText, selectedWicket === wicket && styles.selectedText]}>
                {wicket}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Ball Button */}
        <TouchableOpacity style={styles.addBallButton} onPress={addBall}>
          <Text style={styles.addBallText}>Add Ball</Text>
        </TouchableOpacity>

        {/* Screenshot Button */}
        <TouchableOpacity style={styles.screenshotButton} onPress={saveScoreboard}>
          <Text style={styles.screenshotText}>Save Screenshot</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#f44336',
  },
  scoreboard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  overs: {
    fontSize: 14,
    color: '#666',
  },
  vs: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 20,
  },
  status: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
  },
  controls: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
    color: '#333',
  },
  runsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  runButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  runText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  extrasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  extraButton: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  extraText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  wicketsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wicketButton: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  wicketText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  addBallButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addBallText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenshotButton: {
    backgroundColor: '#ff9800',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  screenshotText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});