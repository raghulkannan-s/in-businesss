import React, { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, TextInput } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock data for sports halls
const SPORTS_HALLS = [
  {
    id: '1',
    name: 'National Cricket Stadium',
    location: 'Central Park, New York',
    distance: '2.5 km',
    rating: 4.8,
    available: true,
  },
  {
    id: '2',
    name: 'City Cricket Club',
    location: 'Downtown, Chicago',
    distance: '3.7 km',
    rating: 4.5,
    available: true,
  },
  {
    id: '3',
    name: 'University Indoor Arena',
    location: 'College Street, Boston',
    distance: '5.1 km',
    rating: 4.3,
    available: false,
  },
  {
    id: '4',
    name: 'Community Sports Complex',
    location: 'Westside, Los Angeles',
    distance: '1.8 km',
    rating: 4.6,
    available: true,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [searchQuery, setSearchQuery] = useState('');
  
  const renderVenueCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.venueCard}
      onPress={() => router.push(`/matches/venue/${item.id}`)}
      activeOpacity={0.8}
    >
      {/* Placeholder for an image */}
      <View style={[
        styles.venuePlaceholder, 
        {backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'}
      ]}>
        <ThemedText style={styles.placeholderText}>{item.name.charAt(0)}</ThemedText>
      </View>
      
      <View style={styles.venueContent}>
        <View style={styles.venueHeader}>
          <ThemedText type="defaultSemiBold" style={styles.venueName}>{item.name}</ThemedText>
          {item.available ? (
            <View style={styles.availableBadge}>
              <ThemedText style={styles.availableText}>Available</ThemedText>
            </View>
          ) : (
            <View style={styles.unavailableBadge}>
              <ThemedText style={styles.unavailableText}>Booked</ThemedText>
            </View>
          )}
        </View>
        
        <View style={styles.venueInfo}>
          <IconSymbol 
            name="house.fill" 
            size={16} 
            color={Colors[colorScheme].icon} 
          />
          <ThemedText style={styles.venueInfoText}>{item.location}</ThemedText>
        </View>
        
        <View style={styles.venueFooter}>
          <View style={styles.venueInfo}>
            <IconSymbol 
              name="paperplane.fill" 
              size={16} 
              color={Colors[colorScheme].icon} 
            />
            <ThemedText style={styles.venueInfoText}>{item.distance}</ThemedText>
          </View>
          
          <View style={styles.venueInfo}>
            <IconSymbol 
              name="paperplane.fill" 
              size={16} 
              color="#FFC107" 
            />
            <ThemedText style={styles.venueInfoText}>{item.rating}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Sports Halls</ThemedText>
        <TouchableOpacity 
          style={[
            styles.profileButton, 
            {backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'}
          ]} 
          onPress={() => router.push('/(tabs)/profile')}
        >
          <ThemedText style={styles.profileButtonText}>👤</ThemedText>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchBar}>
        <IconSymbol 
          name="paperplane.fill" 
          size={20} 
          color={Colors[colorScheme].icon} 
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for venues"
          placeholderTextColor={colorScheme === 'dark' ? '#9BA1A6' : '#999999'}
          style={[
            styles.searchInput,
            { color: colorScheme === 'dark' ? '#FFFFFF' : '#000000' }
          ]}
        />
      </View>
      
      <FlatList
        data={SPORTS_HALLS}
        renderItem={renderVenueCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  profileButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    fontSize: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  venueCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: 'white',
  },
  venuePlaceholder: {
    width: '100%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 64,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  venueContent: {
    padding: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 18,
    flex: 1,
  },
  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E8F5E9',
  },
  availableText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  unavailableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#FFEBEE',
  },
  unavailableText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueInfoText: {
    fontSize: 14,
    marginLeft: 6,
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});