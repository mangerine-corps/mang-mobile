import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const ExperienceApi = createApi({
  reducerPath: 'ExperienceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/experience`,
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
    getExperiences: builder.mutation({
      query: () => ({
        url: '/get',
        method: 'GET',
      }),
    }),
    getExperience: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'GET',
      }),
    }),
    deleteExperience: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'DELETE',
      }),
    }),
    createExperience: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          title: string;
          employment_type: string;
          company_name: string;
          location: string;
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
    updateExperience: builder.mutation({
      query: ({
        body,
        id,
      }: {
        body: {
          title: string;
          employment_type: string;
          company_name: string;
          location: string;
          start_month: string;
          end_month: string;
          end_year: string;
          start_year: string;
          isCurrent: boolean;
        };
        id: string;
      }) => ({
        url: '/' + id,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperienceMutation,
  useGetExperiencesMutation,
  useUpdateExperienceMutation,
} = ExperienceApi;
