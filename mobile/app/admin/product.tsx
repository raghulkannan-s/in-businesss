import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import {  router } from 'expo-router';
import  { create_product } from '@/services/product.api';
import Toast from 'react-native-toast-message';

export default function ProductScreen() {

    const [product, setProduct] = useState({
      name: '',
      description: '',
      price: '',
      category: 'general',
      stock: '',
      imageUrl: '',
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);

    setLoading(true);
    try {
     const data = await create_product(product);
     Toast.show({
       type: 'success',
       text1: data.message,
     });
     setProduct({
       name: '',
       description: '',
       price: '',
       category: 'general',
       stock: '',
       imageUrl: '',
     });
     router.push('/main/hall');
    } catch (e:any) {
      setError(e.message || 'Product Creation failed');
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
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              value={product.name}
              onChangeText={(text) => setProduct({ ...product, name: text })}
              placeholder='Product Name'
              style={styles.input}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              autoCapitalize='none'
              keyboardType='default'
              value={product.description}
              onChangeText={(text) => setProduct({ ...product, description: text })}
              placeholder='Product Description'
              style={styles.input}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              autoCapitalize='none'
              keyboardType='numeric'
              value={product.price}
              onChangeText={(text) => setProduct({ ...product, price: text })}
              placeholder='Product Price'
              style={styles.input}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              autoCapitalize='none'
              keyboardType='numeric'
              value={product.stock}
              onChangeText={(text) => setProduct({ ...product, stock: text })}
              placeholder='Product Stock'
              style={styles.input}
            />
          </View>
          
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <Pressable onPress={onSubmit} disabled={loading} style={({ pressed }) => [styles.button, (pressed || loading) && styles.buttonPressed]}>
            {loading ? <ActivityIndicator color='#fff' /> : <Text style={styles.buttonText}>Create Product</Text>}
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/main/hall')} style={styles.buttonLight}>
          <Text style={styles.buttonTextDark}>Go To Sports Hall</Text>
        </Pressable>
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
