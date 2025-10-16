import React from "react";

const MemberCard = ({member}) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow flex items-center justify-center text-center">
      <div className="card-body p-4 flex items-center justify-center">
        {/* USER INFO */}
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-semibold truncate">{member.name}</h3>
        </div>
        {member.age}
      </div>
    </div>
  );
};

export default MemberCard;
