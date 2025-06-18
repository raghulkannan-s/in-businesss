import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#4a5568",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3182ce",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 8,
    width: 220,
    alignItems: "center",
    shadowColor: "#3182ce",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

const HomeScreen = () => {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Please login or register to continue.
      </Text>
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default HomeScreen;