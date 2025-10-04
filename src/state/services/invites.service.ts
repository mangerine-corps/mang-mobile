import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const InvitesApi = createApi({
  reducerPath: 'InvitesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/invites`,
    prepareHeaders: async (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // headers.set('Authentication', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getCommunityInvites: builder.mutation({
      query: () => ({
        url: '/community-invites',
        method: 'GET',
      }),
    }),
    getCommunityInvite: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/community-invites/' + id,
        method: 'GET',
      }),
    }),
    deleteCommunityInvite: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/community-invites/' + id,
        method: 'DELETE',
      }),
    }),
    getCreatedCommunityInvites: builder.mutation({
      query: () => ({
        url: '/community-invites/created',
        method: 'GET',
      }),
    }),
    getReceivedCommunityInvites: builder.mutation({
      query: () => ({
        url: '/community-invites/received',
        method: 'GET',
      }),
    }),
    getCommunityInviteRequests: builder.mutation({
      query: () => ({
        url: '/community-invites/requests',
        method: 'GET',
      }),
    }),
    createCommunityInvite: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          userId: string;
          communityId: number;
          note: string;
        };
      }) => ({
        url: '/community-invites',
        method: 'POST',
        body,
      }),
    }),
    createCommunityInvites: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          communityId: number;
          userIds: string[];
        };
      }) => ({
        url: '/community-invites',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateCommunityInviteMutation,
  useCreateCommunityInvitesMutation,
  useDeleteCommunityInviteMutation,
  useGetCommunityInviteMutation,
  useGetCommunityInviteRequestsMutation,
  useGetCommunityInvitesMutation,
  useGetCreatedCommunityInvitesMutation,
  useGetReceivedCommunityInvitesMutation,
} = InvitesApi;
