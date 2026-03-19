import * as SecureStore from 'expo-secure-store';

export const saveToken = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans SecureStore:', error);
  }
};

export const getToken = async (key) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error('Erreur lors de la recuperation dans SecureStore:', error);
    return null;
  }
};

export const deleteToken = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Erreur lors de la suppression dans SecureStore:', error);
  }
};