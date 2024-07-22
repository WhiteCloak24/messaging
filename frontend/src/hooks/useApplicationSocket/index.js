import { useState, useEffect, useContext, createContext, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import customParser from "socket.io-msgpack-parser";
import { AuthorizationEVENTS, RefetchQuery } from "../../resources/constants";
import { dispatchCustomEventFn } from "../../resources/functions";

const initialState = {
  socketInstance: null,
  isSocketConnected: false,
  subscribeSocket: ({ socket_url = "", session_id = "", user_id = "", port = "" }) => null,
  unsubscribeSocket: () => null,
  sendMessage: ({ recipients = [], message = "" }) => null,
  deleteMessage: ({ messageId = "", receiverId = "" }) => null,
  fetchMessageListing: ({ recipientId, socket }) => null,
  setActiveChat: ({ recipientId }) => null,
  user_id: "",
  messageListing: [],
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
      // parser: customParser,
    });
    setState((prev) => ({
      ...prev,
      socketInstance,
      user_id,
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
        setState((prev) => ({ ...prev, isSocketConnected: true }));
        socketInstance.on("chat-update", (data) => {
          if (data?.type === "new-message") {
            new Notification("New Message", {
              body: data?.data?.message || "",
            });
          }
        });
        socketInstance.on("refetch", (data) => {
          if (data?.type === "api") {
            dispatchCustomEventFn({
              eventName: RefetchQuery,
              eventData: {
                queryKey: data?.queryKey,
              },
            });
          }
          if (data?.type === "socket") {
            if (data?.queryKey === "messageListing") {
              if (sessionStorage.getItem("activeChat")) {
                fetchMessageListing({ recipientId: sessionStorage.getItem("activeChat"), socket: socketInstance });
              }
            }
          }
        });
      });
      socketInstance.on("disconnect", (reason) => {
        console.log("Disconnected from the server:", reason);
      });
      socketInstance.connect();
    }
  }, []);

  const unsubscribeSocket = useCallback(() => {
    if (state.socketInstance) {
      state.socketInstance.disconnect();
      state.socketInstance.off("connect");
      state.socketInstance.off("disconnect");
    }
  }, [state.socketInstance]);

  const attachListeners = useCallback(() => {
    const { socketInstance } = state;
    if (socketInstance?.connected) {
      socketInstance.on("jwt-token", (data) => {
        dispatchCustomEventFn({ eventName: AuthorizationEVENTS.SET_TOKEN, eventData: { jwt_token: data?.jwt_token } });
      });
      socketInstance.on("user-logout", (data) => {
        console.log("user-logout", data);
        dispatchCustomEventFn({ eventName: AuthorizationEVENTS.LOGGED_OUT, eventData: data });
      });
    }
  }, [state.socketInstance]);

  const sendMessage = useCallback(
    ({ recipients = [], message = "", attachments = [] }) => {
      if (recipients.length > 0) {
        const payload = {
          message,
          recipients,
          attachments,
        };
        state.socketInstance.emit("send-message", payload);
      }
    },
    [state.socketInstance]
  );
  const deleteMessage = useCallback(
    ({ messageId = "", receiverId = "" }) => {
      if (messageId && receiverId) {
        const payload = {
          messageId,
          receiverId,
        };
        state.socketInstance.emit("delete-message", payload);
      }
    },
    [state.socketInstance]
  );
  const fetchMessageListing = useCallback(
    ({ recipientId = "", socket }) => {
      const payload = {
        recipientId,
      };
      if (!socket) {
        setState((prev) => ({ ...prev, messageListing: [] }));
      }
      const socketEmitter = socket || state.socketInstance;
      socketEmitter.emit("message-listing", payload, ({ data = [] }) => {
        setState((prev) => ({ ...prev, messageListing: data }));
      });
    },
    [state.socketInstance]
  );
  const setActiveChat = useCallback(
    ({ recipientId = "" }) => {
      const payload = {
        recipientId,
      };
      state.socketInstance.emit("active-chat", payload);
    },
    [state.socketInstance]
  );

  return (
    <SocketContext.Provider
      value={{
        ...state,
        subscribeSocket,
        unsubscribeSocket,
        sendMessage,
        fetchMessageListing,
        setActiveChat,
        deleteMessage,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useApplicationSocket = () => useContext(SocketContext);
