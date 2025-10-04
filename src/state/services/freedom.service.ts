import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const FreedomApi = createApi({
  reducerPath: 'FreedomApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: `${getUrl()}`,
    prepareHeaders: async (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).user.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        // headers.set('Authentication', `Bearer ${token}`);
      }
      // headers.set('x-auth-apiKey', '1');
      return headers;
    },
  }),
  endpoints: builder => ({
    createUpload: builder.mutation({
      query: ({ body, cloudName }: { body: FormData; cloudName: string }) => ({
        url: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateUploadMutation } = FreedomApi;
