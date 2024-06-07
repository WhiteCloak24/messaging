import React from "react";
import SidebarHeader from "./SidebarHeader";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import { userListing } from "../../../api-service";
import SidebarListing from "./SidebarListing";

const SidebarLayout = () => {
  const { data } = useListingWrapper({ queryFn: userListing, queryKey: ["userListing"] });
  console.log({ data });
  return (
    <div className="border w-1/4">
      <SidebarHeader />
      <SidebarListing />
    </div>
  );
};

export default SidebarLayout;
