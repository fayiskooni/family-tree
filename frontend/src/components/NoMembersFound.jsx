import React from "react";

const NoMembersFound = () => {
  return (
    <div className="rounded-[1.6rem] border border-[#b6a77f]/35 bg-[#fff8ec]/80 p-8 text-center shadow-[0_18px_44px_-30px_rgba(20,58,45,0.45)]">
      <h3 className="mb-1 text-2xl font-bold text-[#274a3a]">No members yet</h3>
      <p className="text-sm text-[#4d5d53]">Add people to start linking your lineage.</p>
    </div>
  );
};

export default NoMembersFound;
