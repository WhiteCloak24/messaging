import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import HomeIconCanvas from "./HomeIconCanvas";

const Home = () => {
  const [activeChat, setActiveChat] = useState(null);
  return (
    <div className="flex h-screen">
      <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
      {!activeChat ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-10">
          <div>
            <HomeIconCanvas size={300} />
          </div>
          <div className="text-blue-600 font-semibold text-3xl">
            Select any chat to start,
            <br /> conversation...
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 border-customBlue border-x">
          <ChatHeader name="Jasmine Thomp" status="Active" activeChat={activeChat} />
          <ChatMessages />
          <ChatInput activeChat={activeChat} />
        </div>
      )}
    </div>
  );
};

export default Home;
