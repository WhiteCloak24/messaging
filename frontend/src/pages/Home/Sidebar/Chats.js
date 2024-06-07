import React from "react";
import { chatListing } from "../../../api-service";

const Chats = () => {
  const { data: chatList = [] } = useListingWrapper({ queryFn: chatListing });

  return (
    <div>
      <div className="px-4 font-semibold">All Users ({chatList?.length})</div>
      {chatList.map((user, index) => (
        <div key={index} className="py-2 px-4 hover:bg-grey flex gap-2">
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
