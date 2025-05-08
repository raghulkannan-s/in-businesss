import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchAPI } from '../services/api';
import { COLORS } from '../config';

const MatchTossScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tossWinner, setTossWinner] = useState(null); // 'teamA' or 'teamB'
  const [tossChoice, setTossChoice] = useState(null); // 'bat' or 'bowl'

  useEffect(() => {
    fetchMatchDetails();
  }, []);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await matchAPI.getMatchById(matchId);
      setMatch(response.data);
    } catch (error) {
      console.error('Error fetching match details:', error);
      Alert.alert('Error', 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const handleSetToss = async () => {
    if (!tossWinner || !tossChoice) {
      Alert.alert('Error', 'Please select both toss winner and choice');
      return;
    }

    try {
      setSubmitting(true);
      await matchAPI.setToss(matchId, {
        wonBy: tossWinner,
        opted: tossChoice
      });

      Alert.alert(
        'Success',
        'Toss recorded successfully',
        [
          {
            text: 'Start Match',
            onPress: async () => {
              try {
                await matchAPI.startMatch(matchId);
                navigation.navigate('MatchLive', { matchId });
              } catch (error) {
                console.error('Error starting match:', error);
                Alert.alert('Error', 'Failed to start match');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error setting toss:', error);
      Alert.alert('Error', 'Failed to record toss result');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPlayerItem = ({ item, index }) => (
    <View style={styles.playerItem}>
      <View style={styles.playerNumberContainer}>
        <Text style={styles.playerNumber}>{index + 1}</Text>
      </View>
      <Text style={styles.playerName}>{item.name}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading match details...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={60} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load match details</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchMatchDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{match.title}</Text>
        <Text style={styles.subtitle}>{match.overs} Overs Match</Text>
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamColumn}>
          <Text style={styles.teamTitle}>Team A</Text>
          <FlatList
            data={match.teamA}
            renderItem={renderPlayerItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.teamColumn}>
          <Text style={styles.teamTitle}>Team B</Text>
          <FlatList
            data={match.teamB}
            renderItem={renderPlayerItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        </View>
      </View>

      <View style={styles.tossSection}>
        <Text style={styles.tossTitle}>Record Toss Result</Text>

        <View style={styles.tossRow}>
          <Text style={styles.tossLabel}>Toss Won By:</Text>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                tossWinner === 'teamA' && styles.selectedOption
              ]}
              onPress={() => setTossWinner('teamA')}
            >
              <Text
                style={[
                  styles.optionText,
                  tossWinner === 'teamA' && styles.selectedOptionText
                ]}
              >
                Team A
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                tossWinner === 'teamB' && styles.selectedOption
              ]}
              onPress={() => setTossWinner('teamB')}
            >
              <Text
                style={[
                  styles.optionText,
                  tossWinner === 'teamB' && styles.selectedOptionText
                ]}
              >
                Team B
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tossRow}>
          <Text style={styles.tossLabel}>Elected to:</Text>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                tossChoice === 'bat' && styles.selectedOption
              ]}
              onPress={() => setTossChoice('bat')}
              disabled={!tossWinner}
            >
              <Text
                style={[
                  styles.optionText,
                  tossChoice === 'bat' && styles.selectedOptionText,
                  !tossWinner && styles.disabledOptionText
                ]}
              >
                Bat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                tossChoice === 'bowl' && styles.selectedOption,
                !tossWinner && styles.disabledOption
              ]}
              onPress={() => setTossChoice('bowl')}
              disabled={!tossWinner}
            >
              <Text
                style={[
                  styles.optionText,
                  tossChoice === 'bowl' && styles.selectedOptionText,
                  !tossWinner && styles.disabledOptionText
                ]}
              >
                Bowl
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {tossWinner && tossChoice && (
          <View style={styles.tossResult}>
            <Text style={styles.tossResultText}>
              Team {tossWinner === 'teamA' ? 'A' : 'B'} won the toss and elected to {tossChoice} first
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, (!tossWinner || !tossChoice) && styles.disabledButton]}
        onPress={handleSetToss}
        disabled={!tossWinner || !tossChoice || submitting}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <>
            <MaterialCommunityIcons name="cricket" size={20} color={COLORS.white} />
            <Text style={styles.submitButtonText}>Record Toss & Start Match</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  teamsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamColumn: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 15,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playerNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  tossSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tossTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
  },
  tossRow: {
    marginBottom: 15,
  },
  tossLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  disabledOption: {
    opacity: 0.5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  disabledOptionText: {
    color: COLORS.gray,
  },
  tossResult: {
    marginTop: 15,
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  tossResultText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default MatchTossScreen;