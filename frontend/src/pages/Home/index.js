import React from "react";
import SidebarLayout from "./SidebarLayout";
import BoardLayout from "./BoardLayout";

const Home = () => {
  return (
    <div className="h-full flex">
      <SidebarLayout />
      <BoardLayout />
    </div>
  );
};

export default Home;
