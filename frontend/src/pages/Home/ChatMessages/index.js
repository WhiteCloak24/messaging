import React, { useEffect } from "react";
import { useApplicationSocket } from "../../../hooks/useApplicationSocket";
import { formatTime } from "../../../resources/functions";
import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const MessageStatusIconMap = {
  Sent: <IoCheckmarkOutline className="w-full h-full" />,
  Delivered: <IoCheckmarkDoneOutline className="w-full h-full" />,
};
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
              isSent ? "self-end bg-blue-600 text-white" : "self-start bg-white"
            }`}>
            <div className="flex self-start whitespace-pre-wrap break-all">{msg?.message_text}</div>
            <div className={`text-xs ${isSent ? "text-gray-100" : "text-gray-500"} flex self-end min-w-16`}>
              {formatTime({ timestamp: msg?.sent_time })}&nbsp; <span className="w-4 h-4 text-green-200">{MessageStatusIconMap["Delivered"]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ChatMessages;
