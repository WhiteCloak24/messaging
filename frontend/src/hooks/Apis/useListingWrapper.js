import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getResourceUrl } from "../../api-service";

export const resourceUrls = {};
const useListingWrapper = ({ queryFn = () => null, resourceKeys = [] }) => {
  const Request = useQuery({ queryKey: [queryFn.name], queryFn, select: (data) => data?.data?.data || [], gcTime: Infinity, staleTime: Infinity });
  const { data = {} } = Request || {};

  const { mutate: getResourceUrlMutate } = useMutation({
    mutationKey: ["getResourceUrl"],
    mutationFn: getResourceUrl,
    onSuccess: ({ data }) => {
      resourceUrls[data?.data?.name] = data?.data?.url;
    },
  });

  useEffect(() => {
    if (data && Object.keys(data).length) {
      for (let index = 0; index < resourceKeys.length; index++) {
        const resource = resourceKeys[index];
        if (Object.keys(data).includes(resource?.name)) {
          if (!resourceUrls[data?.[resource?.name]]) {
            getResourceUrlMutate({ type: resource?.type, name: data?.[resource?.name] });
          }
        }
      }
    }
  }, [JSON.stringify(data)]);

  return { ...Request };
};

export default useListingWrapper;
