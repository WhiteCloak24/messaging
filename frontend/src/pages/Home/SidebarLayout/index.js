import React from "react";
import SidebarHeader from "./SidebarHeader";
import UserListing from "./UserListing";

const SidebarLayout = () => {
  return (
    <div className="border w-1/5 flex flex-col">
      <SidebarHeader />
      <UserListing />
    </div>
  );
};

export default SidebarLayout;
