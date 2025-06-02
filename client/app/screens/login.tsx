
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function handleLogin() {
    setError('');
    setLoading(true);
    const backendUri = "https://in-business-backend.onrender.com";

    try {
      const res = await fetch(`${backendUri}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      if (res.ok) {
        router.replace('/home');
      } else {
        setError('Login failed. Please check your credentials or register if you do not have an account.');
      }
      setLoading(false);
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 9876543210"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          onChangeText={setPhone}
          value={phone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" color="#4F8EF7" onPress={handleLogin} />
        </View>
        <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
          {error}
        </Text>
        <Link
          href="/register"
          style={{ color: '#4F8EF7', marginTop: 10, textAlign: 'center' }}
        >
          Don't have an account? Register
        </Link>
        {loading? <Text style={{ textAlign: 'center', marginTop: 10 }}>Loading...</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaf0f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    color: '#222',
  },
  buttonContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
