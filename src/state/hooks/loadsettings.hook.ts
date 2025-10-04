import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import {
  useGetCurrentSettingsMutation,
  useGetGeneralSettingsMutation,
  useGetNotificationSettingsMutation,
} from '../services/setting.service';
import {
  setGeneralSettings,
  setNotificationSettings,
  setPrivacy,
} from '../reducers/usersettings.reducer';

export const useLoadSettings = () => {
  const dispatch = useDispatch();
  const [getPrivacy, { isLoading: privacyLoading }] =
    useGetCurrentSettingsMutation();
  const [getNotificationSettings, { isLoading: notificationSettingsLoading }] =
    useGetNotificationSettingsMutation();
  const [getGeneralSettings, { isLoading: generalSettingsLoading }] =
    useGetGeneralSettingsMutation();

  const loadPrivacy = useCallback(async () => {
    try {
      const response = await getPrivacy({});
      // console.log('fetchTypes response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setPrivacy({
          payload: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log(error);
      const err = error as ErrorData;
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [getPrivacy, dispatch]);

  const loadNotificationSettings = useCallback(async () => {
    try {
      const response = await getNotificationSettings({});
      // console.log('fetchTypes response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setNotificationSettings({
          payload: (response as any)?.data,
        }),
      );
    } catch (error) {
      console.log(error);
      const err = error as ErrorData;
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [getNotificationSettings, dispatch]);

  const loadGeneralSettings = useCallback(async () => {
    try {
      const response = await getGeneralSettings({});
      // console.log('fetchTypes response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      dispatch(
        setGeneralSettings({
          payload: (response as any)?.data?.data,
        }),
      );
    } catch (error) {
      console.log(error);
      const err = error as ErrorData;
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [getGeneralSettings, dispatch]);

  const loadSettings = useCallback(() => {
    loadPrivacy();
    loadNotificationSettings();
    loadGeneralSettings();
  }, [loadPrivacy, loadNotificationSettings, loadGeneralSettings]);

  return useMemo(
    () => ({
      loadPrivacy,
      privacyLoading,
      loadNotificationSettings,
      notificationSettingsLoading,
      loadSettings,
      loadGeneralSettings,
      generalSettingsLoading,
    }),
    [
      loadPrivacy,
      privacyLoading,
      loadNotificationSettings,
      notificationSettingsLoading,
      loadSettings,
      loadGeneralSettings,
      generalSettingsLoading,
    ],
  );
};
