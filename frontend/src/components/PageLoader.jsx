import { LoaderIcon } from "lucide-react";
import React from "react";

const PageLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="heritage-panel flex items-center gap-3 px-5 py-3">
        <LoaderIcon className="size-5 animate-spin text-primary" />
        <span className="text-sm font-semibold text-[#2a4f3f]">Loading records...</span>
      </div>
    </div>
  );
};

export default PageLoader;
