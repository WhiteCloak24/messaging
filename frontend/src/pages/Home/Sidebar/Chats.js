import React from "react";
import { chatListing } from "../../../api-service";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import Avatar from "../../../components/Avatar";

const Chats = ({ activeChat = {}, setActiveChat = () => null }) => {
  const { data: chatList = [] } = useListingWrapper({ queryFn: chatListing });
  return (
    <div>
      <div className="px-4 font-semibold">All Chats ({chatList?.length})</div>
      {chatList.map((user) => (
        <div
          key={user?.friend_id}
          className={`py-2 px-4 hover:bg-grey ${activeChat?.user_id === user?.user_id ? "bg-grey" : ""} flex gap-2 cursor-pointer`}
          onClick={() => setActiveChat(user)}>
          <Avatar firstName={user?.user_name} size="45" />
          <div>
            <p className="font-semibold text-sm">{user.user_name}</p>
            {/* <p className="text-xs text-gray-600">{user.status}</p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
