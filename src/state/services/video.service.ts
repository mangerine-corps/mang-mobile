import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const VideoApi = createApi({
  reducerPath: 'VideoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/video`,
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
    getVideoToken: builder.mutation({
      query: ({ channelName }: { channelName: string }) => ({
        url: `/rtc-token/${channelName}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetVideoTokenMutation } = VideoApi;
