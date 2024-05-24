import React from "react";
import { Outlet } from "react-router-dom";

const UnauthorizedLayout = () => {
  return (
    <div className="unauthorized-layout">
      <Outlet />
    </div>
  );
};

export default UnauthorizedLayout;
