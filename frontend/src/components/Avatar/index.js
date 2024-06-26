import React, { useCallback } from "react";
import { dispatchCustomEventFn, getInitials } from "../../resources/functions";
import { AvatarPreview } from "../../resources/constants";

const Avatar = ({ firstName = "", lastName = "", size = "40", imgSrc = "" }) => {
  const handleAvatarClick = useCallback((e) => {
    dispatchCustomEventFn({ eventName: AvatarPreview, eventData: { node: e.target } });
  }, []);
  return (
    <div style={{ width: `${size}px`, height: `${size}px` }} className="rounded-md" onClick={handleAvatarClick}>
      <div className="h-full w-full rounded-md border flex items-center justify-center bg-purple-700 text-white hover:opacity-70 overflow-hidden">
        {imgSrc ? <img className="w-full h-full " src={imgSrc} alt="" /> : <>{getInitials({ firstName, lastName })} </>}
      </div>
    </div>
  );
};

export default Avatar;
