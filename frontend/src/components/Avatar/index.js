import React, { useCallback } from "react";
import { dispatchCustomEventFn, getInitials } from "../../resources/functions";
import { AvatarPreview } from "../../resources/constants";

const Avatar = ({ firstName = "", lastName = "" }) => {
  const handleAvatarClick = useCallback((e) => {
    dispatchCustomEventFn({ eventName: AvatarPreview, eventData: { node: e.target } });
  }, []);
  return (
    <div style={{ width: "40px", height: "40px" }} className="rounded-full" onClick={handleAvatarClick}>
      <div className="h-full w-full rounded-full border flex items-center justify-center bg-purple-700 text-white hover:opacity-70">
        {getInitials({ firstName, lastName })}
      </div>
    </div>
  );
};

export default Avatar;
