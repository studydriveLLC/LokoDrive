import { apiSlice } from '../slices/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: true, // INDISPENSABLE pour contrer les bugs du Fast Refresh d'Expo
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation 
} = authApiSlice;