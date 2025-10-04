import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const SettingApi = createApi({
  reducerPath: 'SettingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/settings`,
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
    patchPassword: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/password`,
        method: 'PATCH',
        body,
      }),
    }),
    addSecondaryNumber: builder.mutation({
      query: ({
        body,
      }: {
        body: { secondaryNumber: string; confirmSecondaryNumber: string };
      }) => ({
        url: '/secondary-number',
        method: 'POST',
        body,
      }),
    }),
    updateSecondaryNumber: builder.mutation({
      query: ({
        body,
      }: {
        body: { secondaryNumber: string; confirmSecondaryNumber: string };
      }) => ({
        url: '/secondary-number',
        method: 'PATCH',
        body,
      }),
    }),
    removeSecondaryNumber: builder.mutation({
      query: () => ({
        url: '/remove-secondary-number',
        method: 'DELETE',
      }),
    }),
    sendMessage: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/message`,
        method: 'POST',
        body,
      }),
    }),
    sendFeedback: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/feedback`,
        method: 'POST',
        body,
      }),
    }),
    reportIssue: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/report-issue`,
        method: 'POST',
        body,
      }),
    }),
    updateSettings: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    cancelSubscription: builder.mutation({
      query: () => ({
        url: '/cancel',
        method: 'POST',
      }),
    }),
    addPaymentMethod: builder.mutation({
      query: ({ body }: { body: { [key: string]: string } }) => ({
        url: '/payment-methods',
        method: 'POST',
        body,
      }),
    }),
    getPaymentMethods: builder.mutation({
      query: () => ({
        url: '/payment-methods',
        method: 'GET',
      }),
    }),
    updatePaymentMethod: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/payment-methods/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    removePaymentMethod: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/payment-methods/${id}`,
        method: 'DELETE',
      }),
    }),
    updateNotificationSettings: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/notification-settings`,
        method: 'PATCH',
        body,
      }),
    }),
    enableEmail2FA: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}/enable-email`,
        method: 'POST',
      }),
    }),
    enablePhone2FA: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}/enable-phone`,
        method: 'POST',
      }),
    }),
    verifyOTP: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/verify-otp`,
        method: 'POST',
        body,
      }),
    }),
    setupApp2FA: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/setup-app`,
        method: 'POST',
        body,
      }),
    }),
    enableApp2FA: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/enable-app`,
        method: 'POST',
        body,
      }),
    }),
    deactivateApp2FA: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/deactivate-app`,
        method: 'POST',
        body,
      }),
    }),
    updateUserSettings: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: { [key: string]: string };
      }) => ({
        url: `/${id}/update-settings`,
        method: 'POST',
        body,
      }),
    }),
    getCurrentSettings: builder.mutation({
      query: ({ patch }: { patch?: any }) => ({
        url: !patch ? '/user-settings' : '',
        method: patch ? 'PATCH' : 'GET',
        body: patch,
      }),
    }),
    getNotificationSettings: builder.mutation({
      query: ({ patch }: { patch?: any }) => ({
        url: '/notification-settings',
        method: patch ? 'PATCH' : 'GET',
        body: patch,
      }),
    }),
    getGeneralSettings: builder.mutation({
      query: ({ patch }: { patch?: any }) => ({
        url: '/general-settings',
        method: patch ? 'PATCH' : 'GET',
        body: patch,
      }),
    }),
  }),
});

export const {
  useAddPaymentMethodMutation,
  useAddSecondaryNumberMutation,
  useCancelSubscriptionMutation,
  useDeactivateApp2FAMutation,
  useEnableApp2FAMutation,
  useEnableEmail2FAMutation,
  useEnablePhone2FAMutation,
  useGetCurrentSettingsMutation,
  useGetNotificationSettingsMutation,
  useGetPaymentMethodsMutation,
  usePatchPasswordMutation,
  useRemovePaymentMethodMutation,
  useRemoveSecondaryNumberMutation,
  useReportIssueMutation,
  useSendFeedbackMutation,
  useSendMessageMutation,
  useSetupApp2FAMutation,
  useUpdateNotificationSettingsMutation,
  useUpdatePaymentMethodMutation,
  useUpdateSecondaryNumberMutation,
  useUpdateSettingsMutation,
  useUpdateUserSettingsMutation,
  useVerifyOTPMutation,
  useGetGeneralSettingsMutation,
} = SettingApi;
