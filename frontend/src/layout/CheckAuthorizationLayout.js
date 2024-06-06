import React, { useEffect } from "react";
import { useAuthorization } from "../hooks/useAuthorization";
import { AlertEVENTS, AuthorizationEVENTS, AuthorizationStates } from "../resources/constants";
import { Outlet } from "react-router-dom";
import { useApplicationSocket } from "../hooks/useApplicationSocket";
import FullPageLoader from "../components/FullPageLoader";
import { dispatchCustomEventFn } from "../resources/functions";

const CheckAuthorizationLayout = () => {
  const { user_id, authorizationState, setUserId, setAuthorizationState, setXAuthToken } = useAuthorization();
  const { subscribeSocket } = useApplicationSocket();

  useEffect(() => {
    window.addEventListener(AuthorizationEVENTS.SET_USER_ID, handleSetUser);
    window.addEventListener(AuthorizationEVENTS.LOGGED_OUT, handleLogout);
    window.addEventListener(AuthorizationEVENTS.SET_TOKEN, handleSetToken);
    return () => {
      window.removeEventListener(AuthorizationEVENTS.SET_USER_ID, handleSetUser);
      window.removeEventListener(AuthorizationEVENTS.LOGGED_OUT, handleLogout);
      window.removeEventListener(AuthorizationEVENTS.SET_TOKEN, handleSetToken);
    };
  }, []);

  useEffect(() => {
    if (authorizationState === AuthorizationStates.LOGGING_IN && user_id) {
      subscribeSocket({ socket_url: process.env.REACT_APP_SOCKET_URL, user_id: user_id });
    }
  }, [authorizationState, user_id]);

  function handleSetToken(e) {
    if (e?.detail?.jwt_token) {
      setXAuthToken({ token: e.detail.jwt_token });
      setAuthorizationState({ state: AuthorizationStates.LOGGED_IN });
    }
  }
  function handleSetUser(e) {
    if (e?.detail?.user_id) {
      localStorage.user_id = e?.detail?.user_id;
      setUserId({ user_id: e?.detail?.user_id });
      setAuthorizationState({ state: AuthorizationStates.LOGGING_IN });
    }
  }
  function handleLogout(e) {
    dispatchCustomEventFn({ eventName: AlertEVENTS.ALERT, eventData: { message: e.detail.reason } });
    localStorage.clear();
    setUserId({ user_id: "" });
    setAuthorizationState({ state: AuthorizationStates.LOGGED_OUT });
  }
  if (authorizationState === AuthorizationStates.LOGGING_IN) {
    return <FullPageLoader />;
  }
  return <Outlet />;
};

export default CheckAuthorizationLayout;
