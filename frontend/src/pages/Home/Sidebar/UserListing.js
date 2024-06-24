import React from "react";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import { userListing } from "../../../api-service";
import Avatar from "../../../components/Avatar";

const UserListing = ({ activeChat, setActiveChat }) => {
  const { data: userList = [] } = useListingWrapper({ queryFn: userListing });
  console.log(userList);
  return (
    <div>
      <div className="px-4 font-semibold">All Users ({userList?.length})</div>
      {userList.map((user, index) => (
        <div key={index} className={`py-2 px-4 hover:bg-grey ${activeChat?.user_id === user?.user_id ? 'bg-grey' : ''} flex gap-2 cursor-pointer`} onClick={() => setActiveChat(user)}>
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

export default UserListing;
