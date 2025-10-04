import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type State = {
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
};

const slice = createSlice({
  name: 'setting',
  initialState: {
    theme: 'light',
    language: 'english',
    timezone: 'gmt',
  } as State,
  reducers: {
    setTheme: (
      state,
      { payload: { theme } }: PayloadAction<{ theme: typeof state.theme }>,
    ) => {
      state.theme = theme;
    },
    setTimezone: (
      state,
      {
        payload: { timezone },
      }: PayloadAction<{ timezone: typeof state.timezone }>,
    ) => {
      state.timezone = timezone;
    },
    setLanguage: (
      state,
      {
        payload: { language },
      }: PayloadAction<{ language: typeof state.language }>,
    ) => {
      state.language = language;
    },
  },
});

export const { setTheme, setTimezone, setLanguage } = slice.actions;

export default slice.reducer;

export const selectCurrentSettings = (state: RootState) => state.setting;
