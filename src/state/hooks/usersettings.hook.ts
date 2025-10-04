import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectSettingsValues } from '../reducers/usersettings.reducer';

export const useUserSettings = () => {
  const settingValues = useSelector(selectSettingsValues);

  return useMemo(
    () => ({
      ...settingValues,
    }),
    [settingValues],
  );
};
