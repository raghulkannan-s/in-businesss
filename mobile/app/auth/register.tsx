import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { register } from '@/services/api';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
     const data = await register({ name, email, phone, address, password });
     Toast.show({
       type: 'success',
       text1: data.message,
     });
     setName('');
     setEmail('');
     setPhone('');
     setPassword('');
     setConfirm('');
     router.push('/auth/login');
    } catch (e:any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.headingWrap}>
          <Text style={styles.heading}>Create account</Text>
          <Text style={styles.subheading}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder='Your Full Name'
              style={styles.input}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder='9876543210'
              keyboardType='phone-pad'
              style={styles.input}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize='none'
              keyboardType='email-address'
              value={email}
              onChangeText={setEmail}
              placeholder='you@example.com'
              style={styles.input}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              autoCapitalize='none'
              keyboardType='default'
              value={address}
              onChangeText={setAddress}
              placeholder='Your Address'
              style={styles.input}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder='Create a password'
              style={styles.input}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              placeholder='Repeat password'
              style={styles.input}
            />
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable onPress={onSubmit} disabled={loading} style={({ pressed }) => [styles.button, (pressed || loading) && styles.buttonPressed]}>
            {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>Register</Text>}
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/auth/login')} style={styles.buttonLight}>
          <Text style={styles.buttonTextDark}>Have an account? Login</Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, padding: 24, gap: 28, justifyContent: 'center' },
  headingWrap: { gap: 4 },
  heading: { fontSize: 32, fontWeight: '700' },
  subheading: { fontSize: 16, color: '#555' },
  form: { gap: 16 },
  fieldWrap: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, fontSize: 16 },
  error: { color: 'crimson', fontSize: 13 },
  button: { backgroundColor: '#111827', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonPressed: { opacity: 0.7 },
  buttonLight: { backgroundColor: '#dcdcdcff', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonTextDark: { color: '#000', fontSize: 16, fontWeight: '700' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  small: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '600', color: '#2563eb' }
});
