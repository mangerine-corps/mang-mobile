import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorData } from '@/utils/types';
import { signUserOut } from '../reducers/user.reducer';
import { useAuth } from './user.hook';
import { useGetJoinedCommunitiesMutation } from '../services/community.service';
import { setJoinedGroups } from '../reducers/groups.reducer';

export const useLoadGroups = () => {
  const { token, user } = useAuth();
  const dispatch = useDispatch();
  const [getJoinedGroups, { isLoading: joinedGroupsLoading }] =
    useGetJoinedCommunitiesMutation();

  const loadJoinedGroups = useCallback(async () => {
    try {
      if (!token || !user) {
        return;
      }
      const response = await getJoinedGroups({});
      if ((response as any)?.error) {
        const err = response as any as ErrorData;
        if (
          err?.error?.data?.message?.toLowerCase()?.includes('login') ||
          err?.error?.data?.message?.toLowerCase()?.includes('unauthorized') ||
          err?.error?.status === 401
        ) {
          dispatch(signUserOut());
          return;
        }
      }
      // console.log('response', JSON.stringify(response));
      dispatch(
        setJoinedGroups({
          groups: (response as any)?.data?.data || [],
        }),
      );
    } catch (error) {
      console.log('joined groups error', JSON.stringify(error));
    }
  }, [dispatch, getJoinedGroups, token, user]);

  return useMemo(
    () => ({
      loadJoinedGroups,
      joinedGroupsLoading,
    }),
    [loadJoinedGroups, joinedGroupsLoading],
  );
};
