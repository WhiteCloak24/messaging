import React from "react";
const messages = [
  { type: "sent", content: "I hope these article helps.", time: "May 10, 2022, 11:14 AM" },
  { type: "sent", content: "I hope these article helps.", time: "May 10, 2022, 11:14 AM" },
  { type: "received", content: "https://www.envato.com/atomic-power-plant-engine/", time: "May 10, 2022, 11:14 AM" },

  // Add other messages here...
];
const ChatMessages = () => {
  return (
    <div className="flex-1 p-4 overflow-y-scroll flex flex-col">
      {/* {messages.map((msg, index) => (
        <div key={index} className={`mb-4 w-fit h-fit rounded-md ${msg.type === "sent" ? "self-end" : "self-start"}`}>
          <p className={`inline-block p-2 rounded  ${msg.type === "sent" ? " bg-white" : "bg-customDarkblue text-white"}`}>{msg.content}</p>
          <p className="text-xs text-gray-500">{msg.time}</p>
        </div>
      ))} */}
    </div>
  );
};
export default ChatMessages;
