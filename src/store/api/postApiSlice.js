import { apiSlice } from '../slices/apiSlice';

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Recuperer le feed de l'utilisateur connecte
    getFeed: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/v1/social/feed',
        params: { page, limit },
      }),
      transformResponse: (response) => {
        // Le backend renvoie { status, results, data: { posts } }
        return response.data?.posts || [];
      },
      providesTags: ['Post'],
    }),

    // Creer une nouvelle publication
    createPost: builder.mutation({
      query: (postData) => ({
        url: '/v1/social/posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),

    // Supprimer une publication
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/v1/social/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),

    // Liker / Deliker une publication
    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `/v1/social/posts/${postId}/like`,
        method: 'POST',
      }),
      // Mise a jour optimiste : on met a jour le cache directement
      optimisticUpdate: (result, postId, { cacheData }) => {
        // Cette logique sera geree cote composant
      },
      invalidatesTags: ['Post'],
    }),

    // Ajouter un commentaire
    addComment: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/v1/social/posts/${postId}/comments`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Post'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFeedQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useToggleLikeMutation,
  useAddCommentMutation,
} = postApiSlice;
