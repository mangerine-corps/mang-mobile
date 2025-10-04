import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const EducationApi = createApi({
  reducerPath: 'EducationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/education`,
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
    getEducations: builder.mutation({
      query: () => ({
        url: '/get',
        method: 'GET',
      }),
    }),
    getEducation: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'GET',
      }),
    }),
    deleteEducation: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'DELETE',
      }),
    }),
    createEducation: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          school_name: string;
          degree: string;
          field_of_study: string;
          start_month: string;
          end_month: string;
          end_year: string;
          start_year: string;
          isCurrent: boolean;
        };
      }) => ({
        url: '/create',
        method: 'POST',
        body,
      }),
    }),
    updateEducation: builder.mutation({
      query: ({
        body,
        id,
      }: {
        body: {
          school_name: string;
          degree: string;
          field_of_study: string;
          start_month: string;
          end_month: string;
          end_year: string;
          start_year: string;
          isCurrent: boolean;
        };
        id: string;
      }) => ({
        url: '/' + id,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useGetEducationMutation,
  useGetEducationsMutation,
  useUpdateEducationMutation,
} = EducationApi;
