import { useQuery } from "@tanstack/react-query";

const useListingWrapper = ({ queryFn = () => null }) => {
  const Request = useQuery({ queryKey: [queryFn.name], queryFn, select: (data) => data?.data?.data || [] });
  return { ...Request };
};

export default useListingWrapper;
