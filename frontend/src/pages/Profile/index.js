import React from "react";
import ProfileSidebar from "./ProfileSidebar";

const Profile = ({children}) => {
  return (
    <div className="flex h-full">
      <ProfileSidebar />
      {children}
    </div>
  );
};

export default Profile;
