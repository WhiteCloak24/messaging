import React, { useEffect } from "react";
import { useAuthorization } from "../hooks/useAuthorization";
import { AuthorizationEVENTS } from "../resources/constants";
import { Outlet } from "react-router-dom";

const CheckAuthorizationLayout = () => {
  const { user_id } = useAuthorization();
  console.log({ user_id });

  useEffect(() => {
    window.addEventListener(AuthorizationEVENTS.SET_USER_ID, handleSetUser);
    return () => {
      window.removeEventListener(AuthorizationEVENTS.SET_USER_ID, handleSetUser);
    };
  }, []);

  function handleSetUser(data) {
    console.log({ data });
  }
  return <Outlet />;
};

export default CheckAuthorizationLayout;
