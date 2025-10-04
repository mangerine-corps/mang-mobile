import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const ConsultantsApi = createApi({
  reducerPath: 'ConsultantsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/consultants`,
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
    getConsultants: builder.mutation({
      query: () => ({
        url: '',
        method: 'GET',
      }),
    }),
    getConsultantPricing: builder.mutation({
      query: () => ({
        url: '/pricing/get',
        method: 'GET',
      }),
    }),
    getConsultantPricingById: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id + '/pricing/',
        method: 'GET',
      }),
    }),
    getConsultant: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),
    favouriteConsultant: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          userId: string;
          consultantId: string;
        };
      }) => ({
        url: '/favorite',
        method: 'POST',
        body,
      }),
    }),
    unfavouriteConsultant: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          userId: string;
          consultantId: string;
        };
      }) => ({
        url: '/unfavorite',
        method: 'POST',
        body,
      }),
    }),
    updatePricing: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          currency: string;
          flatPrice: string;
          dayBookPercentage: number;
          midDayBookPercentage: number;
          twoHoursDiscount: number;
          threeHoursDiscount: number;
          fourHoursDiscount: number;
          otherHoursDiscount: number;
        };
      }) => ({
        url: '/pricing',
        method: 'POST',
        body,
      }),
    }),
    deleteConsultant: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useDeleteConsultantMutation,
  useFavouriteConsultantMutation,
  useGetConsultantMutation,
  useGetConsultantsMutation,
  useUnfavouriteConsultantMutation,
  useGetConsultantPricingMutation,
  useUpdatePricingMutation,
  useGetConsultantPricingByIdMutation,
} = ConsultantsApi;
