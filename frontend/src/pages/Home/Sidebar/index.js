import React from "react";
import Avatar from "../../../components/Avatar";
import UserListing from "./UserListing";
const contacts = [
  { name: "Jasmine Thomp", status: "Incoming Video Call · 45 min" },
  { name: "Konstantin Frank", status: "Hey · 1 day" },
  // Add other contacts here...
];
const Sidebar = () => {
  return (
    <div className="w-1/6 bg-white h-screen border-customBlue flex flex-col">
      <div className="flex justify-between items-center p-4">
        <div className="font-bold text-lg">Chats</div>
        <div>
          <div className="text-sm cursor-pointer">+ New</div>
        </div>
      </div>
      <div className="px-4">
        <input type="text" placeholder="Search contact / chat" className="search-chat-input mt-2" />
      </div>
      <div className="flex flex-col gap-1 cursor-pointer overflow-y-auto h-full">
        <UserListing />
      </div>
    </div>
  );
};
export default Sidebar;
