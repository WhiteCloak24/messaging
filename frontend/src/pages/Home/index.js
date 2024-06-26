import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import HomeIconCanvas from "./HomeIconCanvas";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const [activeChat, setActiveChat] = useState(null);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  return (
    <div className="flex h-screen">
      <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
      {isDesktop && (
        <>
          {!activeChat ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-10">
              <div>
                <HomeIconCanvas size={200} />
              </div>
              <div className="text-blue-600 font-semibold text-3xl">
                Select any chat to start,
                <br /> conversation...
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 border-customBlue border-x">
              <ChatHeader status="Active" activeChat={activeChat} />
              <ChatMessages activeChat={activeChat} />
              <ChatInput activeChat={activeChat} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
