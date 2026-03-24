import { createSlice } from '@reduxjs/toolkit';
import { saveToken, deleteToken } from '../secureStoreAdapter';

const initialState = {
  user: null,
  token: null,
  refreshToken: null, // Ajout du refreshToken dans l'état initial
  isAuthenticated: false,
  isLoading: true,
  isTokenRefreshing: false,
};

// Fonctions utilitaires pour éviter de bloquer le thread principal avec des promesses
const safeStorageSet = (key, value) => {
  Promise.resolve(saveToken(key, value)).catch(err => {
    console.error(`[Redux] Echec de sauvegarde pour ${key}:`, err);
  });
};

const safeStorageRemove = (key) => {
  Promise.resolve(deleteToken(key)).catch(err => {
    console.error(`[Redux] Echec de suppression pour ${key}:`, err);
  });
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload; // On extrait le refreshToken
      
      if (user) state.user = user;
      if (token) state.token = token;
      if (refreshToken) state.refreshToken = refreshToken; // On met à jour l'état
      
      state.isAuthenticated = !!state.token;
      state.isLoading = false;

      // Sauvegarde persistante immédiate ("Bank Grade")
      if (state.token) safeStorageSet('accessToken', state.token);
      if (state.refreshToken) safeStorageSet('refreshToken', state.refreshToken);
      if (state.user) safeStorageSet('userData', JSON.stringify(state.user));
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // On met à jour le stockage persistant
        safeStorageSet('userData', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null; // Nettoyage de l'état
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isTokenRefreshing = false;

      // Nettoyage complet du stockage persistant ("Bank Grade")
      safeStorageRemove('accessToken');
      safeStorageRemove('refreshToken');
      safeStorageRemove('userData');
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTokenRefreshing: (state, action) => {
      state.isTokenRefreshing = action.payload;
    }
  },
});

export const { setCredentials, updateUser, logout, setAuthLoading, setTokenRefreshing } = authSlice.actions;

export default authSlice.reducer;