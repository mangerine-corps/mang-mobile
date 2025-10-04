import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const BookmarkApi = createApi({
  reducerPath: 'BookmarkApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/bookmarks`,
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
    getAllBookmarks: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          take: number;
          page: number;
          order: 'ASC' | 'DESC';
        };
      }) => ({
        url: '/all',
        method: 'GET',
        params,
      }),
    }),
    getBookmarkCollections: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          take: number;
          page: number;
          order: 'ASC' | 'DESC';
        };
      }) => ({
        url: '/collections',
        method: 'GET',
        params,
      }),
    }),
    getBookmarkCollection: builder.mutation({
      query: ({
        params,
        id,
      }: {
        params: {
          take: number;
          page: number;
          order: 'ASC' | 'DESC';
        };
        id: string;
      }) => ({
        url: '/collection/posts/' + id,
        method: 'GET',
        params,
      }),
    }),
    addBookmark: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: number;
        };
      }) => ({
        url: '/add',
        method: 'POST',
        body,
      }),
    }),
    removeBookmark: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: number;
        };
      }) => ({
        url: '/remove',
        method: 'POST',
        body,
      }),
    }),
    removeFromCollection: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: number;
          collection: string;
        };
      }) => ({
        url: '/collection/remove',
        method: 'POST',
        body,
      }),
    }),
    addToCollection: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: number;
          collection: string;
        };
      }) => ({
        url: '/collection/add',
        method: 'POST',
        body,
      }),
    }),
    createBookmarkCollection: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          name: string;
        };
      }) => ({
        url: '/collection/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useAddBookmarkMutation,
  useAddToCollectionMutation,
  useCreateBookmarkCollectionMutation,
  useGetAllBookmarksMutation,
  useGetBookmarkCollectionMutation,
  useGetBookmarkCollectionsMutation,
  useRemoveBookmarkMutation,
  useRemoveFromCollectionMutation,
} = BookmarkApi;
