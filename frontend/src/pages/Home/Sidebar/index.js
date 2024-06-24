import React, { useState } from "react";
import Avatar from "../../../components/Avatar";
import UserListing from "./UserListing";
import Chats from "./Chats";
import { IoArrowBack } from "react-icons/io5";

const Sidebar = ({ activeChat, setActiveChat }) => {
  const [showChats, setShowChats] = useState(true);
  return (
    <div className="w-1/6 bg-white h-screen border-customBlue flex flex-col">
      <div className="flex justify-between items-center p-4">
        <div className="font-bold text-lg">Chats</div>
        <div>
          <div className="text-sm cursor-pointer" onClick={() => setShowChats((prev) => !prev)}>
            {showChats ? "+ New" : <IoArrowBack />}
          </div>
        </div>
      </div>
      <div className="px-4">
        <input type="text" placeholder="Search contact / chat" className="search-chat-input mt-2" />
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto h-full">
        {showChats ? (
          <Chats activeChat={activeChat} setActiveChat={setActiveChat} />
        ) : (
          <UserListing activeChat={activeChat} setActiveChat={setActiveChat} />
        )}
      </div>
    </div>
  );
};
export default Sidebar;
