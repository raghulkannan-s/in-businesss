import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView 
} from 'react-native';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type Option = {
  label: string;
  value: string;
};

type TossSelectorProps = {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
};

export function TossSelector({ options, selected, onSelect }: TossSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: isSelected 
                  ? Colors[colorScheme].tint 
                  : colorScheme === 'dark' ? '#222222' : '#F0F0F0',
                borderColor: isSelected
                  ? Colors[colorScheme].tint
                  : colorScheme === 'dark' ? '#333333' : '#E0E0E0',
              },
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.optionText,
                isSelected && { color: '#FFFFFF' },
              ]}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});