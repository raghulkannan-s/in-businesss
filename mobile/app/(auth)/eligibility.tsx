import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/store';

export default function EligibilityScreen() {
  const { user } = useAuthStore();
  const eligibilityScore = user?.inScore ?? 0;

  const getScoreColor = (score: number) => {
    if (score > 0) return '#22c55e';
    if (score === 0) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreText = (score: number) => {
    if (score > 0) return 'Excellent';
    if (score === 0) return 'Good';
    return 'Bad';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Eligibility Score</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: getScoreColor(eligibilityScore) }]}>
            {eligibilityScore}
          </Text>
          <Text style={[styles.scoreLabel, { color: getScoreColor(eligibilityScore) }]}>
            {getScoreText(eligibilityScore)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            This is your Eligibility Score, which determines your eligibility to access the application.
          </Text>
        </View>
      </View>

      {eligibilityScore >= 0 && (
        <View style={styles.footer}>
          <Pressable
            onPress={() => router.push('/(main)/home')}
            style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
          >
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  score: {
    fontSize: 120,
    fontWeight: '800',
    lineHeight: 120,
  },
  scoreOutOf: {
    fontSize: 24,
    color: '#9ca3af',
    marginTop: -10,
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 20,
  },
  homeButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonPressed: {
    opacity: 0.8,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});