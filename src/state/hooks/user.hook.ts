import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthValues } from '../reducers/user.reducer';

export const useAuth = () => {
  const authValues = useSelector(selectAuthValues);

  return useMemo(
    () => ({
      ...authValues,
    }),
    [authValues],
  );
};
