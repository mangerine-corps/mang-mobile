import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const UploadsApi = createApi({
  reducerPath: 'UploadsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/uploads`,
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
    signUpload: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          folder: string;
          public_id: string;
          tags: string[];
        };
      }) => ({
        url: '/sign-upload',
        method: 'POST',
        body,
      }),
    }),
    deleteUpload: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          publicIds: string[];
        };
      }) => ({
        url: '/delete-batch',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSignUploadMutation, useDeleteUploadMutation } = UploadsApi;
