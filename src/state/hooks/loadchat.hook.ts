import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Conversation, ErrorData } from '@/utils/types';
import { useAuth } from './user.hook';
import { useGetAppointmentConversationsMutation } from '../services/appointment.service';
import {
  addLocalConversationObject,
  updateConversations,
  updateConversationsPage,
  updateToken,
} from '../reducers/chat.reducer';
import {
  useGetHistoryMutation,
  useGetTokenMutation,
} from '../services/chat.service';

export const useLoadConversations = () => {
  const { token, user } = useAuth();
  const dispatch = useDispatch();
  const [getConversations, { isLoading: conversationsLoading }] =
    useGetAppointmentConversationsMutation();
  const [getHistory, { isLoading: messagesLoading }] = useGetHistoryMutation();
  const [getToken, {}] = useGetTokenMutation();

  const loadConversations = useCallback(async () => {
    try {
      if (!token || !user) {
        return;
      }
      const pageresponse = await getConversations({
        params: {
          order: 'DESC',
          page: 1,
          take: 50,
        },
      });
      const totalPages = (pageresponse as any)?.data?.totalPages || 1;
      // console.log('totalPages', totalPages);
      const freshConvos: Conversation[] = [];
      const pagesBatch = Array.from(
        {
          length: totalPages,
        },
        (_, i) => i,
      );
      await Promise.all(
        pagesBatch.map(async index => {
          try {
            const response = await getConversations({
              params: {
                order: 'DESC',
                page: index + 1,
                take: 50,
              },
            });

            if ((response as any)?.error) {
              const err = response as any as ErrorData;
              if (
                err?.error?.data?.message?.toLowerCase()?.includes('login') ||
                err?.error?.data?.message
                  ?.toLowerCase()
                  ?.includes('unauthorized') ||
                err?.error?.status === 401
              ) {
                return;
              }
            }
            freshConvos.push(...((response as any)?.data?.data || []));
            dispatch(
              updateConversationsPage({
                value: {
                  page: (response as any)?.data?.page,
                  totalPages: (response as any)?.data?.totalPages,
                },
              }),
            );
          } catch (error) {
            console.log('batch convo error', error);
          }
        }),
      );
      dispatch(
        updateConversations({
          value: freshConvos,
        }),
      );
      const res2 = await getToken({});
      if (res2?.error) {
        return;
      }
      dispatch(
        updateToken({
          value: (res2 as any)?.data?.token || undefined,
        }),
      );
    } catch (error) {
      console.log('joined groups error', JSON.stringify(error));
    }
  }, [dispatch, getConversations, token, user, getToken]);

  const loadMessages = useCallback(
    async (conversation: Conversation) => {
      try {
        if (!token || !user) {
          return;
        }
        const response = await getHistory({
          params: {
            page: 1,
            limit: 1000,
            conversationId: conversation.id,
          },
        });
        if ((response as any)?.error) {
          return;
        }
        dispatch(
          addLocalConversationObject({
            value: {
              conversation,
              messages: (response as any)?.data?.data || [],
            },
          }),
        );
      } catch (error) {
        console.log('get messages error', JSON.stringify(error));
      }
    },
    [dispatch, getHistory, token, user],
  );

  return useMemo(
    () => ({
      loadConversations,
      conversationsLoading,
      loadMessages,
      messagesLoading,
    }),
    [loadConversations, conversationsLoading, loadMessages, messagesLoading],
  );
};
