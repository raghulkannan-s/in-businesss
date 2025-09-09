import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { login } from '@/services/api';
import { useAuthStore } from '@/store/store';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {

        if (!phone || !password) {
          throw new Error('Phone and password are required');
        }
        const response = await login({ phone, password });

        if (!response || !response.user || !response.accessToken || !response.refreshToken) {
          throw new Error('Invalid Credentials');
        }

        await setAuth(response.user, response.accessToken, response.refreshToken);

        Toast.show({
          type: 'success',
          text1: 'Login successful',
        });
        router.push('/main/eligibility');
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
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.heading}>இளைஞர்கள் நிறுவனம்</Text>
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder='••••••••'
                style={[styles.input, { flex: 1 }]}
              />
              <Pressable
                onPress={() => setShowPassword((prev) => !prev)}
                style={{ marginLeft: 8, padding: 4 }}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Text style={{ fontSize: 18 }}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            </View>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable onPress={onSubmit} disabled={loading} style={({ pressed }) => [styles.button, (pressed || loading) && styles.buttonPressed]}>
            {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>Login</Text>}
          </Pressable>
        </View>

          <Pressable onPress={() => router.push('/auth/register')} style={styles.buttonLight}>
            <Text style={styles.buttonTextDark}>Register</Text>
          </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, padding: 24, gap: 28, justifyContent: 'center' },
  headingWrap: { gap: 15, alignItems: 'center' },
  logo: { width: 100, height: 100, borderRadius: 15, resizeMode: 'contain' },
  heading: { fontSize: 20, fontWeight: '700' },
  subheading: { fontSize: 16, color: '#555' },
  form: { gap: 16 },
  fieldWrap: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, fontSize: 16 },
  error: { color: 'crimson', fontSize: 13 },
  button: { backgroundColor: '#111827', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonLight: { backgroundColor: '#dcdcdcff', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonTextDark: { color: '#000', fontSize: 16, fontWeight: '700' },
  small: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '600', color: '#2563eb' }
});
