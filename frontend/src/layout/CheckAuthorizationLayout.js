import React, { useEffect } from "react";
import { useAuthorization } from "../hooks/useAuthorization";
import { AuthorizationEVENTS } from "../resources/constants";
import { Outlet } from "react-router-dom";

const CheckAuthorizationLayout = () => {
  const { user_id, setUserId } = useAuthorization();
  useEffect(() => {
    window.addEventListener(AuthorizationEVENTS.SET_USER_ID, handleSetUser);
    window.addEventListener(AuthorizationEVENTS.LOGGED_OUT, handleLogout);
    return () => {
      window.removeEventListener(AuthorizationEVENTS.SET_USER_ID, handleSetUser);
      window.removeEventListener(AuthorizationEVENTS.LOGGED_OUT, handleLogout);
    };
  }, []);

  function handleSetUser(e) {
    if (e?.detail?.user_id) {
      localStorage.user_id = e?.detail?.user_id;
      setUserId({ user_id: e?.detail?.user_id });
    }
  }
  function handleLogout(e) {
      localStorage.clear()
      // setUserId({ user_id: e?.detail?.user_id });
  }
  console.log({ user_id });
  return <Outlet />;
};

export default CheckAuthorizationLayout;
