import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type State = {
  privacy?: {
    messagingPreference:
      | 'everyone'
      | 'communityMembers'
      | 'noOne'
      | 'followers';
    appearInSearchResults: boolean;
  } | null;
  notification?: {
    emailNotificationsEnabled: boolean;
    pushNotificationsEnabled: boolean;
    newMessageEmail: boolean;
    consultationRequestEmail: boolean;
    platformAnnouncementEmail: boolean;
    paymentConfirmationEmail: boolean;
    failedPaymentsEmail: boolean;
    subscriptionRenewalEmail: boolean;
    paymentReminderEmail: boolean;
    newMessagePush: boolean;
    consultationRequestPush: boolean;
    platformAnnouncementPush: boolean;
    paymentConfirmationPush: boolean;
    failedPaymentsPush: boolean;
    subscriptionRenewalPush: boolean;
    paymentReminderPush: boolean;
  } | null;
  general?: {
    uiLanguage: string | null;
    timeZone: string | null;
    interfaceTheme?: string | null;
  };
};

const slice = createSlice({
  name: 'usersettings',
  initialState: {
    privacy: null,
  } as State,
  reducers: {
    setPrivacy: (
      state,
      {
        payload: { payload },
      }: PayloadAction<{ payload: typeof state.privacy }>,
    ) => {
      state.privacy = payload;
    },
    setNotificationSettings: (
      state,
      {
        payload: { payload },
      }: PayloadAction<{ payload: typeof state.notification }>,
    ) => {
      state.notification = payload;
    },
    setGeneralSettings: (
      state,
      {
        payload: { payload },
      }: PayloadAction<{ payload: typeof state.general }>,
    ) => {
      state.general = payload;
    },
    clearSettings: state => {
      state.privacy = undefined;
      state.notification = undefined;
      state.general = undefined;
    },
  },
});

export const {
  clearSettings,
  setPrivacy,
  setNotificationSettings,
  setGeneralSettings,
} = slice.actions;

export default slice.reducer;

export const selectSettingsValues = (state: RootState) => state.usersettings;
