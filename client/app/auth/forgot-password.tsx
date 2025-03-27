import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Reset Password</ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter your phone number and we'll send you a code to reset your password
        </ThemedText>
      </View>
      
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      
      {success ? (
        <View style={styles.successContainer}>
          <ThemedText style={styles.successText}>
            A verification code has been sent to your phone.
          </ThemedText>
          <Button 
            title="Back to Login" 
            onPress={() => router.push('/auth/login')}
            style={styles.backButton}
          />
        </View>
      ) : (
        <>
          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your registered phone number"
            keyboardType="phone-pad"
          />
          
          <Button 
            title={isLoading ? "Processing..." : "Send Reset Code"} 
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
          />
          
          <View style={styles.loginContainer}>
            <ThemedText>Remember your password? </ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <ThemedText type="link">Login</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#E53935',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
  },
});