import React from "react";

const FullPageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default FullPageLoader;
