import { CirclePlus } from "lucide-react";
import React from "react";

const AddCard = () => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow flex items-center justify-center text-center">
      <div className="card-body p-4 flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-semibold truncate">
            <CirclePlus />
          </h3>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
