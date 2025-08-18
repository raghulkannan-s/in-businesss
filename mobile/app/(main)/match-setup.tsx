import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { router } from 'expo-router';

export default function MatchSetupScreen() {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [tossWinner, setTossWinner] = useState<1 | 2 | null>(null);
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl' | null>(null);
  const [overs, setOvers] = useState('20');
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');

  const handleStartMatch = () => {
    if (!team1Name || !team2Name || !tossWinner || !tossDecision) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const matchData = {
      team1: team1Name,
      team2: team2Name,
      tossWinner,
      tossDecision,
      overs: parseInt(overs),
      striker,
      nonStriker,
      bowler
    };

    // Navigate to live match screen with match data
    router.push({
      pathname: '/(main)/live-match',
      params: { matchData: JSON.stringify(matchData) }
    });
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

      {/* Teams Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams</Text>
        
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

      {/* Match Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Settings</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Overs</Text>
          <TextInput
            style={styles.input}
            value={overs}
            onChangeText={setOvers}
            placeholder="20"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Players Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Players (Auto & Editing)</Text>
        
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

      {/* Start Match Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartMatch}
        >
          <Text style={styles.startButtonText}>Start Match</Text>
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
  footer: {
    padding: 24,
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});