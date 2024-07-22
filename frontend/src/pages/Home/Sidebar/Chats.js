import React from "react";
import { chatListing } from "../../../api-service";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import Avatar from "../../../components/Avatar";
import { getTimeFromNow } from "../../../resources/functions";

const Chats = ({ activeChat = {}, setActiveChat = () => null }) => {
  const { data: chatList = [] } = useListingWrapper({ queryFn: chatListing });

  return (
    <div>
      <div className="px-4 font-semibold">All Chats ({chatList?.length})</div>
      {chatList.map((user) => {
        return (
          <div
            key={user?.user_id}
            className={`py-2 px-4 hover:bg-grey ${activeChat?.user_id === user?.user_id ? "bg-grey" : ""} justify-between flex gap-2 cursor-pointer`}
            onClick={() => {
              sessionStorage.setItem("activeChat", user?.user_id);
              setActiveChat(user);
            }}>
            <div className="flex gap-2">
              <Avatar firstName={user?.user_name} size="45" />
              <div>
                <p className="font-semibold text-md">{user.user_name}</p>
                <p className="text-sm text-gray-600">{user.last_message}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs ml-auto">{getTimeFromNow({ timestamp: user?.friend_last_message_time })}</div>
              {/* {user?.unread > 0 && (
                <div className="flex self-center items-center ml-auto bg-blue-600 text-white text-xs rounded-full p-2 w-5 h-5 justify-center">
                  {user?.unread}
                </div>
              )} */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
