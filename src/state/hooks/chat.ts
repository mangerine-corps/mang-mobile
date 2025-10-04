import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectChat } from '../reducers/chat.reducer';

export const useChat = () => {
  const chat = useSelector(selectChat);

  return useMemo(
    () => ({
      ...chat,
    }),
    [chat],
  );
};
