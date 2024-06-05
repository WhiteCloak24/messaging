import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthorization } from "../hooks/useAuthorization";
import { AlertEVENTS, AuthorizationStates } from "../resources/constants";
import { dispatchCustomEventFn } from "../resources/functions";

const UnauthorizedLayout = () => {
  const { authorizationState } = useAuthorization();
  if (authorizationState === AuthorizationStates.LOGGED_OUT) {
    return (
      <div className="unauthorized-layout">
        <div
          onClick={() => {
            dispatchCustomEventFn({
              eventName: AlertEVENTS.ALERT,
              eventData: {
                type: "error",
                timeout: 5000,
                message: "Something went wrong",
              },
            });
          }}>
          asldhs
        </div>
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to={"/home"} />;
  }
};

export default UnauthorizedLayout;
