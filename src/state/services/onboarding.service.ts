import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const OnboardingApi = createApi({
  reducerPath: 'OnboardingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/onboarding`,
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
    updateProfilePic: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/update-profile/pics',
        method: 'POST',
        body,
      }),
    }),
    updateProfilePricing: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          pricingPlan: string;
        };
      }) => ({
        url: '/update-profile/pricing',
        method: 'POST',
        body,
      }),
    }),
    updateProfileResume: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/update-profile/resume',
        method: 'POST',
        body,
      }),
    }),
    updateProfileVideo: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/update-profile/video',
        method: 'POST',
        body,
      }),
    }),
    updateProfileDetails: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/update-profile/details',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useUpdateProfileDetailsMutation,
  useUpdateProfilePricingMutation,
  useUpdateProfileResumeMutation,
  useUpdateProfilePicMutation,
  useUpdateProfileVideoMutation,
} = OnboardingApi;
