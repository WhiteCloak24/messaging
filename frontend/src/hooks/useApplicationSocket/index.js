import { useState, useEffect, useContext, createContext, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import customParser from "socket.io-msgpack-parser";
import { AuthorizationEVENTS } from "../../resources/constants";
import { dispatchCustomEventFn } from "../../resources/functions";

const initialState = {
  socketInstance: null,
  isSocketConnected: false,
  subscribeSocket: ({ socket_url = "", session_id = "", user_id = "", port = "" }) => null,
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

  const subscribeSocket = useCallback(({ socket_url = "", user_id = "", session_id = "" }) => {
    const socketInstance = io(socket_url, {
      transports: ["websocket"],
      auth: {
        user_id,
        session_id,
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
      socketInstance.on("connect_error", (err) => {
        socketInstance.disconnect();
        if (err.message === "Authentication error") {
          console.error("Authentication failed:", err.data.content);
        } else {
          console.error("Connection error:", err.message);
        }
      });
      socketInstance.on("connect", () => {
        console.log("Subscribed to socket");
        setState((prev) => ({ ...prev, isSocketConnected: true }));
      });
      socketInstance.on("disconnect", (reason) => {
        console.log("Disconnected from the server:", reason);
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
      socketInstance.on("jwt-token", (data) => {
        console.log("jwt-token", data);
        dispatchCustomEventFn({ eventName: AuthorizationEVENTS.SET_TOKEN, eventData: { jwt_token: data?.jwt_token } });
      });
      socketInstance.on("user-logout", (data) => {
        console.log("user-logout", data);
        dispatchCustomEventFn({ eventName: AuthorizationEVENTS.LOGGED_OUT, eventData: data });
      });
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
