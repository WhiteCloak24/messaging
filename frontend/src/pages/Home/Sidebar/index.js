import React from "react";
const contacts = [
  { name: "Jasmine Thomp", status: "Incoming Video Call · 45 min" },
  { name: "Konstantin Frank", status: "But I'm Open To Other Ideas Too · 1 day" },
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
      <div>
        {contacts.map((contact, index) => (
          <div key={index} className="mb-4 py-2 px-4 hover:bg-grey">
            <p className="font-bold">{contact.name}</p>
            <p className="text-sm text-gray-600">{contact.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
