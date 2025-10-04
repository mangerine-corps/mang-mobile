import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { MiniGroup } from '@/utils/types';

type State = {
  joinedGroups: MiniGroup[];
  createdGroups: MiniGroup[];
};

const slice = createSlice({
  name: 'groups',
  initialState: {
    joinedGroups: [],
    createdGroups: [],
  } as State,
  reducers: {
    setJoinedGroups: (
      state,
      {
        payload: { groups },
      }: PayloadAction<{ groups: typeof state.joinedGroups }>,
    ) => {
      state.joinedGroups = groups;
    },
    setCreatedGroups: (
      state,
      {
        payload: { groups },
      }: PayloadAction<{ groups: typeof state.joinedGroups }>,
    ) => {
      state.createdGroups = groups;
    },
  },
});

export const { setJoinedGroups, setCreatedGroups } = slice.actions;

export default slice.reducer;

export const selectGroupValues = (state: RootState) => state.groups;
