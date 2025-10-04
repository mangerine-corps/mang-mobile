import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const AppointmentApi = createApi({
  reducerPath: 'AppointmentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/appointment`,
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
    getUserAppointments: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          userId: string;
          status?: string;
          page?: string | number;
          limit?: string | number;
        };
      }) => ({
        url: '/user',
        method: 'GET',
        params,
      }),
    }),
    getMyAppointments: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page?: string | number;
          status?: string;
          limit?: string | number;
        };
      }) => ({
        url: '/my-appointments',
        method: 'GET',
        params,
      }),
    }),
    getAppointmentConversations: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page?: string | number;
          take?: string | number;
          order?: 'ASC' | 'DESC';
        };
      }) => ({
        url: '/get/conversations',
        method: 'GET',
        params,
      }),
    }),
    bookAppointment: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          consultantId: string;
          userId: string;
          availabilityId: string;
          message: string;
          videoOption: boolean;
          timeslots: string[];
        };
      }) => ({
        url: '/book',
        method: 'POST',
        body,
      }),
    }),
    cancelAppointment: builder.mutation({
      query: ({
        appointmentId,
        userId,
      }: {
        appointmentId: string;
        userId: string;
      }) => ({
        url: `/${appointmentId}/cancel/${userId}`,
        method: 'POST',
      }),
    }),
    rescheduleAppointment: builder.mutation({
      query: ({
        appointmentId,
        userId,
        body,
      }: {
        appointmentId: string;
        userId: string;
        body: any;
      }) => ({
        url: `/${appointmentId}/reschedule/${userId}`,
        method: 'POST',
        body,
      }),
    }),
    createAppointmentConversation: builder.mutation({
      query: ({
        params,
      }: // body,
      {
        params: {
          appointmentId: string;
          participantId: string;
        };
        // body: any;
      }) => ({
        url: '/create/conversation',
        method: 'POST',
        // body,
        params,
      }),
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useCreateAppointmentConversationMutation,
  useGetAppointmentConversationsMutation,
  useGetMyAppointmentsMutation,
  useGetUserAppointmentsMutation,
  useRescheduleAppointmentMutation,
} = AppointmentApi;
