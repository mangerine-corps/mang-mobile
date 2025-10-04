import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
console.log(`${getUrl()}/auth`);

// Create your service using a base URL and expected endpoints
export const AuthApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/auth`,
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
    preLogin: builder.mutation({
      query: ({ body }: { body: { email: string } }) => ({
        url: '/pre/login',
        method: 'POST',
        body,
      }),
    }),
    preSignup: builder.mutation({
      query: ({ body }: { body: { email: string } }) => ({
        url: '/pre/signup',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          username: string;
          password: string;
        };
      }) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    socialLogin: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          email: string;
          socialType: 'normal';
        };
      }) => ({
        url: '/social/login',
        method: 'POST',
        body,
      }),
    }),
    googleLogin: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          access_token: string;
        };
      }) => ({
        url: '/google',
        method: 'POST',
        body,
      }),
    }),
    createAccount: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          email: string;
          fullName: string;
          businessName: string;
          location: string;
          interests: string[];
          userType: [string];
          password: string;
          // authType: 'normal';
        };
      }) => ({
        url: '/create/account',
        method: 'POST',
        body,
      }),
    }),
    sendEmailOTP: builder.mutation({
      query: ({ body }: { body: { email: string } }) => ({
        url: '/send/email/otp',
        method: 'POST',
        body,
      }),
    }),
    sendMobileOTP: builder.mutation({
      query: ({ body }: { body: { mobileNumber: string } }) => ({
        url: '/send/mobile/otp',
        method: 'POST',
        body,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (body: { otpCode: string; otpHash: string }) => ({
        url: '/verify/otp',
        method: 'POST',
        body,
      }),
    }),
    verifyEmailOTP: builder.mutation({
      query: (body: { otpCode: string; email: string }) => ({
        url: '/verify/email/otp',
        method: 'POST',
        body,
      }),
    }),
    verifyMobileOTP: builder.mutation({
      query: (body: {
        otpCode: string;
        otpHash: string;
        mobileNumber: string;
      }) => ({
        url: '/verify/mobile/otp',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body: { email: string }) => ({
        url: '/forgot/password',
        method: 'POST',
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: '/change/password',
        method: 'POST',
        body,
      }),
    }),
    getUserTypes: builder.mutation({
      query: () => ({
        url: '/get/user/types',
        method: 'GET',
      }),
    }),
    getInterests: builder.mutation({
      query: () => ({
        url: '/get/user/interests',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOTPMutation,
  useChangePasswordMutation,
  useCreateAccountMutation,
  useForgotPasswordMutation,
  useGetInterestsMutation,
  useGetUserTypesMutation,
  usePreLoginMutation,
  usePreSignupMutation,
  useSendEmailOTPMutation,
  useSendMobileOTPMutation,
  useSocialLoginMutation,
  useVerifyEmailOTPMutation,
  useVerifyMobileOTPMutation,
  useGoogleLoginMutation,
} = AuthApi;
