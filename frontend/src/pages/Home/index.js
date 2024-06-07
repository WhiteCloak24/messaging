import React from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Home = () => {
  return (
    <div className="flex h-screen">
    <Sidebar />
    <div className="flex flex-col flex-1 border-customBlue border-x">
      <ChatHeader name="Jasmine Thomp" status="Active" />
      <ChatMessages />
      <ChatInput />
    </div>
  </div>
  );
};

export default Home;
