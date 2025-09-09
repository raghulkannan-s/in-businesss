import { router } from "expo-router";
import { StyleSheet, View, Text, Pressable } from "react-native";

export default function GamesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Games</Text>
      <Pressable
        onPress={() => router.push("/game/cricket/cricketLanding")}
        style={({ pressed }) => [styles.Button, pressed && styles.ButtonPressed]}
      >
        <Text style={styles.ButtonText}>Cricket</Text>
      </Pressable>
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
