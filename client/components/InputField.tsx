import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  ViewStyle 
} from 'react-native';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function InputField({
  label,
  error,
  style,
  containerStyle,
  ...restProps
}: InputFieldProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  const getInputBorderColor = () => {
    if (error) {
      return '#E53935';
    }
    return colorScheme === 'dark' ? '#555555' : '#E0E0E0';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <ThemedText style={styles.label}>{label}</ThemedText>
      ) : null}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: getInputBorderColor(),
            backgroundColor: colorScheme === 'dark' ? '#2C2C2C' : '#F8F8F8',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          },
          style,
        ]}
        placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#999999'}
        {...restProps}
      />
      {error ? (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#E53935',
    marginTop: 5,
    fontSize: 14,
  },
});