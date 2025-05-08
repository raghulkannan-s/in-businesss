import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { playerAPI } from '../services/api';
import { COLORS } from '../config';

const EligibilityScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    try {
      setLoading(true);
      const response = await playerAPI.checkEligibility();
      setEligibility(response.data);
    } catch (error) {
      console.error('Error fetching eligibility:', error);
      Alert.alert('Error', 'Failed to fetch eligibility status');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEligibility();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Checking eligibility status...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Player Eligibility</Text>
        <Text style={styles.subtitle}>Check your eligibility status for upcoming matches</Text>
      </View>

      {eligibility ? (
        <>
          <View style={styles.statusCard}>
            <View style={[
              styles.statusBadge,
              eligibility.isEligible ? styles.eligibleBadge : styles.notEligibleBadge
            ]}>
              <MaterialCommunityIcons
                name={eligibility.isEligible ? "check-circle" : "close-circle"}
                size={24}
                color={COLORS.white}
              />
              <Text style={styles.statusBadgeText}>
                {eligibility.isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
              </Text>
            </View>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Overall Score:</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.score}>{eligibility.score}</Text>
                <Text style={styles.maxScore}>/100</Text>
              </View>
            </View>

            <Text style={styles.message}>{eligibility.message}</Text>

            <View style={styles.nextMatchContainer}>
              <Text style={styles.nextMatchLabel}>Next Match Selection:</Text>
              <Text style={styles.nextMatchDate}>{eligibility.nextMatchDate || 'Not scheduled'}</Text>
            </View>
          </View>

          <View style={styles.criteriaCard}>
            <Text style={styles.sectionTitle}>Eligibility Criteria</Text>

            {eligibility.criteria.map((criterion, index) => (
              <View key={index} style={styles.criterionRow}>
                <View style={[
                  styles.criterionStatus,
                  criterion.passed ? styles.criterionPassed : styles.criterionFailed
                ]}>
                  <MaterialCommunityIcons
                    name={criterion.passed ? "check" : "close"}
                    size={16}
                    color={COLORS.white}
                  />
                </View>
                <Text style={[
                  styles.criterionText,
                  !criterion.passed && styles.criterionTextFailed
                ]}>
                  {criterion.description}
                </Text>
              </View>
            ))}
          </View>
          
          {eligibility.attendance && (
            <View style={styles.attendanceCard}>
              <Text style={styles.sectionTitle}>Attendance Record</Text>
              
              <View style={styles.attendanceStats}>
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceValue}>{eligibility.attendance.total}</Text>
                  <Text style={styles.attendanceLabel}>Total Sessions</Text>
                </View>
                
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceValue}>{eligibility.attendance.attended}</Text>
                  <Text style={styles.attendanceLabel}>Attended</Text>
                </View>
                
                <View style={styles.attendanceStat}>
                  <Text style={styles.attendanceValue}>
                    {eligibility.attendance.percentage}%
                  </Text>
                  <Text style={styles.attendanceLabel}>Attendance Rate</Text>
                </View>
              </View>
              
              <View style={styles.attendanceNote}>
                <MaterialCommunityIcons name="information" size={20} color={COLORS.primary} />
                <Text style={styles.attendanceNoteText}>
                  Minimum required attendance: 60%
                </Text>
              </View>
            </View>
          )}
          
          {eligibility.rankInfo && (
            <View style={styles.rankCard}>
              <Text style={styles.sectionTitle}>Player Ranking</Text>
              
              <View style={styles.rankContainer}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{eligibility.rankInfo.rank}</Text>
                </View>
                <Text style={styles.rankDescription}>
                  You are currently ranked {eligibility.rankInfo.rank} 
                  {eligibility.rankInfo.outOf ? ` out of ${eligibility.rankInfo.outOf} players` : ''}
                </Text>
              </View>
              
              <Text style={styles.rankHelp}>
                {eligibility.isEligible 
                  ? 'Your ranking puts you in the selection pool for upcoming matches'
                  : 'Improve your ranking by attending practice sessions and performing well in matches'
                }
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <MaterialCommunityIcons name="refresh" size={20} color={COLORS.white} />
                <Text style={styles.refreshButtonText}>Refresh Eligibility</Text>
              </>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={60} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load eligibility data</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchEligibility}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 15,
  },
  eligibleBadge: {
    backgroundColor: COLORS.success,
  },
  notEligibleBadge: {
    backgroundColor: COLORS.error,
  },
  statusBadgeText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  maxScore: {
    fontSize: 18,
    color: COLORS.gray,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  nextMatchContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  nextMatchLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  nextMatchDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  criteriaCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  criterionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  criterionStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  criterionPassed: {
    backgroundColor: COLORS.success,
  },
  criterionFailed: {
    backgroundColor: COLORS.error,
  },
  criterionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  criterionTextFailed: {
    color: COLORS.error,
  },
  attendanceCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  attendanceStat: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGray,
    paddingHorizontal: 5,
  },
  attendanceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  attendanceLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  attendanceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 10,
    borderRadius: 8,
  },
  attendanceNoteText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 10,
  },
  rankCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rankBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  rankDescription: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  rankHelp: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  errorContainer: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default EligibilityScreen;