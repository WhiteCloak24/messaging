import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthorization } from "../hooks/useAuthorization";
import { AuthorizationStates } from "../resources/constants";

const UnauthorizedLayout = () => {
  const { authorizationState } = useAuthorization();
  if (authorizationState === AuthorizationStates.LOGGED_OUT) {
    return (
      <div className="unauthorized-layout">
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to={"/home"} />;
  }
};

export default UnauthorizedLayout;
