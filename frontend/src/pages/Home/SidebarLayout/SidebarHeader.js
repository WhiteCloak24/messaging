import React from "react";

const SidebarHeader = () => {
  return (
    <div className="p-6 border-b border-gray-700">
        <ul className="flex">
          <li className="flex items-center space-x-3 p-2 hover:bg-gray-700 hover:text-white rounded cursor-pointer">
            {/* <FaComments className="text-gray-300" /> */}
            <span className="text-lg">Chats</span>
          </li>
          <li className="flex items-center space-x-3 p-2 hover:bg-gray-700 hover:text-white rounded cursor-pointer">
            {/* <FaUsers className="text-gray-300" /> */}
            <span className="text-lg">All Users</span>
          </li>
        </ul>
      </div>
  );
};

export default SidebarHeader;
