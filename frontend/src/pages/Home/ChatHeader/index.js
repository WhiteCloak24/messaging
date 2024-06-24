import React, { useMemo } from "react";
import Avatar from "../../../components/Avatar";
const ChatHeader = ({ status, activeChat = {} }) => {
  const { user_name = "" } = useMemo(() => activeChat || {}, [activeChat?.user_id]);
  return (
    <div className="w-full flex items-center p-4 border-b bg-white">
      <Avatar imgSrc="https://via.placeholder.com/40" />
      {/* <img
        src="https://via.placeholder.com/40"
        alt="profile"
        className="rounded-full mr-4"
      /> */}
      <div className="ml-4">
        <p className="font-bold">{user_name}</p>
        <p className="text-sm text-gray-600">{status}</p>
      </div>
    </div>
  );
};
export default ChatHeader;
