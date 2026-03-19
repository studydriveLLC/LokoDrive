import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SecureStorageAdapter = {
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') await AsyncStorage.setItem(key, value);
      else await SecureStore.setItemAsync(key, value);
    } catch (e) { console.error('Erreur setItem', e); }
  },
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') return await AsyncStorage.getItem(key);
      else return await SecureStore.getItemAsync(key);
    } catch (e) { return null; }
  },
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') await AsyncStorage.removeItem(key);
      else await SecureStore.deleteItemAsync(key);
    } catch (e) { console.error('Erreur removeItem', e); }
  }
};

// Export pour l'ancienne syntaxe ET export default pour ton apiSlice YELY
export const { setItem: saveToken, getItem: getToken, removeItem: deleteToken } = SecureStorageAdapter;
export default SecureStorageAdapter;