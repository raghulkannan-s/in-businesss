import * as SecureStore from 'expo-secure-store'

export const getAuthHeader = async () => {
  const token = await SecureStore.getItemAsync('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
