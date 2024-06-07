import React from "react";
import { FiPlus } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { FaSmile, FaMicrophone, FaTelegramPlane } from "react-icons/fa";
const ChatInput = () => {
  return (
    <div className="w-full flex p-4 border-t bg-white items-center gap-3">
      <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-amber-700">
        <FiPlus />
      </div>
      <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-blue-300">
        <FaRegImage />
      </div>
      <div className="bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:text-yellow-600">
        <FaSmile />
      </div>
      <input type="text" placeholder="Type a message..." className="flex-1 p-2 rounded border" />
      <div className="cursor-pointer">
        <FaMicrophone />
      </div>
      <div className="cursor-pointer">
        <FaTelegramPlane />
      </div>
    </div>
  );
};
export default ChatInput;
