import { StyleSheet, View, Text } from "react-native";

export default function CricketHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cricket Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', },
  Button: { backgroundColor: '#111827', paddingVertical: 16, borderRadius: 12, alignItems: 'center', },
  ButtonPressed: { opacity: 0.8, },
  ButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', },
});
