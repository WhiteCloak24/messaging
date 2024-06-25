import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import HomeIconCanvas from "./HomeIconCanvas";
import Modal from "../../components/Modal/Modal";

const Home = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex h-screen">
      <Sidebar activeChat={activeChat} setActiveChat={setActiveChat} />
      {!activeChat ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-10">
          <div>
            <HomeIconCanvas size={200} />
          </div>
          <div className="text-blue-600 font-semibold text-3xl">
            Select any chat to start,
            <br /> conversation...
          </div>
          <div className="cursor-pointer" onClick={() => setOpenModal((prev) => !prev)}>
            Open Modal
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 border-customBlue border-x">
          <ChatHeader status="Active" activeChat={activeChat} />
          <ChatMessages activeChat={activeChat} />
          <ChatInput activeChat={activeChat} />
        </div>
      )}

      {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>This is Modal Heading</div>
      </Modal> */}
    </div>
  );
};

export default Home;
