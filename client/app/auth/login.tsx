import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(phone, password);
      router.replace('/(tabs)/home');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Welcome Back</ThemedText>
        <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>
      </View>
      
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      
      <InputField
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      
      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      
      <TouchableOpacity 
        onPress={() => router.push('/auth/forgot-password')}
        style={styles.forgotPassword}
      >
        <ThemedText type="link">Forgot Password?</ThemedText>
      </TouchableOpacity>
      
      <Button 
        title={isLoading ? "Logging in..." : "Login"} 
        onPress={handleLogin}
        disabled={isLoading}
        style={styles.loginButton}
      />
      
      <View style={styles.signupContainer}>
        <ThemedText>Don't have an account? </ThemedText>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <ThemedText type="link">Sign Up</ThemedText>
        </TouchableOpacity>
      </View>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});