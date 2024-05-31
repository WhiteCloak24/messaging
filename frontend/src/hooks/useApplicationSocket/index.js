import { useState, useEffect, useContext, createContext, useMemo } from "react";
import { io } from "socket.io-client";
import customParser from "socket.io-msgpack-parser";

const initialState = {
  socketInstance: null,
  isSocketConnected: false,
  subscribeSocket: () => null,
  unsubscribeChat: () => null,
};

export const SocketContext = createContext(initialState);

export const SocketProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (state.socketInstance) {
      initializeSocket();
    }
  }, [state.socketInstance]);

  useEffect(() => {
    if (state.isSocketConnected) {
      attachListners();
    }
  }, [state.isSocketConnected]);

  // useEffect(() => {
  //   if (state.listenersAttached) {
  //     makeCompanyConnection();
  //   }
  // }, [state.listenersAttached]);

  function subscribeSocket({ socket_url = "", session_id = "", user_id = "" }) {
    // const socketInstance = io(socket_url, {
    //   reconnection: true,
    //   reconnectionDelay: 1000,
    //   reconnectionDelayMax: 5000,
    //   reconnectionAttempts: 99999,
    //   transports: ["websocket"],
    // });
    const socketInstance = io(socket_url, {
      port: 4000,
      transports: ["websocket"],
      auth: {
        token: "aopsidjsoaijdosj",
      },
      parser: customParser,
    });
    setState((prev) => ({
      ...prev,
      socketInstance,
    }));
  }

  function initializeSocket() {
    if (state.socketInstance) {
      const { socketInstance } = state;
      socketInstance.on("connect", () => {
        console.log("Subscribed to socket");
        setState((prev) => ({ ...prev, isSocketConnected: true }));
      });
      socketInstance.on("disconnect", (reason) => {
        if (reason === "io server disconnect" || reason === "transport close") {
          socketInstance.connect();
        }
        console.log("socketInstance disconnected");
      });
      socketInstance.connect();
    }
  }

  function unsubscribeChat() {
    if (state.socketInstance) {
      state.socketInstance.disconnect();
      state.socketInstance.off("connect");
      state.socketInstance.off("disconnect");
    }
  }

  function attachListners() {
    const { socketInstance } = state;
    if (socketInstance?.connected) {
      console.log("Listeners to be attached");
    }
  }

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
