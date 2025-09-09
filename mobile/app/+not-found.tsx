import { View, Text, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">

      <Text className="text-3xl font-bold text-gray-800 mb-2">Oops!</Text>
      <Text className="text-xl text-gray-600 mb-8 text-center">
        We couldn't find the page you're looking for.
      </Text>
      
      <View className="flex-row gap-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-gray-200 px-6 py-3 rounded-lg"
        >
          <Text className="text-gray-800 font-medium">Go Back</Text>
        </TouchableOpacity>
        
        <Link href="/main/hall">
          <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Go to Hall</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
