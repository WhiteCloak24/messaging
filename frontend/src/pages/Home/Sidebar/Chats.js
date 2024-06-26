import React from "react";
import { chatListing } from "../../../api-service";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import Avatar from "../../../components/Avatar";
import { formatDate } from "../../../resources/functions";

const Chats = ({ activeChat = {}, setActiveChat = () => null }) => {
  const { data: chatList = [] } = useListingWrapper({ queryFn: chatListing });
  return (
    <div>
      <div className="px-4 font-semibold">All Chats ({chatList?.length})</div>
      {chatList.map((user) => {
        console.log(user);
        return (
          <div
            key={user?.friend_id}
            className={`py-2 px-4 hover:bg-grey ${activeChat?.user_id === user?.user_id ? "bg-grey" : ""} flex gap-2 cursor-pointer`}
            onClick={() => setActiveChat(user)}>
            <Avatar firstName={user?.user_name} size="45" />
            <div>
              <p className="font-semibold text-md">{user.user_name}</p>
              <p className="text-sm text-gray-600">{user.last_message}</p>
            </div>
            <div className="text-xs ml-auto">{formatDate({ timestamp: user?.friend_last_message_time })}</div>
            {user?.unread > 0 && (
              <div className="flex self-center items-center ml-auto bg-blue-600 text-white text-xs rounded-full p-2 w-6 h-6 justify-center">
                {user?.unread}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
