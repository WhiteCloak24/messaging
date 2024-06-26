import React, { useEffect } from "react";
import { useApplicationSocket } from "../../../hooks/useApplicationSocket";
import { formatTime } from "../../../resources/functions";

const ChatMessages = ({ activeChat = {} }) => {
  const { fetchMessageListing, messageListing, user_id, setActiveChat } = useApplicationSocket();
  useEffect(() => {
    fetchMessageListing({ recipientId: activeChat?.user_id });
    setActiveChat({ recipientId: activeChat?.user_id });
  }, [activeChat?.user_id]);

  return (
    <div className="flex-1 p-4 overflow-y-scroll flex flex-col">
      {messageListing.map((msg) => {
        const { chat_id = "" } = msg || {};
        const isSent = user_id === msg?.sender_id;
        return (
          <div
            key={chat_id}
            className={`mb-4 w-fit h-fit px-4 py-2 flex gap-4 max-w-[60%] rounded-md ${
              isSent ? "self-end bg-customDarkblue text-white" : "self-start bg-white"
            }`}>
            <div className="flex self-start whitespace-pre-wrap break-all">{msg?.message_text}</div>
            <div className={`text-xs ${isSent ? "text-gray-100" : "text-gray-500"} flex self-end min-w-14`}>{formatTime({ timestamp: msg?.sent_time })}</div>
          </div>
        );
      })}
    </div>
  );
};
export default ChatMessages;
