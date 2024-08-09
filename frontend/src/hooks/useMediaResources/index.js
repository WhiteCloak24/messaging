import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const MediaResourceContext = createContext({
  resources: {},
  setResources: ({ newKey: newVal }) => null,
});

export const MediaResourcesProvider = ({ children }) => {
  const [state, setState] = useState({});

  const setResources = useCallback((data) => {
    setState((prev) => {
      return { ...prev, ...data };
    });
  }, []);

  const values = useMemo(() => ({ resources: state, setResources }), [JSON.stringify(state)]);
  return <MediaResourceContext.Provider value={values}>{children}</MediaResourceContext.Provider>;
};

export const useMediaResources = () => useContext(MediaResourceContext);
