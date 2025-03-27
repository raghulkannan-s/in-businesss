import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  title,
  onPress,
  type = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  const getBackgroundColor = () => {
    if (disabled) {
      return type === 'primary' ? '#cccccc' : 'transparent';
    }
    
    switch (type) {
      case 'primary':
        return Colors[colorScheme].tint;
      case 'secondary':
        return colorScheme === 'dark' ? '#333333' : '#F5F5F5';
      case 'outline':
        return 'transparent';
      default:
        return Colors[colorScheme].tint;
    }
  };
  
  const getBorderColor = () => {
    if (disabled) {
      return type === 'outline' ? '#cccccc' : 'transparent';
    }
    
    return type === 'outline' ? Colors[colorScheme].tint : 'transparent';
  };
  
  const getTextColor = () => {
    if (disabled) {
      return '#999999';
    }
    
    switch (type) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return colorScheme === 'dark' ? '#FFFFFF' : '#333333';
      case 'outline':
        return Colors[colorScheme].tint;
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() },
        type === 'outline' && styles.outlineButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <ThemedText
          style={[
            styles.buttonText,
            { color: getTextColor() },
            textStyle,
          ]}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  outlineButton: {
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});