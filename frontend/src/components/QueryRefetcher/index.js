import React, { useCallback, useEffect } from "react";
import { RefetchQuery } from "../../resources/constants";
import { useQueryClient } from "@tanstack/react-query";

const QueryRefetcher = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    window.addEventListener(RefetchQuery, handleQueryRefetch);
    return () => window.removeEventListener(RefetchQuery, handleQueryRefetch);
  }, []);

  const handleQueryRefetch = useCallback((e) => {
    queryClient.invalidateQueries({ queryKey: [e.detail?.queryKey], exact: false });
  }, []);
  return <></>;
};

export default QueryRefetcher;
