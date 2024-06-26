import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthorization } from "../hooks/useAuthorization";
import { AuthorizationStates } from "../resources/constants";
import { Navigate } from "react-router-dom";
import { useApplicationSocket } from "../hooks/useApplicationSocket";
import QueryRefetcher from "../components/QueryRefetcher";

const AuthorizedLayout = () => {
  const { authorizationState } = useAuthorization();
  const { isSocketConnected, unsubscribeSocket } = useApplicationSocket();

  useEffect(() => {
    return () => {
      if (isSocketConnected) {
        unsubscribeSocket();
      }
    };
  }, [isSocketConnected]);

  if (authorizationState === AuthorizationStates.LOGGED_IN) {
    return (
      <div className="authorized-layout">
        <Outlet />
        <QueryRefetcher />
      </div>
    );
  } else {
    return <Navigate to={"/"} />;
  }
};

export default AuthorizedLayout;
