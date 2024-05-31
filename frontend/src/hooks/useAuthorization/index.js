import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AuthorizationStates } from "../../resources/constants";

const AuthContext = createContext({
  user_id: "",
  authorizationState: AuthorizationStates.LOGGED_OUT,
  AuthToken: "",
  setUserId: ({ user_id }) => null,
  setXAuthToken: ({ token }) => null,
  setAuthorizationState: ({ state }) => null,
});

export const AuthorizationProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user_id: localStorage.user_id || "",
    AuthToken: "",
    authorizationState: AuthorizationStates.LOGGED_OUT,
  });

  const setUserId = useCallback(({ user_id }) => {
    setAuthState((prev) => ({ ...prev, user_id }));
  }, []);

  const setXAuthToken = useCallback(({ token }) => {
    setAuthState((prev) => ({ ...prev, AuthToken: token }));
  }, []);
  const setAuthorizationState = useCallback(({ state }) => {
    setAuthState((prev) => ({ ...prev, authorizationState: state }));
  }, []);

  const { user_id, authorizationState, AuthToken } = authState;

  const values = useMemo(
    () => ({ user_id, authorizationState, AuthToken, setAuthorizationState, setXAuthToken, setUserId }),
    [authState?.user_id, authorizationState, AuthToken]
  );
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthorization = () => useContext(AuthContext);
