import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

/**
 * Creates a socket.io client that connects to the server
 * Make sure to enable Cross-Origin Resource Sharing (CORS) on the server
 * The options parameter is optional and can be used to configure the connection
 */
const socket = io('http://localhost:5000', {}); // Replace url with your server URL

// React context for web socket data
const SocketContext = createContext({
  onSocketEvent: () => {},
  emitSocketEvent: () => {},
});

function SocketProvider({ children }) {
  const [socketID, setSocketID] = useState('');

  const onSocketEvent = useCallback((event, callback) => {
    if (socket.connected) {
      socket.on(event, () => {
        socket.off(event);
        callback();
      });
    }
  }, []);

  const emitSocketEvent = useCallback((event, args = {}, callback = () => {}) => {
    if (socket.connected) {
      socket.emit(event, args, () => {
        console.log('[Socket] - emit event', event);
        callback();
      });
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('[Socket] - connected', socket);
      console.log('[Socket] - socket id', socket.id);
      setSocketID(socket.id);
      socket.on('post_inspection', (data) => {
        console.log('[Socket] - listen post_inspection event from server', data);
      });
    });
    socket.on('disconnect', (reason) => {
      console.log('[Socket] - disconnected due to', reason);
    });
    socket.on('connect_error', () => {
      console.log('[Socket] - has a connection error');
      setTimeout(() => {
        socket.connect();
      }, 1000);
    });
  }, []);

  const value = useMemo(() => (
    {
      socketID,
      onSocketEvent,
      emitSocketEvent,
    }
  ), [socketID]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

const useWebSocket = () => useContext(SocketContext);

export {
  useWebSocket,
  SocketProvider,
};
