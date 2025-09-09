import { StyleSheet, View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
        <View style={styles.footer}>
            <Pressable
            onPress={() => router.push('/main/hall')}
            style={({ pressed }) => [styles.Button, pressed && styles.ButtonPressed]}
            >
                <Text style={styles.ButtonText}>Go to Sports Hall</Text>
            </Pressable>
        </View>
        <View style={styles.footer}>
            <Pressable
            onPress={() => router.push('/game/entry')}
            style={({ pressed }) => [styles.Button, pressed && styles.ButtonPressed]}
            >
                <Text style={styles.ButtonText}>Go to Games</Text>
            </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', },
    footer: { paddingBottom: 20, },
  Button: { backgroundColor: '#111827', paddingVertical: 16, borderRadius: 12, alignItems: 'center', },
  ButtonPressed: { opacity: 0.8, },
  ButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', },

});
