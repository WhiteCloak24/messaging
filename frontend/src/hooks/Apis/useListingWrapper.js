import { useQuery } from "@tanstack/react-query";

const useListingWrapper = ({ queryFn = () => null, resourceKeys = [] }) => {
  const Request = useQuery({ queryKey: [queryFn.name], queryFn, select: (data) => data?.data?.data || [], gcTime: Infinity, staleTime: Infinity });
  return { ...Request };
};

export default useListingWrapper;
