import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Post, Work } from '@/utils/types';

type State = {
  allPosts: Post[];
  paginatedPosts: Post[];
  page: number;
  totalPages: number;
  userPosts?: Post[];
  userWorks?: Work[];
};

const slice = createSlice({
  name: 'posts',
  initialState: {
    allPosts: [],
    page: 1,
    paginatedPosts: [],
    totalPages: 1,
    userPosts: [],
    works: [],
  } as State,
  reducers: {
    setAllPosts: (
      state,
      { payload: { posts } }: PayloadAction<{ posts: typeof state.allPosts }>,
    ) => {
      state.allPosts = posts;
    },
    setUserPosts: (
      state,
      { payload: { posts } }: PayloadAction<{ posts: typeof state.allPosts }>,
    ) => {
      state.userPosts = posts;
    },
    setUserWorks: (
      state,
      { payload: { works } }: PayloadAction<{ works: typeof state.userWorks }>,
    ) => {
      state.userWorks = works;
    },
    setPaginatedPosts: (
      state,
      {
        payload: { posts, page, totalPages },
      }: PayloadAction<{
        posts: typeof state.allPosts;
        page: number;
        totalPages: number;
      }>,
    ) => {
      const existingPosts = [...(state?.paginatedPosts || [])];
      if (page === 1) {
        state.paginatedPosts = posts;
        state.page = page;
        state.totalPages = totalPages;
      } else {
        state.paginatedPosts = [...existingPosts, ...posts];
        state.page = page;
        state.totalPages = totalPages;
      }
    },
  },
});

export const { setAllPosts, setPaginatedPosts, setUserPosts, setUserWorks } =
  slice.actions;

export default slice.reducer;

export const selectPostsValues = (state: RootState) => state.posts;
