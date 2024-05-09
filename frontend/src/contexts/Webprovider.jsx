import { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const newSocket = io('http://192.168.2.250:8001'); // Establish WebSocket connection
    setSocket(newSocket);

    // Handle WebSocket connection established
    newSocket.on('connect', () => {
      setIsLoading(false); // Set loading state to false when WebSocket connection is established
    });

    return () => {
      newSocket.close(); // Close WebSocket connection on unmount
    };
  }, []);

  // Render loading indicator while waiting for WebSocket connection to be established
  if (isLoading) {
    return null
  }

  // Render children with WebSocket context value once it's available
  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketProvider, WebSocketContext };
