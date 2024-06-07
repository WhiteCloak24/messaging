import React, { useCallback } from "react";
import { dispatchCustomEventFn, getInitials } from "../../resources/functions";
import { AvatarPreview } from "../../resources/constants";

const Avatar = ({ firstName = "", lastName = "" }) => {
  const handleAvatarClick = useCallback((e) => {
    dispatchCustomEventFn({ eventName: AvatarPreview, eventData: { node: e.target } });
  }, []);
  return (
    <div style={{ width: "40px", height: "40px" }} className="rounded-full" onClick={handleAvatarClick}>
      <div className="h-full w-full rounded-full border flex items-center justify-center bg-purple-700 text-white hover:opacity-70 overflow-hidden">
        <img
          className="w-full h-full "
          src={
            "https://media.istockphoto.com/id/1939608350/photo/happy-mature-latin-man-using-laptop-at-home-technology-and-smart-working-concept.jpg?s=1024x1024&w=is&k=20&c=IPtj3EqZe7lDtJu1APOknmDTEJ09GPPxQkaIH9wExlQ="
          }
          alt=""
        />
        {/* {getInitials({ firstName, lastName })} */}
      </div>
    </div>
  );
};

export default Avatar;
