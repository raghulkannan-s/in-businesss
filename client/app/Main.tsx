import { View, Text } from "react-native";


const Main = () => {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500 p-4">
      <Text className="text-3xl text-white font-bold">Welcome to the app</Text>
      <Text className="text-white">This is a simple React application.</Text>
    </View>
  );
}

export default Main;