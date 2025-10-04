import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const PaymentApi = createApi({
  reducerPath: 'PaymentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/payment`,
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
    createIntent: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          amount: number;
          currency: string;
          consultationDetails: {
            consultantId: string;
            userId: string;
            message: string;
            availabilityId: string;
            timeslots: string[];
            videoOption: boolean;
          };
        };
      }) => ({
        url: '/create-intent',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateIntentMutation } = PaymentApi;
