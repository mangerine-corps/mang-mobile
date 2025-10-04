import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  Consultancy,
  Education,
  Experience,
  Interest,
  Language,
  Skill,
  User,
  UserType,
} from '@/utils/types';

export const examplePricingData = {
  currency: 'USD',
  flatPrice: '0',
  dayBookPercentage: 0,
  midDayBookPercentage: 0,
  twoHoursDiscount: 0,
  threeHoursDiscount: 0,
  fourHoursDiscount: 0,
  otherHoursDiscount: 0,
};

type AuthState = {
  user?: User | null;
  token?: string;
  tokenExpiration?: string;
  authBlocked?: boolean;
  authTrigger?: boolean;
  interests: Interest[];
  userTypes: UserType[];
  skills?: Skill[];
  education?: Education[];
  experience?: Experience[];
  languages?: Language[];
  followers?: User[];
  services?: Consultancy[];
  follows?: User[];
  followerCount?: number;
  followsCount?: number;
  pricingData: typeof examplePricingData;
};

const slice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    authTrigger: false,
    authBlocked: false,
    userTypes: [],
    interests: [],
    skills: [],
    education: [],
    followerCount: 0,
    followers: [],
    follows: [],
    followsCount: 0,
    pricingData: examplePricingData,
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, token },
      }: PayloadAction<{ user: typeof state.user; token: string }>,
    ) => {
      state.user = user;
      state.token = token;
      // state.tokenExpiration = new Date(
      //   new Date().getTime() + 1 * 60 * 60 * 1000,
      // ).toISOString();
    },
    updateCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: typeof state.user }>,
    ) => {
      state.user = user;
    },
    updateToken: (
      state,
      { payload: { token } }: PayloadAction<{ token: string }>,
    ) => {
      state.token = token;
      // state.tokenExpiration = new Date(
      //   new Date().getTime() + 1 * 60 * 60 * 1000,
      // ).toISOString();
    },
    setAuthTrigger: (
      state,
      { payload: { trigger } }: PayloadAction<{ trigger: boolean }>,
    ) => {
      state.authTrigger = trigger;
    },
    setInterests: (
      state,
      { payload: { value } }: PayloadAction<{ value: typeof state.interests }>,
    ) => {
      state.interests = value;
    },
    setSkills: (
      state,
      { payload: { value } }: PayloadAction<{ value: typeof state.skills }>,
    ) => {
      state.skills = value;
    },
    setPricingData: (
      state,
      {
        payload: { value },
      }: PayloadAction<{ value: typeof state.pricingData }>,
    ) => {
      state.pricingData = value;
    },
    setEducation: (
      state,
      { payload: { value } }: PayloadAction<{ value: typeof state.education }>,
    ) => {
      state.education = value;
    },
    setExperience: (
      state,
      { payload: { value } }: PayloadAction<{ value: typeof state.experience }>,
    ) => {
      state.experience = value;
    },
    setLanguages: (
      state,
      { payload: { value } }: PayloadAction<{ value: typeof state.languages }>,
    ) => {
      state.languages = value;
    },
    setServices: (
      state,
      { payload: { value } }: PayloadAction<{ value: typeof state.services }>,
    ) => {
      state.services = value;
    },
    setUserTypes: (
      state,
      { payload: { value } }: PayloadAction<{ value: typeof state.userTypes }>,
    ) => {
      state.userTypes = value;
    },
    setAuthBlocked: (
      state,
      { payload: { value } }: PayloadAction<{ value: boolean }>,
    ) => {
      state.authBlocked = value;
    },
    setFollowers: (
      state,
      { payload: { value } }: PayloadAction<{ value: User[] }>,
    ) => {
      state.followers = value;
    },
    setFollowersCount: (
      state,
      { payload: { value } }: PayloadAction<{ value: number }>,
    ) => {
      state.followerCount = value;
    },
    setFollowsCount: (
      state,
      { payload: { value } }: PayloadAction<{ value: number }>,
    ) => {
      state.followsCount = value;
    },
    setFollows: (
      state,
      { payload: { value } }: PayloadAction<{ value: User[] }>,
    ) => {
      state.follows = value;
    },
    signUserOut: state => {
      state.token = undefined;
      state.user = undefined;
      state.tokenExpiration = undefined;
      state.skills = [];
      state.education = [];
      state.followers = [];
      state.follows = [];
      state.followerCount = 0;
      state.followsCount = 0;
    },
  },
});

export const {
  setCredentials,
  updateCredentials,
  signUserOut,
  updateToken,
  setAuthTrigger,
  setAuthBlocked,
  setInterests,
  setUserTypes,
  setSkills,
  setEducation,
  setExperience,
  setLanguages,
  setFollowers,
  setFollowersCount,
  setFollows,
  setFollowsCount,
  setServices,
  setPricingData,
} = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectAuthValues = (state: RootState) => state.user;
export const selectAuthTrigger = (state: RootState) => state.user.authTrigger;
export const selectAuthBlocked = (state: RootState) => state.user.authBlocked;
