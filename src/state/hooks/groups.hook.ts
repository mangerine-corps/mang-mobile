import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectGroupValues } from '../reducers/groups.reducer';

export const useGroups = () => {
  const groupValues = useSelector(selectGroupValues);

  return useMemo(
    () => ({
      ...groupValues,
    }),
    [groupValues],
  );
};
