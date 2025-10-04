import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const UsersApi = createApi({
  reducerPath: 'UsersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/users`,
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
    getInfo: builder.mutation({
      query: () => ({
        url: '/get/info',
        method: 'GET',
      }),
    }),
    getUserInfo: builder.mutation({
      query: ({ id }: { id: string }) => {
        return {
          url: '/get/info/',
          method: 'GET',
          params: {
            id,
          },
        };
      },
    }),
    updateProfilePic: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/update/profile/pics',
        method: 'POST',
        body,
      }),
    }),
    updateProfileBanner: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/update/profile/banner',
        method: 'POST',
        body,
      }),
    }),
    updateProfileVideo: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/update/profile/video',
        method: 'POST',
        body,
      }),
    }),
    updateProfileContact: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          mobileNumber: string;
          websiteAddress: string;
        };
      }) => ({
        url: '/update/contact/info',
        method: 'POST',
        body,
      }),
    }),
    updateProfileInfo: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          fullName: string;
          occupation: string;
          location: string;
          dateOfBirth: string;
          bio: string;
        };
      }) => ({
        url: '/update/profile/info',
        method: 'POST',
        body,
      }),
    }),
    addConsultancy: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '/add/consultancy',
        method: 'POST',
        body,
      }),
    }),
    getConsultancy: builder.mutation({
      query: () => ({
        url: '/get/consultancy',
        method: 'GET',
      }),
    }),
    deleteConsultancy: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/delete/consultancy/' + id,
        method: 'DELETE',
      }),
    }),
    deleteLanguage: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/delete/language/' + id,
        method: 'DELETE',
      }),
    }),
    deleteSkill: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/delete/skill/' + id,
        method: 'DELETE',
      }),
    }),
    addLanguage: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          language: string;
          proficiency: string;
        };
      }) => ({
        url: '/add/language',
        method: 'POST',
        body,
      }),
    }),
    addSkill: builder.mutation({
      query: ({ body }: { body: { name: string; skills: string[] } }) => ({
        url: '/add/skill',
        method: 'POST',
        body,
      }),
    }),
    getLanguages: builder.mutation({
      query: () => ({
        url: '/get/languages',
        method: 'GET',
      }),
    }),
    getSkills: builder.mutation({
      query: () => ({
        url: '/get/skills',
        method: 'GET',
      }),
    }),
    followUser: builder.mutation({
      query: ({
        currentUser,
        targetUser,
      }: {
        currentUser: string;
        targetUser: string;
      }) => ({
        url: `${currentUser}/follow/${targetUser}`,
        method: 'POST',
      }),
    }),
    unfollowUser: builder.mutation({
      query: ({
        currentUser,
        targetUser,
      }: {
        currentUser: string;
        targetUser: string;
      }) => ({
        url: `${currentUser}/unfollow/${targetUser}`,
        method: 'DELETE',
      }),
    }),
    deactivate: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          reason: string;
        };
      }) => ({
        url: '/deactivate',
        method: 'PATCH',
        body,
      }),
    }),
    becomeConsultant: builder.mutation({
      query: () => ({
        url: '/become/consultant',
        method: 'PATCH',
      }),
    }),
    getFollowing: builder.mutation({
      query: ({
        id,
        params,
      }: {
        id: string;
        params: {
          page: number;
          limit: number;
        };
      }) => ({
        url: '/' + id + '/following',
        method: 'GET',
        params,
      }),
    }),
    getFollowers: builder.mutation({
      query: ({
        id,
        params,
      }: {
        id: string;
        params: {
          page: number;
          limit: number;
        };
      }) => ({
        url: '/' + id + '/followers',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useGetInfoMutation,
  useUpdateProfileBannerMutation,
  useUpdateProfileInfoMutation,
  useUpdateProfilePicMutation,
  useUpdateProfileVideoMutation,
  useAddConsultancyMutation,
  useAddLanguageMutation,
  useAddSkillMutation,
  useBecomeConsultantMutation,
  useDeactivateMutation,
  useDeleteConsultancyMutation,
  useDeleteLanguageMutation,
  useDeleteSkillMutation,
  useFollowUserMutation,
  useGetConsultancyMutation,
  useGetFollowersMutation,
  useGetFollowingMutation,
  useGetLanguagesMutation,
  useGetSkillsMutation,
  useUnfollowUserMutation,
  useUpdateProfileContactMutation,
  useGetUserInfoMutation,
} = UsersApi;
