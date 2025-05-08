import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { COLORS } from '../config';

const ProfileScreen = () => {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.updateProfile({
        name: name.trim(),
        phone: phone.trim()
      });
      
      updateUser(response.data);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: logout
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        </View>

        <Text style={styles.nameText}>{user?.name}</Text>
        <Text style={styles.roleText}>{user?.role.toUpperCase()}</Text>
        
        {!editMode && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <MaterialCommunityIcons name="account-edit" size={16} color={COLORS.white} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {editMode ? (
        <View style={styles.editFormContainer}>
          <Text style={styles.formTitle}>Edit Profile</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.staticText}>{user?.email}</Text>
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditMode(false);
                setName(user?.name || '');
                setPhone(user?.phone || '');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-check" size={20} color={COLORS.primary} />
              <Text style={styles.infoLabel}>Account Status:</Text>
              <Text style={styles.infoValue}>Active</Text>
            </View>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading statistics...</Text>
            </View>
          ) : stats ? (
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Cricket Statistics</Text>
              
              <View style={styles.statCards}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.matchesPlayed || 0}</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.runsScored || 0}</Text>
                  <Text style={styles.statLabel}>Runs</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.wicketsTaken || 0}</Text>
                  <Text style={styles.statLabel}>Wickets</Text>
                </View>
              </View>
              
              <View style={styles.detailedStats}>
                <View style={styles.detailedStatRow}>
                  <Text style={styles.detailedStatLabel}>Batting Average:</Text>
                  <Text style={styles.detailedStatValue}>
                    {stats.battingAverage ? stats.battingAverage.toFixed(2) : '0.00'}
                  </Text>
                </View>
                
                <View style={styles.detailedStatRow}>
                  <Text style={styles.detailedStatLabel}>Highest Score:</Text>
                  <Text style={styles.detailedStatValue}>{stats.highestScore || 0}</Text>
                </View>
                
                <View style={styles.detailedStatRow}>
                  <Text style={styles.detailedStatLabel}>Strike Rate:</Text>
                  <Text style={styles.detailedStatValue}>
                    {stats.strikeRate ? stats.strikeRate.toFixed(2) : '0.00'}
                  </Text>
                </View>
                
                <View style={styles.detailedStatRow}>
                  <Text style={styles.detailedStatLabel}>Bowling Economy:</Text>
                  <Text style={styles.detailedStatValue}>
                    {stats.bowlingEconomy ? stats.bowlingEconomy.toFixed(2) : '0.00'}
                  </Text>
                </View>
                
                <View style={styles.detailedStatRow}>
                  <Text style={styles.detailedStatLabel}>Best Bowling:</Text>
                  <Text style={styles.detailedStatValue}>{stats.bestBowling || 'N/A'}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.noStatsContainer}>
              <MaterialCommunityIcons name="cricket" size={60} color={COLORS.lightGray} />
              <Text style={styles.noStatsText}>No statistics available yet</Text>
              <Text style={styles.noStatsSubText}>Play matches to see your stats here</Text>
            </View>
          )}
        </>
      )}
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={20} color={COLORS.white} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  roleText: {
    fontSize: 14,
    color: COLORS.lightGray,
    marginBottom: 15,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editButtonText: {
    color: COLORS.white,
    marginLeft: 5,
    fontWeight: '500',
  },
  editFormContainer: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  staticText: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.gray,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 15,
    color: COLORS.gray,
    marginLeft: 10,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  loadingContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray,
  },
  statsSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    margin: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  detailedStats: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
  },
  detailedStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailedStatLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailedStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  noStatsContainer: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noStatsText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  noStatsSubText: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 30,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;