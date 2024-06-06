import { useQuery } from "@tanstack/react-query";

const useListingWrapper = ({ queryKey = "", queryFn = () => null }) => {
  const Request = useQuery({ queryKey, queryFn });
  return { Request };
};

export default useListingWrapper;
