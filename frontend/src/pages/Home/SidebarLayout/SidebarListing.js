import React from "react";
import Avatar from "../../../components/Avatar";

const SidebarListing = () => {
  return (
    <div className="flex-grow overflow-y-auto p-6">
      <div className="flex flex-col">
        <div className="p-2 hover:bg-gray-400 rounded cursor-pointer border-y flex">
          <Avatar firstName="Yash" />
        </div>
        <div className="p-2 hover:bg-gray-400 rounded cursor-pointer border-y flex">
          <Avatar firstName="Yash" />
        </div>
        <div className="p-2 hover:bg-gray-400 rounded cursor-pointer border-y flex">
          <Avatar firstName="Yash" />
        </div>
        <div className="p-2 hover:bg-gray-400 rounded cursor-pointer border-y flex">
          <Avatar firstName="Yash" />
        </div>
      </div>
    </div>
  );
};

export default SidebarListing;
