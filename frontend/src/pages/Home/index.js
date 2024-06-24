import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const Home = () => {
  const [activeChat, setActiveChat] = useState(null);
  return (
    <div className="flex h-screen">
      <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
      <div className="flex flex-col flex-1 border-customBlue border-x">
        <ChatHeader name="Jasmine Thomp" status="Active" activeChat={activeChat} />
        <ChatMessages />
        <ChatInput activeChat={activeChat} />
      </div>
    </div>
  );
};

export default Home;
