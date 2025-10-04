import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentSettings } from '../reducers/setting.reducer';

export const useSetting = () => {
  const values = useSelector(selectCurrentSettings);

  return useMemo(
    () => ({
      ...values,
    }),
    [values],
  );
};
