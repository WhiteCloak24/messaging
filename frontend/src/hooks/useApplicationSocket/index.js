import { useState, useEffect, useContext, createContext, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import customParser from "socket.io-msgpack-parser";

const initialState = {
  socketInstance: null,
  isSocketConnected: false,
  subscribeSocket: ({ socket_url = "", session_id = "", user_id = "" }) => null,
  unsubscribeChat: () => null,
};

export const SocketContext = createContext(initialState);

export const SocketProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (state.socketInstance) {
      initializeSocket({ socketInstance: state.socketInstance });
    }
  }, [state.socketInstance]);

  useEffect(() => {
    if (state.isSocketConnected) {
      attachListeners();
    }
  }, [state.isSocketConnected]);

  const subscribeSocket = useCallback(({ socket_url = "", session_id = "", user_id = "" }) => {
    const socketInstance = io(socket_url, {
      port: 4000,
      transports: ["websocket"],
      auth: {
        token: session_id,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      parser: customParser,
    });
    setState((prev) => ({
      ...prev,
      socketInstance,
    }));
  }, []);

  const initializeSocket = useCallback(({ socketInstance = null }) => {
    if (socketInstance) {
      socketInstance.on("connect", () => {
        console.log("Subscribed to socket");
        setState((prev) => ({ ...prev, isSocketConnected: true }));
      });
      socketInstance.on("disconnect", (reason) => {
        if (reason === "io server disconnect" || reason === "transport close") {
          console.log("socketInstance disconnected ==", reason);
          socketInstance.connect();
        }
      });
      socketInstance.connect();
    }
  }, []);

  const unsubscribeChat = useCallback(() => {
    if (state.socketInstance) {
      state.socketInstance.disconnect();
      state.socketInstance.off("connect");
      state.socketInstance.off("disconnect");
    }
  }, [state.socketInstance]);

  const attachListeners = useCallback(() => {
    const { socketInstance } = state;
    if (socketInstance?.connected) {
      console.log("Listeners to be attached");
    }
  }, [state.socketInstance]);

  return (
    <SocketContext.Provider
      value={{
        ...state,
        subscribeSocket,
        unsubscribeChat,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useApplicationSocket = () => useContext(SocketContext);
