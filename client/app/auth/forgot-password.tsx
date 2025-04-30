import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const inputBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const handleSubmit = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('http://YOUR_SERVER_IP:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      setSuccess('Password reset instructions have been sent to your phone.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Forgot Password</ThemedText>
      
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      {success ? <ThemedText style={styles.successText}>{success}</ThemedText> : null}
      
      <ThemedText style={styles.description}>
        Enter your phone number and we'll send you instructions to reset your password.
      </ThemedText>
      
      <TextInput
        style={[styles.input, { backgroundColor: inputBackground, color: textColor }]}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText style={styles.buttonText}>Submit</ThemedText>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <ThemedText type="link" style={styles.linkText}>
          Back to Login
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#34c759',
    marginBottom: 16, 
    textAlign: 'center',
  },
  linkText: {
    marginTop: 16,
    textAlign: 'center',
  },
});