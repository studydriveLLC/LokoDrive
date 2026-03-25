//src/store/api/notificationApiSlice.js
import { apiSlice } from '../slices/apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: `/v1/notifications?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result?.data?.notifications
          ? [
              ...result.data.notifications.map(({ _id }) => ({ type: 'Notification', id: _id })),
              { type: 'Notification', id: 'LIST' }
            ]
          : [{ type: 'Notification', id: 'LIST' }]
    }),
    
    getUnreadCount: builder.query({
      query: () => ({ url: '/v1/notifications/unread-count' }),
      providesTags: ['NotificationCount'],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/v1/notifications/${id}/read`,
        method: 'PATCH',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApiSlice.util.updateQueryData('getNotifications', { page: 1, limit: 20 }, (draft) => {
            const notif = draft?.data?.notifications?.find(n => String(n._id) === String(id));
            if (notif) notif.isRead = true;
          })
        );
        try {
          await queryFulfilled;
          dispatch(notificationApiSlice.util.invalidateTags(['NotificationCount']));
        } catch {
          patchResult.undo();
        }
      }
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: '/v1/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification', 'NotificationCount'],
    }),

    registerPushToken: builder.mutation({
      query: (token) => ({
        url: '/v1/notifications/register-token',
        method: 'POST',
        body: { token },
      }),
    }),

    unregisterPushToken: builder.mutation({
      query: (token) => ({
        url: '/v1/notifications/unregister-token',
        method: 'POST',
        body: { token },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useRegisterPushTokenMutation,
  useUnregisterPushTokenMutation,
} = notificationApiSlice;