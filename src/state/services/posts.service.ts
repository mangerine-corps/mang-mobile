import { getUrl } from '@/utils/helpers';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Create your service using a base URL and expected endpoints
export const PostsApi = createApi({
  reducerPath: 'PostsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getUrl()}/posts`,
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
    allPosts: builder.mutation({
      query: () => ({
        url: '',
        method: 'GET',
      }),
    }),
    userPosts: builder.mutation({
      query: (id: string) => ({
        url: '/users/' + id,
        method: 'GET',
      }),
    }),
    getPost: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'GET',
      }),
    }),
    deletePost: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: '/' + id,
        method: 'DELETE',
      }),
    }),
    editPost: builder.mutation({
      query: ({ body, id }: { body: FormData; id: string }) => ({
        url: '/' + id,
        method: 'PATCH',
        body,
      }),
    }),
    createPost: builder.mutation({
      query: ({ body }: { body: FormData }) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
    paginatedPosts: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page?: number;
          limit?: number;
        };
      }) => ({
        url: '/paginated',
        method: 'GET',
        params,
      }),
    }),
    trendingPosts: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          page: number;
          limit: number;
          timeLimit: string; //1h, 6h, 24h, 7d, 30d
          algorithm: string; //reddit, hackernews, custom, hybrid
          minEngagement: number; //reddit, hackernews, custom, hybrid
          excludeHidden: boolean; //reddit, hackernews, custom, hybrid
        };
      }) => ({
        url: '/trending',
        method: 'GET',
        params,
      }),
    }),
    getComments: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          postId: string;
          page: number;
          order: 'ASC' | 'DESC';
          take: number;
        };
      }) => ({
        url: '/get/comments',
        method: 'GET',
        params,
      }),
    }),
    getCommentRepliess: builder.mutation({
      query: ({
        params,
      }: {
        params: {
          commentId: string;
          page: number;
          order: 'ASC' | 'DESC';
          take: number;
        };
      }) => ({
        url: '/get/comment/replies',
        method: 'GET',
        params,
      }),
    }),
    likePost: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: string;
          userId: string;
        };
      }) => ({
        url: '/like',
        method: 'POST',
        body,
      }),
    }),
    viewPost: builder.mutation({
      query: ({
        // body,
        id,
      }: {
        // body: {
        //   postId: string;
        //   userId: string;
        // };
        id: string;
      }) => ({
        url: `/${id}/increment-views`,
        method: 'GET',
        // body,
      }),
    }),
    likeComment: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: {
          userId: string;
        };
      }) => ({
        url: `/comment/${id}/like`,
        method: 'POST',
        body,
      }),
    }),
    unlikeComment: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: string;
        body: {
          userId: string;
        };
      }) => ({
        url: `/comment/${id}/unlike`,
        method: 'POST',
        body,
      }),
    }),
    deleteComment: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/comment/${id}`,
        method: 'DELETE',
      }),
    }),
    replyComment: builder.mutation({
      query: ({ id, body }: { id: string; body: any }) => ({
        url: `/comment/${id}/reply`,
        method: 'POST',
        body,
      }),
    }),
    unlikePost: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: string;
          userId: string;
        };
      }) => ({
        url: '/unlike',
        method: 'POST',
        body,
      }),
    }),
    reportPost: builder.mutation({
      query: ({
        body,
        id,
      }: {
        body: {
          postId: string;
          userId: string;
          reportDetails: string;
        };
        id: string;
      }) => ({
        url: `/${id}/report`,
        method: 'POST',
        body,
      }),
    }),
    postComment: builder.mutation({
      query: ({
        body,
      }: {
        body: {
          postId: string;
          userId: string;
          comment: string;
        };
      }) => ({
        url: '/comment',
        method: 'POST',
        body,
      }),
    }),
    sharePost: builder.mutation({
      query: ({ id }: { id: string }) => ({
        url: `/${id}/share`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useAllPostsMutation,
  useCreatePostMutation,
  useGetCommentRepliessMutation,
  useGetCommentsMutation,
  useGetPostMutation,
  useLikeCommentMutation,
  useLikePostMutation,
  usePaginatedPostsMutation,
  usePostCommentMutation,
  useReplyCommentMutation,
  useReportPostMutation,
  useSharePostMutation,
  useUnlikeCommentMutation,
  useUnlikePostMutation,
  useViewPostMutation,
  useUserPostsMutation,
  useEditPostMutation,
  useTrendingPostsMutation,
  useDeletePostMutation,
  useDeleteCommentMutation,
} = PostsApi;
