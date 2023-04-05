import React, { createContext, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';

/**
 * Creates a socket.io client that connects to the server. Replace url with your server URL
 * Make sure to enable Cross-Origin Resource Sharing (CORS) on the server
 * The options parameter is optional and can be used to configure the connection
 */
const socket = io('http://localhost:3000', {});
socket.on('connect', () => {
  console.log('Socket connected', socket.id);
});
socket.on('disconnect', (reason) => {
  console.log('Socket disconnected due to', reason);
});
socket.on('connect_error', () => {
  setTimeout(() => {
    socket.connect();
  }, 1000);
});

// React context for socket
const SocketContext = createContext({
  onSocketEvent: () => {},
  emitSocketEvent: () => {},
});

function SocketProvider({ children }) {
  const onSocketEvent = (event, callback) => {
    if (socket.connected) {
      socket.on(event, () => {
        socket.off(event);
        callback();
      });
    }
  };

  const emitSocketEvent = (event, args = {}, callback = () => {}) => {
    if (socket.connected) {
      socket.emit(event, args, () => {
        console.log('Successfully emitted an event named -', event);
        callback();
      });
    }
  };

  const value = useMemo(() => (
    {
      onSocketEvent,
      emitSocketEvent,
    }
  ), []);

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
