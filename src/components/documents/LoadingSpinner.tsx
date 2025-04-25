
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
    </div>
  );
};

export default LoadingSpinner;
