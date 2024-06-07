import React from 'react';
const ChatHeader = ({ name, status }) => {
  return (
    <div className="w-full flex items-center p-4 border-b bg-white">
      <img src="https://via.placeholder.com/40" alt="profile" className="rounded-full mr-4"/>
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-gray-600">{status}</p>
      </div>
    </div>
  );
};
export default ChatHeader;