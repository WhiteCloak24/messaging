import { createContext, useCallback, useContext, useMemo, useState } from "react";

const MediaResourceContext = createContext({
  resources: {},
  setResources: ({ newKey: newVal }) => null,
});

export const MediaResourcesProvider = ({ children }) => {
  const [state, setState] = useState({});

  const setResources = useCallback(({ newKey: newVal }) => {
    setState((prev) => ({ ...prev, newKey: newVal }));
  }, []);

  const values = useMemo(() => ({ resources: state, setResources }), [JSON.stringify(state)]);
  return <MediaResourceContext.Provider value={values}>{children}</MediaResourceContext.Provider>;
};

export const useMediaResources = () => useContext(MediaResourceContext);
