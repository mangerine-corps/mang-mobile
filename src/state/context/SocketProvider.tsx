/**
 * Socket Provider
 */
import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { getUrl } from '@/utils/helpers';
import { useAuth } from '@/state/hooks/user.hook';

const SOCKET_DEV = getUrl();

export const SocketContext = React.createContext<{
  socket: Socket | null | undefined;
}>({
  socket: null,
});

/**
 * connectionConfig
 */
const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ['websocket'],
};

/**
 * SocketProvider
 * @param {*} param0
 * @returns
 */

interface ProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: ProviderProps) => {
  const { token } = useAuth();
  const env = SOCKET_DEV;
  const socket = useRef<Socket>(null);

  useEffect(() => {
    if (token) {
      socket.current = socketIOClient(env, {
        ...connectionConfig,
        extraHeaders: {
          Authorization: `Bearer ${token}`,
          token: token,
        },
        auth: {
          token,
        },
      });
      socket.current?.on('connect', () => {
        console.log('socket provider connected');
      });

      socket.current?.on('disconnect', msg => {
        console.log('socket disconnect:', msg);
        socket.current = socketIOClient(env, connectionConfig);
      });
    }

    return () => {
      if (socket && socket.current) {
        socket?.current?.removeAllListeners();
        socket?.current?.close();
      }
    };
  }, [env, token]);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
