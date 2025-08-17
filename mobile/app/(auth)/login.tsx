import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { login } from '@/services/api';
import { useAuthStore } from '@/store/store';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth } = useAuthStore();

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
        const response = await login({ phone, password });

        if (!response || !response.user || !response.accessToken || !response.refreshToken) {
          throw new Error('Invalid authentication data received');
        }

        await setAuth(response.user, response.accessToken, response.refreshToken);

        Toast.show({
          type: 'success',
          text1: 'Login successful',
        });
        router.push('/(auth)/eligibility');
    } catch (e:any) {
      setError(e.message || 'Login failed');
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: e.message || 'Please check your credentials and try again',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.headingWrap}>
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Login to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              autoCapitalize='none'
              keyboardType='phone-pad'
              value={phone}
              onChangeText={setPhone}
              placeholder='9876543210'
              style={styles.input}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder='••••••••'
              style={styles.input}
            />
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable onPress={onSubmit} disabled={loading} style={({ pressed }) => [styles.button, (pressed || loading) && styles.buttonPressed]}>
            {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>Login</Text>}
          </Pressable>
        </View>

        <View style={styles.rowCenter}>
          <Text style={styles.small}>No account?</Text>
          <Link href='/(auth)/register' style={styles.link}>Register</Link>
        </View>
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
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  small: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '600', color: '#2563eb' }
});
