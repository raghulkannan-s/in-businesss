import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchAPI } from '../services/api';
import { COLORS } from '../config';

const MatchLiveScreen = ({ route, navigation }) => {
  const { matchId } = route.params;
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [battingTeam, setBattingTeam] = useState(null);
  const [currentOver, setCurrentOver] = useState(0);
  const [currentBall, setCurrentBall] = useState(1);
  
  // For ball entry
  const [modalVisible, setModalVisible] = useState(false);
  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [bowler, setBowler] = useState(null);
  const [runs, setRuns] = useState(0);
  const [extras, setExtras] = useState('none');
  const [extrasRun, setExtrasRun] = useState(0);
  const [isWicket, setIsWicket] = useState(false);
  const [wicketType, setWicketType] = useState('none');
  const [fielder, setFielder] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMatchDetails();
  }, []);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      const response = await matchAPI.getMatchById(matchId);
      setMatch(response.data);
      
      // Set batting team
      setBattingTeam(response.data.currentBattingTeam);
      
      // Calculate current over and ball
      if (response.data.ballByBall && response.data.ballByBall.length > 0) {
        const lastBall = response.data.ballByBall[response.data.ballByBall.length - 1];
        setCurrentOver(lastBall.over);
        setCurrentBall(lastBall.ball === 6 ? 1 : lastBall.ball + 1);
        
        // If new over, increase over number
        if (lastBall.ball === 6) {
          setCurrentOver(lastBall.over + 1);
        }
      } else {
        setCurrentOver(0);
        setCurrentBall(1);
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
      Alert.alert('Error', 'Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBall = async () => {
    if (!striker || !bowler) {
      Alert.alert('Error', 'Please select striker and bowler');
      return;
    }

    const ballData = {
      striker,
      nonStriker,
      bowler,
      runs,
      extras,
      extrasRun,
      isWicket,
      wicketType: isWicket ? wicketType : 'none',
      fielder: (wicketType === 'caught' && isWicket) ? fielder : null,
      over: currentOver,
      ball: currentBall
    };

    try {
      setSubmitting(true);
      await matchAPI.addBallEntry(matchId, ballData);
      
      // Update match after adding ball
      await fetchMatchDetails();
      
      // Reset form
      resetBallForm();
      
      // Close modal
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding ball:', error);
      Alert.alert('Error', 'Failed to add ball');
    } finally {
      setSubmitting(false);
    }
  };

  const resetBallForm = () => {
    setRuns(0);
    setExtras('none');
    setExtrasRun(0);
    setIsWicket(false);
    setWicketType('none');
    setFielder(null);
  };

  const handleViewScoreboard = () => {
    navigation.navigate('Scoreboard', { matchId });
  };

  const renderRunOption = (value) => (
    <TouchableOpacity
      style={[styles.optionButton, runs === value && styles.selectedOption]}
      onPress={() => setRuns(value)}
    >
      <Text
        style={[styles.optionText, runs === value && styles.selectedOptionText]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );

  const renderExtraOption = (value, label) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        extras === value && styles.selectedOption,
        { paddingHorizontal: 8 }
      ]}
      onPress={() => setExtras(value)}
    >
      <Text
        style={[styles.optionText, extras === value && styles.selectedOptionText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderPlayerOption = (player, isSelected, onSelect) => (
    <TouchableOpacity
      style={[styles.playerOption, isSelected && styles.selectedPlayerOption]}
      onPress={() => onSelect(player._id)}
    >
      <Text
        style={[styles.playerOptionText, isSelected && styles.selectedPlayerOptionText]}
      >
        {player.name}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
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

  const battingTeamPlayers = battingTeam === 'teamA' ? match.teamA : match.teamB;
  const bowlingTeamPlayers = battingTeam === 'teamA' ? match.teamB : match.teamA;

  return (
    <View style={styles.container}>
      {/* Match Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{match.title}</Text>

        <View style={styles.scoreContainer}>
          <View style={styles.teamScore}>
            <Text style={styles.teamName}>Team A</Text>
            <Text style={styles.scoreText}>
              {match.scoreBoard?.teamA?.total}-{match.scoreBoard?.teamA?.wickets}
              <Text style={styles.oversText}>
                {' '}({match.scoreBoard?.teamA?.overs})
              </Text>
            </Text>
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.teamScore}>
            <Text style={styles.teamName}>Team B</Text>
            <Text style={styles.scoreText}>
              {match.scoreBoard?.teamB?.total}-{match.scoreBoard?.teamB?.wickets}
              <Text style={styles.oversText}>
                {' '}({match.scoreBoard?.teamB?.overs})
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{match.status}</Text>
          </View>
          <Text style={styles.currentOverText}>
            Current: {currentOver}.{currentBall-1} Overs
          </Text>
        </View>

        <View style={styles.battingTeamContainer}>
          <Text style={styles.battingText}>
            Batting: Team {battingTeam === 'teamA' ? 'A' : 'B'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scoreboardButton}
          onPress={handleViewScoreboard}
        >
          <MaterialCommunityIcons name="scoreboard" size={16} color={COLORS.white} />
          <Text style={styles.scoreboardButtonText}>View Scoreboard</Text>
        </TouchableOpacity>
      </View>

      {/* Ball Entry Button */}
      <TouchableOpacity
        style={styles.addBallButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="cricket" size={24} color={COLORS.white} />
        <Text style={styles.addBallButtonText}>Record Ball</Text>
      </TouchableOpacity>

      {/* Ball Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Ball</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Batting Team</Text>
                
                <Text style={styles.sectionSubtitle}>Select Striker</Text>
                <View style={styles.playersGrid}>
                  {battingTeamPlayers.map((player) => (
                    <View style={styles.playerOptionWrapper} key={player._id}>
                      {renderPlayerOption(
                        player,
                        striker === player._id,
                        (id) => setStriker(id)
                      )}
                    </View>
                  ))}
                </View>

                <Text style={styles.sectionSubtitle}>Select Non-Striker</Text>
                <View style={styles.playersGrid}>
                  {battingTeamPlayers.map((player) => (
                    <View style={styles.playerOptionWrapper} key={player._id}>
                      {renderPlayerOption(
                        player,
                        nonStriker === player._id,
                        (id) => setNonStriker(id)
                      )}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Bowling Team</Text>
                
                <Text style={styles.sectionSubtitle}>Select Bowler</Text>
                <View style={styles.playersGrid}>
                  {bowlingTeamPlayers.map((player) => (
                    <View style={styles.playerOptionWrapper} key={player._id}>
                      {renderPlayerOption(
                        player,
                        bowler === player._id,
                        (id) => setBowler(id)
                      )}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Ball Outcome</Text>

                <Text style={styles.sectionSubtitle}>Runs</Text>
                <View style={styles.runsContainer}>
                  {[0, 1, 2, 3, 4, 6].map((run) => (
                    <View style={styles.runOptionWrapper} key={run}>
                      {renderRunOption(run)}
                    </View>
                  ))}
                </View>

                <Text style={styles.sectionSubtitle}>Extras</Text>
                <View style={styles.extrasContainer}>
                  {renderExtraOption('none', 'None')}
                  {renderExtraOption('wide', 'Wide')}
                  {renderExtraOption('no-ball', 'No Ball')}
                  {renderExtraOption('bye', 'Bye')}
                  {renderExtraOption('leg-bye', 'Leg Bye')}
                </View>

                {extras !== 'none' && (
                  <View style={styles.extraRunsContainer}>
                    <Text style={styles.sectionSubtitle}>Extra Runs</Text>
                    <View style={styles.runsContainer}>
                      {[0, 1, 2, 3, 4].map((run) => (
                        <View style={styles.runOptionWrapper} key={run}>
                          <TouchableOpacity
                            style={[
                              styles.optionButton,
                              extrasRun === run && styles.selectedOption
                            ]}
                            onPress={() => setExtrasRun(run)}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                extrasRun === run && styles.selectedOptionText
                              ]}
                            >
                              {run}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.wicketContainer}>
                  <Text style={styles.sectionSubtitle}>Wicket</Text>
                  <TouchableOpacity
                    style={[
                      styles.wicketOption,
                      isWicket && styles.selectedOption
                    ]}
                    onPress={() => setIsWicket(!isWicket)}
                  >
                    <MaterialCommunityIcons
                      name={isWicket ? "check-circle" : "circle-outline"}
                      size={20}
                      color={isWicket ? COLORS.white : COLORS.text}
                    />
                    <Text
                      style={[
                        styles.wicketOptionText,
                        isWicket && styles.selectedOptionText
                      ]}
                    >
                      Wicket Taken
                    </Text>
                  </TouchableOpacity>
                </View>

                {isWicket && (
                  <>
                    <Text style={styles.sectionSubtitle}>Wicket Type</Text>
                    <View style={styles.wicketTypesContainer}>
                      {['bowled', 'caught', 'lbw', 'run-out', 'stumped'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.wicketTypeOption,
                            wicketType === type && styles.selectedOption
                          ]}
                          onPress={() => setWicketType(type)}
                        >
                          <Text
                            style={[
                              styles.wicketTypeText,
                              wicketType === type && styles.selectedOptionText
                            ]}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {wicketType === 'caught' && (
                      <>
                        <Text style={styles.sectionSubtitle}>Fielder</Text>
                        <View style={styles.playersGrid}>
                          {bowlingTeamPlayers.map((player) => (
                            <View style={styles.playerOptionWrapper} key={player._id}>
                              {renderPlayerOption(
                                player,
                                fielder === player._id,
                                (id) => setFielder(id)
                              )}
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>

              <View style={styles.ballInfoContainer}>
                <Text style={styles.ballInfoText}>
                  Over: {currentOver}.{currentBall}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.saveBallButton,
                  (!striker || !bowler) && styles.disabledButton
                ]}
                onPress={handleAddBall}
                disabled={!striker || !bowler || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="cricket" size={20} color={COLORS.white} />
                    <Text style={styles.saveBallButtonText}>Record Ball</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamScore: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  oversText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  vsContainer: {
    marginHorizontal: 10,
  },
  vsText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  currentOverText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  battingTeamContainer: {
    marginBottom: 12,
  },
  battingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  scoreboardButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  scoreboardButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  addBallButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addBallButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 10,
    marginTop: 5,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  playerOptionWrapper: {
    width: '50%',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  playerOption: {
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedPlayerOption: {
    backgroundColor: COLORS.primary,
  },
  playerOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedPlayerOptionText: {
    color: COLORS.white,
  },
  runsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  runOptionWrapper: {
    width: '16.66%',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  optionButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  extrasContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  extraRunsContainer: {
    marginBottom: 15,
  },
  wicketContainer: {
    marginBottom: 10,
  },
  wicketOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  wicketOptionText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  wicketTypesContainer: {
    marginBottom: 15,
  },
  wicketTypeOption: {
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  wicketTypeText: {
    fontSize: 14,
    color: COLORS.text,
  },
  ballInfoContainer: {
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  ballInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  saveBallButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
    opacity: 0.7,
  },
  saveBallButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default MatchLiveScreen;