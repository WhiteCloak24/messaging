import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AuthorizationStates } from "../../resources/constants";

const AuthContext = createContext({
  user_id: localStorage.user_id || "",
  session_id: localStorage.session_id || "",
  authorizationState: localStorage.user_id ? AuthorizationStates.LOGGING_IN : AuthorizationStates.LOGGED_OUT,
  AuthToken: "",
  setUserId: ({ user_id }) => null,
  setXAuthToken: ({ token }) => null,
  setAuthorizationState: ({ state }) => null,
});

export const AuthorizationProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    session_id: localStorage.session_id || "",
    user_id: localStorage.user_id || "",
    AuthToken: "",
    authorizationState: localStorage.user_id ? AuthorizationStates.LOGGING_IN : AuthorizationStates.LOGGED_OUT,
  });

  const setUserId = useCallback(({ user_id }) => {
    setAuthState((prev) => ({ ...prev, user_id }));
  }, []);
  const setSessionId = useCallback(({ session_id }) => {
    setAuthState((prev) => ({ ...prev, session_id }));
  }, []);

  const setXAuthToken = useCallback(({ token }) => {
    setAuthState((prev) => ({ ...prev, AuthToken: token }));
  }, []);
  const setAuthorizationState = useCallback(({ state }) => {
    setAuthState((prev) => ({ ...prev, authorizationState: state }));
  }, []);

  const { user_id, authorizationState, AuthToken, session_id } = authState;

  const values = useMemo(
    () => ({ user_id, session_id, authorizationState, AuthToken, setAuthorizationState, setXAuthToken, setUserId, setSessionId }),
    [authState?.user_id, authorizationState, AuthToken]
  );
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthorization = () => useContext(AuthContext);
