import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { InputField } from '@/components/InputField';
import { TossSelector } from '@/components/TossSelector';

export default function EligibilityScreen() {
  const [age, setAge] = useState('');
  const [playingExperience, setPlayingExperience] = useState('');
  const [preferredRole, setPreferredRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!age || !playingExperience) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to home page after successful eligibility check
      router.replace('/(tabs)/home');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Eligibility Check</ThemedText>
        <ThemedText style={styles.subtitle}>Help us understand your cricket profile</ThemedText>
        
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        
        <View style={styles.formContainer}>
          <InputField
            label="Age"
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            keyboardType="number-pad"
          />
          
          <InputField
            label="Playing Experience (in years)"
            value={playingExperience}
            onChangeText={setPlayingExperience}
            placeholder="Years of cricket experience"
            keyboardType="number-pad"
          />
          
          <ThemedText style={styles.label}>Preferred Role</ThemedText>
          <TossSelector
            options={[
              { label: 'Batsman', value: 'batsman' },
              { label: 'Bowler', value: 'bowler' },
              { label: 'All-rounder', value: 'all-rounder' },
              { label: 'Wicket-keeper', value: 'wicket-keeper' }
            ]}
            selected={preferredRole}
            onSelect={setPreferredRole}
          />
          
          <Button 
            title={isLoading ? "Processing..." : "Submit"} 
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginTop: 40,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  error: {
    color: '#E53935',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  submitButton: {
    marginTop: 32,
  }
});