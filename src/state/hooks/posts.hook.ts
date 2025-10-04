import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectPostsValues } from '../reducers/posts.reducer';

export const usePosts = () => {
  const postsValues = useSelector(selectPostsValues);

  return useMemo(
    () => ({
      ...postsValues,
    }),
    [postsValues],
  );
};
