import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Conversation, LocalConversations, MessageType } from '@/utils/types';
import { orderBy } from 'lodash';

type StateType = {
  conversations: Conversation[];
  unreadConversations: number;
  chatTrigger: boolean;
  localConversations: LocalConversations[];
  totalPages: number;
  page: number;
  token?: string;
};

const slice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
    unreadConversations: 0,
    chatTrigger: false,
    localConversations: [],
    page: 1,
    totalPages: 1,
  } as StateType,
  reducers: {
    updateConversations: (
      state,
      {
        payload: { value },
      }: PayloadAction<{ value: StateType['conversations'] }>,
    ) => {
      state.conversations = value;
    },
    updateConversationsPage: (
      state,
      {
        payload: { value },
      }: PayloadAction<{
        value: {
          totalPages: number;
          page: number;
        };
      }>,
    ) => {
      state.page = value.page;
      state.totalPages = value.totalPages;
    },
    updateUnreadConversations: (
      state,
      {
        payload: { value },
      }: PayloadAction<{ value: StateType['unreadConversations'] }>,
    ) => {
      state.unreadConversations = value;
    },
    updateChatTrigger: (
      state,
      {
        payload: { value },
      }: PayloadAction<{ value: StateType['chatTrigger'] }>,
    ) => {
      state.chatTrigger = value;
    },
    updateLocalConversations: (
      state,
      {
        payload: { value },
      }: PayloadAction<{ value: StateType['localConversations'] }>,
    ) => {
      state.localConversations = value;
    },
    updateToken: (
      state,
      { payload: { value } }: PayloadAction<{ value: StateType['token'] }>,
    ) => {
      state.token = value;
    },
    addLocalConversationObject: (
      state,
      {
        payload: { value },
      }: PayloadAction<{
        value: {
          conversation: Conversation;
          messages: MessageType[];
        };
      }>,
    ) => {
      const allConversations = [...(state.localConversations || [])];
      const existingConversation = allConversations.findIndex(
        x => x.conversation?.id === value.conversation.id,
      );
      if (existingConversation > -1) {
        allConversations[existingConversation] = {
          ...value,
          lastMessage: orderBy(value?.messages || [], 'createdAt', 'desc')[0],
        };
      } else {
        allConversations.push({
          ...value,
          lastMessage: orderBy(value?.messages || [], 'createdAt', 'desc')[0],
        });
      }
      state.localConversations = allConversations;
    },
    updateLocalConversationObject: (
      state,
      {
        payload: { value, index },
      }: PayloadAction<{
        value: LocalConversations;
        index: number;
      }>,
    ) => {
      const allConversations = [...(state.localConversations || [])];
      allConversations[index] = value;
      state.localConversations = allConversations;
    },
    updateLocalConversation: (
      state,
      {
        payload: { value, index },
      }: PayloadAction<{
        value: LocalConversations['conversation'];
        index: number;
      }>,
    ) => {
      const allConversations = [...(state.localConversations || [])];
      allConversations[index].conversation = value;
      state.localConversations = allConversations;
    },
    updateLocalConversationMessage: (
      state,
      {
        payload: { value, index },
      }: PayloadAction<{
        value: LocalConversations['messages'];
        index: number;
      }>,
    ) => {
      const allConversations = [...(state.localConversations || [])];
      const conversationMessages = [
        ...allConversations[index].messages,
        ...value,
      ];
      allConversations[index].messages = conversationMessages;
      state.localConversations = allConversations;
    },
    addMessageToConversationByConversationId: (
      state,
      {
        payload: { value },
      }: PayloadAction<{
        value: MessageType;
      }>,
    ) => {
      const spreadConversations = [...(state.conversations || [])];
      const spreadLocalConversations = [...(state.localConversations || [])];
      const conversationIndex = spreadConversations.findIndex(
        l => l.id === value?.conversationId,
      );
      const selectedConversationIndex = spreadLocalConversations.findIndex(
        l => l.conversation.id === value?.conversationId,
      );
      if (selectedConversationIndex > -1) {
        const spreadMessages = [
          ...(spreadLocalConversations[selectedConversationIndex]?.messages ||
            []),
        ];
        const messageExists = spreadMessages.findIndex(m => m.id === value.id);
        if (messageExists < 0) {
          spreadMessages.push(value);
        } else {
          spreadMessages[messageExists] = value;
        }
        spreadLocalConversations[selectedConversationIndex].messages =
          spreadMessages;
        spreadLocalConversations[selectedConversationIndex].lastMessage = value;
        state.localConversations = spreadLocalConversations;
      } else {
        if (conversationIndex > -1) {
          const newLocal: LocalConversations = {
            conversation: spreadConversations[conversationIndex],
            messages: [value],
            lastMessage: value,
          };
          spreadLocalConversations.push(newLocal);
          state.localConversations = spreadLocalConversations;
        }
      }
    },
    // updateLocalConversationTotalPages: (
    //   state,
    //   {
    //     payload: { value, index },
    //   }: PayloadAction<{
    //     value: LocalConversations['totalPages'];
    //     index: number;
    //   }>,
    // ) => {
    //   const allConversations = [...state.localConversations];
    //   allConversations[index].totalPages = value;
    //   state.localConversations = allConversations;
    // },
    deleteConversationById: (
      state,
      {
        payload: { value },
      }: PayloadAction<{
        value: string;
      }>,
    ) => {
      const allConversations = [...(state.conversations || [])];
      const allLocalConversations = [...state.localConversations];
      const filteredConversations = allConversations.filter(
        c => c.id !== value,
      );
      const filteredLocalConversations = allLocalConversations.filter(
        c => c.conversation.id !== value,
      );
      state.localConversations = filteredLocalConversations;
      state.conversations = filteredConversations;
    },
  },
});

export const {
  updateConversations,
  updateUnreadConversations,
  updateChatTrigger,
  updateLocalConversation,
  // updateLocalConversationExistingPages,
  updateLocalConversationMessage,
  // updateLocalConversationTotalPages,
  updateLocalConversations,
  updateLocalConversationObject,
  deleteConversationById,
  addMessageToConversationByConversationId,
  // updateNegotiationStatus,
  updateConversationsPage,
  addLocalConversationObject,
  updateToken,
} = slice.actions;

export default slice.reducer;

export const selectChat = (state: RootState) => state.chat;

export const selectConversations = (state: RootState) =>
  state.chat.conversations || [];
export const selectUnreadConversations = (state: RootState) =>
  state.chat.unreadConversations || 0;
export const selectChatTrigger = (state: RootState) =>
  state.chat.chatTrigger || false;
export const selectLocalConversations = (state: RootState) =>
  state.chat.localConversations || [];
