import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const backendURI = 'https://in-business-backend.onrender.com';

  async function handleRegister() {
    const res = await fetch(backendURI + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password }),
    });

    if (res.ok) {
      router.replace('/');
    } else {
      try {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      } catch (err) {
        setError('An error occurred while processing your request. Please try again later.');
        console.error('Registration error:', err);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Name"
        onChangeText={setName}
        value={name}
        style={styles.input}
        autoCapitalize="words"
        autoCorrect={false}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Phone Number"
        onChangeText={setPhone}
        value={phone}
        style={styles.input}
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#888"
      />
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister} color="#4F8EF7" />
      </View>
      <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
        {error}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#222',
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    maxWidth: 350,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: 8,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
});
