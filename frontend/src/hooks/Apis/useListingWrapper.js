import { useQuery } from "@tanstack/react-query";

const useListingWrapper = ({ queryKey = "", queryFn = () => null }) => {
  const Request = useQuery({ queryKey, queryFn, select: (data) => data?.data?.data || [] });
  return { ...Request };
};

export default useListingWrapper;
