import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Phone and password are required.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log(`Attempting login with phone: ${phone}`);
        const response = await fetch('http://localhost:3000/mobile/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password }),
      });
      
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('Login successful!');
        router.replace('/home');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-blue-50 justify-center items-center">
      <View className="w-[90%] bg-white rounded-2xl p-6 shadow-lg">
        <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">இளைஞர்கள் நிறுவனம்</Text>
        <Text className="text-base text-gray-600 mb-6 text-center">Login to your account</Text>
        
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4 text-base bg-gray-50 text-gray-800"
          placeholder="+91 9876543210"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          onChangeText={setPhone}
          value={phone}
        />
        
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4 text-base bg-gray-50 text-gray-800"
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        
        <TouchableOpacity 
          className="bg-blue-500 rounded-lg p-4 mt-2 disabled:opacity-50"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white text-center font-semibold text-base">
            {loading ? 'Loading...' : 'Login'}
          </Text>
        </TouchableOpacity>
        
        {error ? (
          <Text className="text-red-500 mt-3 text-center">
            {error}
          </Text>
        ) : null}
        
        <Link
          href="/register"
          className="text-blue-500 mt-3 text-center"
        >
          Don't have an account? Register
        </Link>
      </View>
    </View>
  );
}
