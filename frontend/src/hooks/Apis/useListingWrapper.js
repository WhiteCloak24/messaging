import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getResourceUrl } from "../../api-service";
import { useMediaResources } from "../useMediaResources";

const getProcessedResource = async (url) => {
  try {
    const data = await fetch(url);
    const blob = await data?.blob();
    return { blob };
  } catch (err) {
    return {
      blob: {},
    };
  }
};

const useListingWrapper = ({ queryFn = () => null, resourceKeys = [] }) => {
  const { resources, setResources } = useMediaResources();
  const Request = useQuery({ queryKey: [queryFn.name], queryFn, select: (data) => data?.data?.data || [], gcTime: Infinity, staleTime: Infinity });
  const { data = {} } = Request || {};

  const { mutate: getResourceUrlMutate } = useMutation({
    mutationKey: ["getResourceUrl"],
    mutationFn: getResourceUrl,
    onSuccess: async ({ data }) => {
      const { blob } = await getProcessedResource(data?.data?.url);
      const url = URL.createObjectURL(blob);
      setResources({ [data?.data?.name || "unknown"]: url });
    },
  });

  useEffect(() => {
    if (data && !(data instanceof Array) && Object.keys(data).length) {
      for (let index = 0; index < resourceKeys.length; index++) {
        const resource = resourceKeys[index];
        if (Object.keys(data).includes(resource?.name)) {
          if (!resources[data?.[resource?.name]] && data?.[resource?.name]) {
            getResourceUrlMutate({ type: resource?.type, name: data?.[resource?.name] });
          }
        }
      }
    }
    if (data && data instanceof Array && data.length) {
      for (let index = 0; index < data.length; index++) {
        const dataRow = data[index];

        for (let index = 0; index < resourceKeys.length; index++) {
          const resource = resourceKeys[index];
          if (Object.keys(dataRow).includes(resource?.name)) {
            if (!resources[dataRow?.[resource?.name]] && dataRow?.[resource?.name]) {
              getResourceUrlMutate({ type: resource?.type, name: dataRow?.[resource?.name] });
            }
          }
        }
      }
    }
  }, [JSON.stringify(data)]);

  return { ...Request };
};

export default useListingWrapper;
