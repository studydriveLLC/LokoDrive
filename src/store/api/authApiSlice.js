import { apiSlice } from '../slices/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/v1/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/v1/auth/logout',
        method: 'POST',
      }),
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/v1/users/profile',
        method: 'PATCH',
        body: userData,
      }),
    }),
  }),
  overrideExisting: true, 
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
  useUpdateProfileMutation
} = authApiSlice;