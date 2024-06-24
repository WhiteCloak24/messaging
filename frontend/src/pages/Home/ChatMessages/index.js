import React, { useEffect } from "react";
import { useApplicationSocket } from "../../../hooks/useApplicationSocket";
import { formatDate } from "../../../resources/functions";

const ChatMessages = ({ activeChat = {} }) => {
  const { fetchMessageListing, messageListing, user_id } = useApplicationSocket();
  useEffect(() => {
    fetchMessageListing({ recipientId: activeChat?.user_id });
  }, [activeChat?.user_id]);

  return (
    <div className="flex-1 p-4 overflow-y-scroll flex flex-col">
      {messageListing.map((msg, index) => {
        const { chat_id = "" } = msg || {};
        const isSent = user_id === msg?.sender_id;
        return (
          <div key={chat_id} className={`mb-4 w-fit h-fit rounded-md ${isSent ? "self-end" : "self-start"}`}>
            <p className={`inline-block p-2 rounded  ${isSent ? " bg-white" : "bg-customDarkblue text-white"}`}>{msg?.message_text}</p>
            <p className="text-xs text-gray-500">{formatDate({ timestamp: msg?.sent_time })}</p>
          </div>
        );
      })}
    </div>
  );
};
export default ChatMessages;
