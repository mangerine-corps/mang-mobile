import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import user from './reducers/user.reducer';
import usersettings from './reducers/usersettings.reducer';
import setting from './reducers/setting.reducer';
import posts from './reducers/posts.reducer';
import groups from './reducers/groups.reducer';
import chat from './reducers/chat.reducer';
import { AuthApi } from './services/auth.service';
import { OnboardingApi } from './services/onboarding.service';
import { UsersApi } from './services/users.service';
import { PostsApi } from './services/posts.service';
import { CommunityApi } from './services/community.service';
import { ConsultantsApi } from './services/consultants.service';
import { InvitesApi } from './services/invites.service';
import { WorkApi } from './services/work.service';
import { ChatApi } from './services/chat.service';
import { BookmarkApi } from './services/bookmark.service';
import { EducationApi } from './services/education.service';
import { ExperienceApi } from './services/experience.service';
import { SettingApi } from './services/setting.service';
import { AvailabiltyApi } from './services/availability.service';
import { AppointmentApi } from './services/appointment.service';
import { VideoApi } from './services/video.service';
import { PaymentApi } from './services/payment.service';
import { UploadsApi } from './services/uploads.service';
import { FreedomApi } from './services/freedom.service';
import { getReduxKey } from '@/utils/helpers';

const persistConfig = {
  key: getReduxKey()!,
  version: 1,
  storage: AsyncStorage,
  whitelist: ['user', 'settings', 'chat'],
};

const reducers = combineReducers({
  user,
  usersettings,
  posts,
  groups,
  setting,
  chat,
  [AuthApi.reducerPath]: AuthApi.reducer,
  [OnboardingApi.reducerPath]: OnboardingApi.reducer,
  [UsersApi.reducerPath]: UsersApi.reducer,
  [PostsApi.reducerPath]: PostsApi.reducer,
  [CommunityApi.reducerPath]: CommunityApi.reducer,
  [ConsultantsApi.reducerPath]: ConsultantsApi.reducer,
  [InvitesApi.reducerPath]: InvitesApi.reducer,
  [WorkApi.reducerPath]: WorkApi.reducer,
  [EducationApi.reducerPath]: EducationApi.reducer,
  [ExperienceApi.reducerPath]: ExperienceApi.reducer,
  [BookmarkApi.reducerPath]: BookmarkApi.reducer,
  [SettingApi.reducerPath]: SettingApi.reducer,
  [AvailabiltyApi.reducerPath]: AvailabiltyApi.reducer,
  [AppointmentApi.reducerPath]: AppointmentApi.reducer,
  [ChatApi.reducerPath]: ChatApi.reducer,
  [VideoApi.reducerPath]: VideoApi.reducer,
  [PaymentApi.reducerPath]: PaymentApi.reducer,
  [UploadsApi.reducerPath]: UploadsApi.reducer,
  [FreedomApi.reducerPath]: FreedomApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      AuthApi.middleware,
      OnboardingApi.middleware,
      UsersApi.middleware,
      PostsApi.middleware,
      CommunityApi.middleware,
      InvitesApi.middleware,
      WorkApi.middleware,
      EducationApi.middleware,
      BookmarkApi.middleware,
      ExperienceApi.middleware,
      ConsultantsApi.middleware,
      SettingApi.middleware,
      AvailabiltyApi.middleware,
      AppointmentApi.middleware,
      ChatApi.middleware,
      VideoApi.middleware,
      PaymentApi.middleware,
      UploadsApi.middleware,
      FreedomApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
