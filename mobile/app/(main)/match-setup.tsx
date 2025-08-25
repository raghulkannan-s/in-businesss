import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { router } from 'expo-router';
import { useDataStore } from '@/store/store';
import { createMatch } from '@/services/api';

export default function MatchSetupScreen() {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [tossWinner, setTossWinner] = useState<1 | 2 | null>(null);
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | null>(null);
  const [overs, setOvers] = useState('20');
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');
  const [loading, setLoading] = useState(false);

  const { fetchMatches } = useDataStore();

  const handleStartMatch = async () => {
    if (!team1Name || !team2Name || !tossWinner || !tossDecision) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const matchData = {
        team1Name,
        team2Name,
        tossWinner,
        tossDecision,
        overs: parseInt(overs),
        striker: striker || undefined,
        nonStriker: nonStriker || undefined,
        bowler: bowler || undefined,
      };

      const match = await createMatch(matchData);
      await fetchMatches(); // Refresh matches list
      
      // Navigate to live match screen
      router.replace(`/(main)/live-match?matchId=${match.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Match Setup</Text>
      </View>

      {/* B1. Order 30 Players Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>B1. Order 30 Players</Text>
        <Text style={styles.sectionDescription}>
          Set up team composition and batting order (30 players total)
        </Text>
      </View>

      {/* B2. Teams Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>B2. Teams</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Team 1 Name</Text>
          <TextInput
            style={styles.input}
            value={team1Name}
            onChangeText={setTeam1Name}
            placeholder="Enter team 1 name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Team 2 Name</Text>
          <TextInput
            style={styles.input}
            value={team2Name}
            onChangeText={setTeam2Name}
            placeholder="Enter team 2 name"
          />
        </View>
      </View>

      {/* Toss Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toss</Text>
        
        <Text style={styles.label}>Toss won by:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, tossWinner === 1 && styles.selectedButton]}
            onPress={() => setTossWinner(1)}
          >
            <Text style={[styles.optionText, tossWinner === 1 && styles.selectedText]}>
              {team1Name || 'Team 1'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, tossWinner === 2 && styles.selectedButton]}
            onPress={() => setTossWinner(2)}
          >
            <Text style={[styles.optionText, tossWinner === 2 && styles.selectedText]}>
              {team2Name || 'Team 2'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Opted to:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.optionButton, tossDecision === 'bat' && styles.selectedButton]}
            onPress={() => setTossDecision('bat')}
          >
            <Text style={[styles.optionText, tossDecision === 'bat' && styles.selectedText]}>
              Bat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, tossDecision === 'bowl' && styles.selectedButton]}
            onPress={() => setTossDecision('bowl')}
          >
            <Text style={[styles.optionText, tossDecision === 'bowl' && styles.selectedText]}>
              Bowl
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overs</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Overs</Text>
          <TextInput
            style={styles.input}
            value={overs}
            onChangeText={setOvers}
            placeholder="20"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* B3. Players Section (Auto & Editing) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>B3. Opening Players (Auto & Editing)</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Striker</Text>
          <TextInput
            style={styles.input}
            value={striker}
            onChangeText={setStriker}
            placeholder="Enter striker name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Non-Striker</Text>
          <TextInput
            style={styles.input}
            value={nonStriker}
            onChangeText={setNonStriker}
            placeholder="Enter non-striker name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Opening Bowler</Text>
          <TextInput
            style={styles.input}
            value={bowler}
            onChangeText={setBowler}
            placeholder="Enter bowler name"
          />
        </View>
      </View>

      {/* Feature Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Features</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>✅ B4. Live scoring with screenshots</Text>
          <Text style={styles.featureItem}>✅ B4A. 4 wicket options (Bowled, Caught, LBW, Run Out)</Text>
          <Text style={styles.featureItem}>✅ B5. Real-time scoreboard</Text>
          <Text style={styles.featureItem}>✅ Save scoreboard functionality</Text>
          <Text style={styles.featureItem}>✅ Ball-by-ball commentary</Text>
          <Text style={styles.featureItem}>✅ Extras tracking (Wide, No Ball, Bye, Leg Bye)</Text>
        </View>
      </View>

      {/* Start Match Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, loading && styles.startButtonDisabled]}
          onPress={handleStartMatch}
          disabled={loading}
        >
          <Text style={styles.startButtonText}>
            {loading ? 'Creating Match...' : 'Start Match'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text>   </Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  section: {
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedText: {
    color: '#fff',
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    padding: 24,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});