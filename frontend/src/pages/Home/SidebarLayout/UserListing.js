import React from "react";
import Avatar from "../../../components/Avatar";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import { userListing } from "../../../api-service";

const UserListing = () => {
  const { data: userList } = useListingWrapper({ queryFn: userListing, queryKey: ["userListing"] });

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col">
        {userList &&
          userList.map((user) => {
            return (
              <div className="p-2 hover:bg-gray-400 rounded cursor-pointer border-y flex">
                <Avatar firstName="Yash" />
                <div className="flex flex-col">
                  <div>{user?.user_name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UserListing;
