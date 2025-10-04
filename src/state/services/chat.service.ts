import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const ChatApi = createApi({
  reducerPath: 'ChatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/chat`,
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
    getHistory: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          conversationId: string;
          limit: string | number;
          page: string | number;
        };
      }) => ({
        url: '/history',
        method: 'GET',
        params,
      }),
    }),
    getToken: builder.mutation({
      query: () => ({
        url: '/token',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetHistoryMutation, useGetTokenMutation } = ChatApi;
