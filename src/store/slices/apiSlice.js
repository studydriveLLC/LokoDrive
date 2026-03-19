import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../secureStoreAdapter';

// L'URL de base pointe STRICTEMENT vers la variable d'environnement pour des raisons de securite.
const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL;

// Securite developpement : Avertir si la variable n'est pas chargee
if (!rawBaseUrl && __DEV__) {
  console.warn("ATTENTION: EXPO_PUBLIC_API_URL n'est pas defini dans le fichier .env !");
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: rawBaseUrl,
    prepareHeaders: async (headers, { getState }) => {
      // 1. Cherche le token dans Redux
      let token = getState().auth.token;
      
      // 2. S'il n'est pas dans Redux (ex: redemarrage de l'app), cherche dans le telephone
      if (!token) {
        token = await getToken('accessToken');
      }

      // 3. Injecte le token de maniere securisee
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Les "tags" permettent de rafraichir automatiquement l'UI quand une donnee change
  tagTypes: ['User', 'Post', 'Workspace', 'Notification'], 
  endpoints: (builder) => ({}), // Les endpoints specifiques seront injectes plus tard
});