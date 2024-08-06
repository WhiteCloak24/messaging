import React from "react";
import ProfileSidebar from "./ProfileSidebar";

const Profile = () => {
  return (
    <div className="flex h-screen">
      <ProfileSidebar />
      <>
        <div className="w-full h-full flex flex-col items-center justify-center gap-10"></div>
      </>
    </div>
  );
};

export default Profile;
