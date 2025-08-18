import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';

interface MatchData {
  team1: string;
  team2: string;
  tossWinner: 1 | 2;
  tossDecision: 'bat' | 'bowl';
  overs: number;
  striker: string;
  nonStriker: string;
  bowler: string;
}

interface ScoreData {
  runs: number;
  balls: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
}

export default function LiveMatchScreen() {
  const params = useLocalSearchParams();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [score, setScore] = useState<ScoreData>({
    runs: 0,
    balls: 0,
    wickets: 0,
    overs: 0,
    ballsInOver: 0
  });
  const [wicketModalVisible, setWicketModalVisible] = useState(false);
  const [screenshots, setScreenshots] = useState<string[]>([]);

  useEffect(() => {
    if (params.matchData) {
      try {
        const data = JSON.parse(params.matchData as string);
        setMatchData(data);
      } catch (error) {
        console.error('Error parsing match data:', error);
      }
    }
  }, [params]);

  const addRuns = (runs: number) => {
    setScore(prev => ({
      ...prev,
      runs: prev.runs + runs,
      balls: prev.balls + 1,
      ballsInOver: prev.ballsInOver + 1,
      overs: prev.ballsInOver === 5 ? prev.overs + 1 : prev.overs
    }));

    if (score.ballsInOver === 5) {
      setScore(prev => ({ ...prev, ballsInOver: 0 }));
    }
  };

  const addWicket = (wicketType: string) => {
    setScore(prev => ({
      ...prev,
      wickets: prev.wickets + 1,
      balls: prev.balls + 1,
      ballsInOver: prev.ballsInOver + 1,
      overs: prev.ballsInOver === 5 ? prev.overs + 1 : prev.overs
    }));
    setWicketModalVisible(false);

    if (score.ballsInOver === 5) {
      setScore(prev => ({ ...prev, ballsInOver: 0 }));
    }
  };

  const addExtra = (type: string) => {
    setScore(prev => ({
      ...prev,
      runs: prev.runs + 1
    }));
  };

  const takeScreenshot = () => {
    const timestamp = new Date().toLocaleTimeString();
    setScreenshots(prev => [...prev, `Screenshot ${timestamp}`]);
    Alert.alert('Screenshot', 'Screenshot saved successfully!');
  };

  const saveScoreboard = () => {
    Alert.alert(
      'Save Scoreboard',
      'Scoreboard has been saved successfully!',
      [
        { text: 'Continue Match', style: 'cancel' },
        { text: 'End Match', onPress: () => router.push('/(main)/scoreboard') }
      ]
    );
  };

  const wicketTypes = ['Bowled', 'Caught', 'LBW', 'Run Out'];

  if (!matchData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading match data...</Text>
      </View>
    );
  }

  const battingTeam = matchData.tossDecision === 'bat' 
    ? (matchData.tossWinner === 1 ? matchData.team1 : matchData.team2)
    : (matchData.tossWinner === 1 ? matchData.team2 : matchData.team1);

  const bowlingTeam = matchData.tossDecision === 'bowl' 
    ? (matchData.tossWinner === 1 ? matchData.team1 : matchData.team2)
    : (matchData.tossWinner === 1 ? matchData.team2 : matchData.team1);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Live Match</Text>
        <TouchableOpacity onPress={takeScreenshot}>
          <Text style={styles.screenshotButton}>📷</Text>
        </TouchableOpacity>
      </View>

      {/* Match Info */}
      <View style={styles.matchInfo}>
        <Text style={styles.matchTitle}>{matchData.team1} vs {matchData.team2}</Text>
        <Text style={styles.matchSubtitle}>{matchData.overs} Overs</Text>
      </View>

      {/* Current Score */}
      <View style={styles.scoreSection}>
        <Text style={styles.teamName}>{battingTeam}</Text>
        <Text style={styles.scoreText}>
          {score.runs}/{score.wickets} ({score.overs}.{score.ballsInOver})
        </Text>
        <Text style={styles.currentPlayers}>
          Striker: {matchData.striker} | Non-Striker: {matchData.nonStriker}
        </Text>
        <Text style={styles.currentBowler}>
          Bowler: {matchData.bowler}
        </Text>
      </View>

      {/* Scoring Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Runs</Text>
        <View style={styles.runsGrid}>
          {[0, 1, 2, 3, 4, 6].map((runs) => (
            <TouchableOpacity
              key={runs}
              style={[styles.runButton, runs === 4 && styles.fourButton, runs === 6 && styles.sixButton]}
              onPress={() => addRuns(runs)}
            >
              <Text style={[styles.runButtonText, (runs === 4 || runs === 6) && styles.boundaryText]}>
                {runs}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Wicket Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wicket</Text>
        <TouchableOpacity
          style={styles.wicketButton}
          onPress={() => setWicketModalVisible(true)}
        >
          <Text style={styles.wicketButtonText}>Wicket</Text>
        </TouchableOpacity>
      </View>

      {/* Extras */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Extras</Text>
        <View style={styles.extrasGrid}>
          {['Wide', 'No Ball', 'Bye', 'Leg Bye'].map((extra) => (
            <TouchableOpacity
              key={extra}
              style={styles.extraButton}
              onPress={() => addExtra(extra)}
            >
              <Text style={styles.extraButtonText}>{extra}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Screenshots */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Screenshots ({screenshots.length})</Text>
        <TouchableOpacity style={styles.screenshotListButton} onPress={takeScreenshot}>
          <Text style={styles.screenshotListText}>Take Screenshot</Text>
        </TouchableOpacity>
      </View>

      {/* Save Scoreboard */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveScoreboard}>
          <Text style={styles.saveButtonText}>Save Scoreboard</Text>
        </TouchableOpacity>
      </View>

      {/* Wicket Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={wicketModalVisible}
        onRequestClose={() => setWicketModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Wicket Type</Text>
            {wicketTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.wicketTypeButton}
                onPress={() => addWicket(type)}
              >
                <Text style={styles.wicketTypeText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setWicketModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  screenshotButton: {
    fontSize: 24,
  },
  matchInfo: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  matchSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  scoreSection: {
    padding: 24,
    backgroundColor: '#1f2937',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  currentPlayers: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 4,
  },
  currentBowler: {
    fontSize: 14,
    color: '#d1d5db',
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
  runsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  runButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  fourButton: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  sixButton: {
    backgroundColor: '#dcfce7',
    borderColor: '#10b981',
  },
  runButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  boundaryText: {
    color: '#111827',
  },
  wicketButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  wicketButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
  },
  extrasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  extraButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  extraButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  screenshotListButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
  },
  screenshotListText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  wicketTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 8,
  },
  wicketTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
  },
});