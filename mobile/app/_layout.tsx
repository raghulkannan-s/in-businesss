import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar />
        <Stack screenOptions={{ headerShown: false }}/>
        <Toast />
    </SafeAreaView>
  );
}
