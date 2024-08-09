import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuthorization } from "../hooks/useAuthorization";
import { AuthorizationStates } from "../resources/constants";
import { Navigate } from "react-router-dom";
import { useApplicationSocket } from "../hooks/useApplicationSocket";
import QueryRefetcher from "../components/QueryRefetcher";
import { userDetails } from "../api-service";
import useListingWrapper from "../hooks/Apis/useListingWrapper";

const AuthorizedLayout = () => {
  const { authorizationState } = useAuthorization();
  const { isSocketConnected, unsubscribeSocket } = useApplicationSocket();
  const { data: userData = {} } = useListingWrapper({ queryFn: userDetails, resourceKeys: [{ name: "profile_pic", type: "profile" }] });

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
        <Outlet context={{ userData }} />
        <QueryRefetcher />
      </div>
    );
  } else {
    return <Navigate to={"/"} />;
  }
};

export default AuthorizedLayout;
