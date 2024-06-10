import React from "react";
import Avatar from "../../../components/Avatar";
const ChatHeader = ({ name, status }) => {
  return (
    <div className="w-full flex items-center p-4 border-b bg-white">
      <Avatar imgSrc="https://via.placeholder.com/40" />
      {/* <img
        src="https://via.placeholder.com/40"
        alt="profile"
        className="rounded-full mr-4"
      /> */}
      <div className="ml-4">
        <p className="font-bold">{name}</p>
        <p className="text-sm text-gray-600">{status}</p>
      </div>
    </div>
  );
};
export default ChatHeader;
