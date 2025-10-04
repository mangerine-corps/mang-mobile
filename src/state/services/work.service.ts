import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const WorkApi = createApi({
  reducerPath: 'WorkApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/work`,
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
    getWorks: builder.mutation({
      query: () => ({
        url: '/get',
        method: 'GET',
      }),
    }),
    getWork: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'GET',
      }),
    }),
    deleteWork: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'DELETE',
      }),
    }),
    createWork: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/create',
        method: 'POST',
        body,
      }),
    }),
    updateWork: builder.mutation({
      query: ({ body, id }: { body: FormData; id: string }) => ({
        url: '/edit/' + id,
        method: 'PATCH',
        body,
      }),
    }),
    addWorkPost: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          post: number;
          work: string;
        };
      }) => ({
        url: '/add/post',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useAddWorkPostMutation,
  useCreateWorkMutation,
  useDeleteWorkMutation,
  useGetWorkMutation,
  useGetWorksMutation,
  useUpdateWorkMutation,
} = WorkApi;
