import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/store";

export default function SettingsScreen() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/(auth)/login");
          }
        }
      ]
    );
  };

  const settingsOptions = [
    {
      title: "Profile",
      subtitle: "Manage your personal information",
      onPress: () => router.push("/(main)/profile")
    },
    {
      title: "Notifications",
      subtitle: "Configure notification preferences",
      onPress: () => router.push("/(main)/notifications")
    },
    {
      title: "Privacy & Security",
      subtitle: "Manage your privacy settings",
      onPress: () => router.push("/(main)/privacy")
    },
    {
      title: "Help & Support",
      subtitle: "Get help and contact support",
      onPress: () => router.push("/(main)/support")
    },
    {
      title: "About",
      subtitle: "App version and information",
      onPress: () => router.push("/(main)/about")
    },
    {
      title: "Logout",
      subtitle: "Sign out of your account",
      onPress: handleLogout,
      isDestructive: true
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.settingsList}>
        {settingsOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={option.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingContent}>
              <Text style={[
                styles.settingTitle, 
                option.isDestructive && styles.destructiveText
              ]}>
                {option.title}
              </Text>
              <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    marginBottom: 2,
    borderRadius: 8,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  destructiveText: {
    color: '#ef4444',
  },
  arrow: {
    fontSize: 20,
    color: '#9ca3af',
    marginLeft: 8,
  },
});
