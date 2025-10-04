import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const AvailabiltyApi = createApi({
  reducerPath: 'AvailabiltyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/availability`,
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
    getConsultantAvailability: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          userId: string;
          startDate: string;
          endDate: string;
        };
      }) => ({
        url: '',
        method: 'GET',
        params,
      }),
    }),
    getAvailability: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),
    createAvailability: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          timezone: string;
          availability_settings: string[];
          availabilities: string[];
          consultantId: string;
        };
      }) => ({
        url: '/create',
        method: 'POST',
        body,
      }),
    }),
    updateAvailability: builder.mutation({
      query: ({
        body,
        id,
      }: {
        body: {
          timezone: string;
          availability_settings: string[];
          availabilities: string[];
          consultantId: string;
        };
        id: string;
      }) => ({
        url: '/' + id,
        method: 'PATCH',
        body,
      }),
    }),
    deleteAvailability: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useGetAvailabilityMutation,
  useGetConsultantAvailabilityMutation,
  useUpdateAvailabilityMutation,
} = AvailabiltyApi;
