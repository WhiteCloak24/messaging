import React, { useState } from "react";
import Avatar from "../../../components/Avatar";
import UserListing from "./UserListing";
import Chats from "./Chats";
import { IoArrowBack } from "react-icons/io5";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import { userDetails } from "../../../api-service";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeChat, setActiveChat }) => {
  const navigate = useNavigate();
  const [showChats, setShowChats] = useState(true);
  const { data: userData } = useListingWrapper({ queryFn: userDetails });

  return (
    <div className="w-3/12 min-w-80 bg-white border-customBlue flex flex-col m-4 rounded-xl">
      <div
        className="p-4 flex gap-2 cursor-pointer hover:opacity-70 max-w-fit"
        onClick={() => {
          navigate("/profile/general-settings");
        }}>
        <Avatar firstName={userData?.user_name} imgName={userData?.profile_pic} />
        <div className="flex flex-col">
          <div>{userData?.user_name}</div>
          <div className="text-xs text-gray-500">View profile settings</div>
        </div>
      </div>
      <div className="flex justify-between items-center p-4">
        <div className="font-bold text-lg">Chats</div>
        <div>
          <div
            className="text-sm cursor-pointer"
            onClick={() => {
              setActiveChat(null);
              setShowChats((prev) => !prev);
            }}>
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
