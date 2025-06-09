

import { View, Text, TouchableOpacity } from 'react-native';

const Home = () => {
    return (
        <View className="flex-1 bg-blue-50 justify-center items-center px-6">
            <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
                <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">Home Screen</Text>
                <Text className="text-base text-gray-600 mb-6 text-center">Welcome to your app!</Text>
                <TouchableOpacity 
                    className="bg-blue-500 rounded-lg p-4 mb-4"
                    onPress={() => {
                        // Navigate to the login screen
                        // This can be replaced with your navigation logic
                        alert('Navigate to Login');
                    }}
                >
                    <Text className="text-white text-center font-semibold text-base">
                        Go to Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Home;