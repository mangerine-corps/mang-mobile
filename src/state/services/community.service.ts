import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const CommunityApi = createApi({
  reducerPath: 'CommunityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/community`,
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
    getCommunities: builder.mutation({
      query: () => ({
        url: '',
        method: 'GET',
      }),
    }),
    getPaginatedCommunities: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page: number;
          limit: number;
        };
      }) => ({
        url: '/paginate',
        method: 'GET',
        params,
      }),
    }),
    getCreatedCommunities: builder.mutation({
      query: () => ({
        url: '/created-communities',
        method: 'GET',
      }),
    }),
    getJoinedCommunities: builder.mutation({
      query: () => ({
        url: '/joined-communities',
        method: 'GET',
      }),
    }),
    getTrendingCommunities: builder.mutation({
      query: () => ({
        url: '/trending',
        method: 'GET',
      }),
    }),
    getRecommendedCommunities: builder.mutation({
      query: () => ({
        url: '/recommended',
        method: 'GET',
      }),
    }),
    getCommunityCategories: builder.mutation({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
    }),
    getCommunityPosts: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page: number;
          groupId: string;
          limit: number;
        };
      }) => ({
        url: '/post',
        method: 'GET',
        params,
      }),
    }),
    getCommunityMemeber: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}/members`,
        method: 'GET',
      }),
    }),
    getCommunity: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),
    updateCommunity: builder.mutation({
      query: ({ id, body }: { id: string; body: FormData }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    joinLeaveCommunity: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/join_or_leave/${id}`,
        method: 'PUT',
      }),
    }),
    deleteCommunity: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
    createCommunity: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/create-community',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateCommunityMutation,
  useDeleteCommunityMutation,
  useGetCommunitiesMutation,
  useGetCommunityMemeberMutation,
  useGetCommunityMutation,
  useGetCreatedCommunitiesMutation,
  useGetJoinedCommunitiesMutation,
  useGetPaginatedCommunitiesMutation,
  useGetRecommendedCommunitiesMutation,
  useGetTrendingCommunitiesMutation,
  useUpdateCommunityMutation,
  useJoinLeaveCommunityMutation,
  useGetCommunityCategoriesMutation,
  useGetCommunityPostsMutation,
} = CommunityApi;
