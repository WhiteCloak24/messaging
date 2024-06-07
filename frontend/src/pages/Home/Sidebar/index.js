import React from "react";
import Avatar from "../../../components/Avatar";
const contacts = [
  { name: "Jasmine Thomp", status: "Incoming Video Call · 45 min" },
  { name: "Konstantin Frank", status: "Hey · 1 day" },
  // Add other contacts here...
];
const Sidebar = () => {
  return (
    <div className="w-1/6 bg-white h-screen border-customBlue">
      <div className="flex justify-between items-center p-4">
        <div className="font-bold text-lg">Chats</div>
        <div>
          <div className="text-sm cursor-pointer">+ New</div>
        </div>
      </div>
      <div className="px-4">
        <input type="text" placeholder="Search contact / chat" className="search-chat-input mt-2" />
      </div>
      <div className="flex flex-col gap-1 cursor-pointer">
        {contacts.map((contact, index) => (
          <div key={index} className="py-2 px-4 hover:bg-grey flex gap-2">
            <Avatar size="45" />
            <div>
              <p className="font-semibold text-sm">{contact.name}</p>
              <p className="text-xs text-gray-600">{contact.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
