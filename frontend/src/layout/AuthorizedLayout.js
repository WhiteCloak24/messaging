import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthorization } from "../hooks/useAuthorization";
import { AuthorizationStates } from "../resources/constants";
import { Navigate } from "react-router-dom";

const AuthorizedLayout = () => {
  const { authorizationState } = useAuthorization();

  if (authorizationState === AuthorizationStates.LOGGED_IN) {
    return (
      <div className="authorized-layout">
        <Outlet />
      </div>
    );
  } else {
    return <Navigate to={"/"} />;
  }
};

export default AuthorizedLayout;
