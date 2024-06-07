import React from "react";
import { getInitials } from "../../resources/functions";

const Avatar = ({ firstName = "", lastName = "" }) => {
  return (
    <div style={{ width: "40px", height: "40px" }} className="rounded-full">
      <div className="h-full w-full rounded-full border flex items-center justify-center bg-purple-700 text-white hover:opacity-70">{getInitials({ firstName, lastName })}</div>
    </div>
  );
};

export default Avatar;
