import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AuthorizationStates } from "../../resources/constants";

const AuthContext = createContext({
  user_id: "",
  setXAuthToken: () => null,
  setUserId: () => null,
});

export const AuthorizationProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ user_id: "", AuthToken: "", authorizationState: AuthorizationStates.LOGGED_OUT });

  const setUserId = useCallback(({ user_id }) => {
    setAuthState((prev) => ({ ...prev, user_id }));
  }, []);

  const setXAuthToken = useCallback(({ token }) => {
    setAuthState((prev) => ({ ...prev, "X-Auth-Token": token }));
  }, []);

  const { user_id, authorizationState, AuthToken } = authState;

  const values = useMemo(
    () => ({ user_id, setXAuthToken, setUserId, authorizationState, AuthToken }),
    [authState?.user_id, authorizationState, AuthToken]
  );
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuthorization = () => useContext(AuthContext);
