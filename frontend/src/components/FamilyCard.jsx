import React from "react";

const FamilyCard = ({family}) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow flex items-center justify-center text-center">
      <div className="card-body p-4 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-semibold truncate">{family}</h3>
        </div>
      </div>
    </div>
  );
};

export default FamilyCard;
