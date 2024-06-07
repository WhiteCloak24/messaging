import React from "react";
const ChatInput = () => {
  return (
    <div className="w-full flex p-4 border-t bg-white">
      {" "}
      <input type="text" placeholder="Type a message..." className="flex-1 p-2 rounded border" />{" "}
      <button className="ml-4 p-2 bg-blue-500 text-white rounded">Send</button>{" "}
    </div>
  );
};
export default ChatInput;
