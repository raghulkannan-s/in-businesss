import { StyleSheet, View, Text } from "react-native";

export default function SportsHallScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sports Hall</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', },
});
